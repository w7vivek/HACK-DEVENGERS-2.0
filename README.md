# NAMI

https://drive.google.com/file/d/1FvIdSiX2o8qsj7GC3VHm7qcCwsHqZiCq/view?usp=sharing

"The payment that flow."

A MERN stack transaction management system designed for recording payments via UPI, Cash, and Net Banking, paired with a companion desktop Python agent that syncs confirmed transactions directly into a local Excel spreadsheet.

---

## Architecture Overview

1. **Client (`client/`)**: React (Vite) interface styled with Tailwind CSS and `motion/react`. Uses custom Motion Primitives components (Dock, GlowEffect, TextRoll, TextShimmer, ToolbarExpandable, MorphingDialog, MorphingPopover, ProgressiveBlur, TransitionPanel) and role-aware styling (`user` vs `admin`).
2. **Server (`server/`)**: Express API with Mongoose, JWT authentication with httpOnly/secure cookies, rate limiting, and input validation. Restricts payment methods exclusively to `UPI`, `Cash`, and `Net Banking`.
3. **Desktop Agent (`desktop-agent/`)**: Python background daemon with system tray integration. Polls the backend for unsynced transactions, asks for user confirmation, writes rows to `NAMI_Transactions.xlsx`, opens the file, and marks records as synced.

---

## Project Structure

```
nami/
├── client/
│   ├── public/
│   │   ├── cursors/
│   │   │   ├── pay-cursor.svg
│   │   │   └── pay-cursor-pointer.svg
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js
│   │   ├── components/
│   │   │   ├── motion-primitives/
│   │   │   │   ├── Dock.jsx
│   │   │   │   ├── GlowEffect.jsx
│   │   │   │   ├── MorphingDialog.jsx
│   │   │   │   ├── MorphingPopover.jsx
│   │   │   │   ├── ProgressiveBlur.jsx
│   │   │   │   ├── TextRoll.jsx
│   │   │   │   ├── TextShimmer.jsx
│   │   │   │   ├── ToolbarExpandable.jsx
│   │   │   │   └── TransitionPanel.jsx
│   │   │   ├── AdminOverview.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── LiveFeed.jsx
│   │   │   ├── NavbarDock.jsx
│   │   │   └── TransactionForm.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   └── HowItWorks.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── middleware/
│   │   ├── rateLimiter.js
│   │   ├── requireAdmin.js
│   │   └── verifyToken.js
│   ├── models/
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── transactions.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── desktop-agent/
│   ├── agent.py
│   ├── requirements.txt
│   └── .gitignore
├── .gitignore
└── README.md
```

---

## Environment Configuration

Copy `server/.env.example` to `server/.env`:

```bash
cp server/.env.example server/.env
```

Set the required environment variables:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string (Atlas or local) |
| `JWT_ACCESS_SECRET` | 64-character random string for signing access tokens |
| `JWT_REFRESH_SECRET` | 64-character random string for signing refresh tokens |
| `ACCESS_TOKEN_EXPIRY` | Access token lifespan (default: `15m`) |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifespan (default: `7d`) |
| `PORT` | Express server port (default: `5000`) |
| `CLIENT_URL` | Allowed origin for CORS (default: `http://localhost:5173`) |

---

## Running the Backend

```bash
cd server
npm install
npm run dev
```

The server will start on port 5000 and connect to the MongoDB instance.

---

## Running the Frontend

```bash
cd client
npm install
npm run dev
```

The Vite dev server will run on `http://localhost:5173` and proxy `/api` requests to `http://localhost:5000`.

---

## Setting Up the Desktop Sync Agent

The desktop sync agent runs locally in the background to append confirmed records to `NAMI_Transactions.xlsx`.

### 1. Virtual Environment & Dependencies

#### Windows
```powershell
cd desktop-agent
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

#### macOS / Linux
```bash
cd desktop-agent
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Running the Agent

```bash
python agent.py
```

- On first run, a sign-in dialog prompts for your NAMI account credentials.
- The session token is cached locally in `~/.nami_token.json`.
- The agent sits in your system tray and polls `/api/transactions/unsynced` every 15 minutes.
- When unsynced transactions exist, a native dialog prompts to add them to Excel.

### 3. Autostart Setup

- **Windows**: Package with `pyinstaller --onefile --noconsole agent.py` within the activated venv, then place a shortcut to `dist/agent.exe` into the Startup folder (`Win + R` → `shell:startup`).
- **macOS**: Create a LaunchAgent plist in `~/Library/LaunchAgents/` pointing to `desktop-agent/venv/bin/python3` and `agent.py`, then load it with `launchctl load`.
- **Linux**: Create a `.desktop` file in `~/.config/autostart/` with `Exec` pointing to `desktop-agent/venv/bin/python3 /path/to/agent.py`.

---

## Attribution

- Custom cursor icon design inspired by juicy_fish — [Flaticon Pay Per Click Icon](https://www.flaticon.com/free-icon/pay-per-click_6404945).
