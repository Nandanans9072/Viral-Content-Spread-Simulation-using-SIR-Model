# LabHub

LabHub is a full-stack GitHub-style pull request dashboard with authentication, repository management, and pull request details.

## Project Structure

- `backend/` - Express API, authentication, and database access
- `frontend/` - React + Vite client UI

## Run Locally

1. Install dependencies in both apps.

```bash
cd frontend
npm install
npm run dev
```

```bash
cd backend
npm install
node server.js
```

The frontend runs on the Vite dev server, and the backend runs on port `5000` by default.

## Push To GitHub

```bash
git add .
git commit -m "Update LabHub README"
git push origin main
```

## Tech Stack

- React
- Vite
- Express
- MySQL
- JWT authentication