# WIMESSA Website

React + Vite frontend with an Express API for events (Google Calendar) and contact form email.

---

## Private information and security

**This repository contains no secrets.** If you clone the repo, you get only code and config templates. No API keys, passwords, or private email addresses are committed.

- **Never committed (gitignored):**  
  `.env`, `.env.development`, `.env.production` — these hold API keys, passwords, and email addresses. They are in [.gitignore](.gitignore) and must stay out of the repo.

- **What you must do after cloning:**  
Create your own `.env` by copying [.env.example](.env.example). Fill in your own values (Resend API key, Gmail App Password, contact email, etc.). **Do not commit `.env`** or paste real keys into any file that gets committed.
- **What belongs where:**  
  - **Local development:** Put secrets only in `.env` (or `.env.development`) on your machine.  
  - **Production frontend (e.g. GitHub Actions):** Use **Settings → Secrets and variables → Actions** for `VITE_API_URL`, `VITE_EVENTS_API`.  
  - **Production backend (e.g. Render):** Use the host’s **Environment** / **Variables** for `CONTACT_EMAIL`, `RESEND_API_KEY`, `SMTP_FROM`, `GOOGLE_CALENDAR_ICAL_URL`, etc.
- **If you ever commit a secret:** Rotate it immediately (new API key, new password) and remove the secret from git history (e.g. `git filter-branch` or BFG Repo-Cleaner). Consider the old value compromised.

---

## First-time setup (after cloning)

```bash
npm install
cp .env.example .env
```

Edit `.env` and add your own values (see [Environment variables](#environment-variables) below). Do not commit `.env`.

---

## Running locally

- **Frontend**: `npm run dev` (Vite dev server; proxies `/api` to the backend).
- **Backend**: `npm run server` (Express on port 3001).

## How to test the contact form

1. **Set up `.env`** in the project root with at least:
  - `CONTACT_EMAIL` = your email (where you want to receive test messages)
  - Gmail: `SMTP_USER` (your Gmail), `SMTP_PASS` (App Password), or  
  - Resend: `RESEND_API_KEY` (and `SMTP_FROM` if required)
2. **Start the backend** (in one terminal):
  ```bash
   npm run server
  ```
   You should see: `Events API running at http://localhost:3001`
3. **Start the frontend** (in another terminal):
  ```bash
   npm run dev
  ```
   Open the URL shown (e.g. [http://localhost:5173](http://localhost:5173)).
4. **Test in the browser**: Go to **Contact**, fill in name, email, and message, click **Send message**. You should see a success message and receive an email at `CONTACT_EMAIL`.
5. **Test the API directly** (optional):
  ```bash
   curl -X POST http://localhost:3001/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"you@example.com","subject":"Hi","message":"Test message"}'
  ```
   Expect `{"message":"Message sent successfully."}` or an error JSON.

If the form says "Contact form is not configured" or "Email is not configured", check that `CONTACT_EMAIL` and either Gmail or Resend credentials are set in `.env`.

## Environment variables

All of these are **secret or environment-specific**. Store them only in `.env` locally or in your deployment platform’s env/secrets. **Never commit them.**


| Variable                   | Used by          | Description                                                                                            |
| -------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------ |
| `GOOGLE_CALENDAR_ICAL_URL` | Backend          | Public iCal feed URL for the events API.                                                               |
| `CONTACT_EMAIL`            | Backend          | Email address that receives contact form submissions.                                                  |
| `SMTP_USER`, `SMTP_PASS`   | Backend          | Gmail credentials (use an [App Password](https://support.google.com/accounts/answer/185833) with 2FA). |
| `RESEND_API_KEY`           | Backend          | Resend API key; use with `SMTP_FROM` (e.g. `onboarding@resend.dev`).                                   |
| `SMTP_FROM`                | Backend          | “From” address when using Resend.                                                                      |
| `VITE_API_URL`             | Frontend (build) | Production API base URL; set in **GitHub Actions secrets**, not in the repo.                           |
| `VITE_EVENTS_API`          | Frontend (build) | Production events API URL; set in **GitHub Actions secrets** if needed.                                |


See [.env.example](.env.example) for a full list and comments. Copy it to `.env` and fill in your values; keep `.env`, `.env.development`, and `.env.production` out of the repo (they are in [.gitignore](.gitignore)).

## Production

Production config and secrets are **not in the repo**. Set them in your hosting and CI platforms only.

### Frontend (this repo deploys `dist/` to SiteGround via GitHub Actions)

- **Build-time env vars:** In GitHub go to **Settings → Secrets and variables → Actions**. Add repository secrets (do not put these in any file in the repo):
  - `VITE_API_URL` — production API base URL (e.g. `https://wimessa-api.onrender.com`).
  - `VITE_EVENTS_API` — production events API URL if different (e.g. your Cloudflare Worker URL).
- The [deploy workflow](.github/workflows/deploy.yml) passes these into `npm run build`. The built site then calls your production APIs.

### Backend (Express API – contact form + events)

The Express server is not deployed by the current workflow. Run it on a host (e.g. Render) and set env vars **only in that host’s dashboard** — never in the repo.

**Step-by-step for Render:** see **[docs/DEPLOY_RENDER.md](docs/DEPLOY_RENDER.md)**.

- **CONTACT_EMAIL** – address that receives contact form submissions.
- **SMTP** (Gmail): **SMTP_USER**, **SMTP_PASS** (App Password).  
- **Or Resend**: **RESEND_API_KEY**; optionally **SMTP_FROM**, **SMTP_HOST**, **SMTP_PORT**.
- **Events**: **GOOGLE_CALENDAR_ICAL_URL** for the events API.

Set these **only** in the backend host environment (never in the repo):

- **Render, Railway, Fly.io, Heroku:** Project dashboard → your service → **Environment** / **Variables** / **Secrets**.
- **SiteGround (Node/SSH):** `.env` on the server or control panel environment variables.
- **Your own VPS:** `.env` in the app directory (do not add to git) or systemd/env config.


Then add the **VITE_API_URL** secret in GitHub Actions (see Frontend above) so the built site calls your backend URL.

---

## React + Vite (template notes)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and `[typescript-eslint](https://typescript-eslint.io)` in your project.