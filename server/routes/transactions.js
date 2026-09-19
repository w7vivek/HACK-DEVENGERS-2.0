import express from 'express';
import { body, validationResult } from 'express-validator';
import Transaction from '../models/Transaction.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = express.Router();

router.use(verifyToken);

router.post(
  '/',
  [
    body('sender').trim().notEmpty().withMessage('Sender name is required'),
    body('receiver').trim().notEmpty().withMessage('Receiver name is required'),
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
    body('mode')
      .isIn(['UPI', 'Cash', 'Net Banking'])
      .withMessage('Payment mode must be UPI, Cash, or Net Banking'),
    body('accountHolder')
      .if(body('mode').equals('Net Banking'))
      .trim()
      .notEmpty()
      .withMessage('Account holder name is required for Net Banking'),
    body('accountNumber')
      .if(body('mode').equals('Net Banking'))
      .trim()
      .notEmpty()
      .withMessage('Account number is required for Net Banking'),
    body('ifsc')
      .if(body('mode').equals('Net Banking'))
      .trim()
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .withMessage('Valid IFSC code is required (e.g. HDFC0001234)'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg });
    }

    const { sender, receiver, amount, mode, accountHolder, accountNumber, ifsc } = req.body;

    try {
      const tx = await Transaction.create({
        userId: req.user.id,
        sender,
        receiver,
        amount: Number(amount),
        mode,
        accountHolder: mode === 'Net Banking' ? accountHolder : undefined,
        accountNumber: mode === 'Net Banking' ? accountNumber : undefined,
        ifsc: mode === 'Net Banking' ? ifsc?.toUpperCase() : undefined,
        confirmed: false,
        syncedToExcel: false,
      });

      return res.status(201).json(tx);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to create transaction' });
    }
  }
);

router.patch('/:id/confirm', async (req, res) => {
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!tx) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    tx.confirmed = true;
    await tx.save();

    return res.json({ message: 'Transaction confirmed', transaction: tx });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to confirm transaction' });
  }
});

router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  try {
    const filter = { userId: req.user.id, confirmed: true };
    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Transaction.countDocuments(filter),
    ]);

    return res.json({
      transactions,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

router.get('/unsynced', async (req, res) => {
  try {
    const unsynced = await Transaction.find({
      userId: req.user.id,
      confirmed: true,
      syncedToExcel: false,
    }).sort({ createdAt: -1 });

    return res.json({ transactions: unsynced, count: unsynced.length });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch unsynced transactions' });
  }
});

router.post('/mark-synced', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Array of transaction IDs required' });
  }

  try {
    const result = await Transaction.updateMany(
      { _id: { $in: ids }, userId: req.user.id },
      { $set: { syncedToExcel: true } }
    );

    return res.json({ message: 'Transactions marked as synced', modifiedCount: result.modifiedCount });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update sync status' });
  }
});

router.get('/all', requireAdmin, async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const sortBy = req.query.sortBy === 'amount' ? 'amount' : 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;
  const mode = req.query.mode;

  const filter = {};
  if (mode && ['UPI', 'Cash', 'Net Banking'].includes(mode)) {
    filter.mode = mode;
  }

  try {
    const skip = (page - 1) * limit;
    const [transactions, total, stats] = await Promise.all([
      Transaction.find(filter)
        .populate('userId', 'name email')
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(filter),
      Transaction.aggregate([
        {
          $group: {
            _id: null,
            totalVolume: { $sum: '$amount' },
            avgAmount: { $avg: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    return res.json({
      transactions,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      stats: stats[0] || { totalVolume: 0, avgAmount: 0, count: 0 },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch admin transactions' });
  }
});

export default router;
