# QuantumDocsSyncer

Auto-updating documentation system for the Quantum Language compiler.
Watches your GitHub repo, generates explanations via HuggingFace, and commits them to a separate docs repo.

## Project Structure

```
QuantumDocsSyncer/
├── server/     Express + Mongoose backend (port 5000)
└── client/     React + Webpack frontend  (port 3000)
```

## Run Locally

### Terminal 1 — Backend
```bash
cd server
npm install
node index.js
```

### Terminal 2 — Frontend
```bash
cd client
npm install
npm start
```

Open http://localhost:3000

The webpack dev server proxies `/api/*` to `http://localhost:5000` automatically.

## Deploy to Vercel

### Backend
```bash
cd server
vercel --prod
```
Add all variables from `server/.env` in Vercel → Settings → Environment Variables.

### Frontend
```bash
cd client
npm run build
# deploy the dist/ folder
vercel dist/ --prod
```

After deploying backend, update the proxy target in `client/webpack.config.js` to point to your Vercel backend URL.
