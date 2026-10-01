# Deployment settings

Every setting the site needs, where it goes, and what happens when it's missing.
Values are never written in this repository (it's public). Set them in GitHub under
**Settings → Environments**:

- `vj-production` (deploys from `main` to gamma, www.vjstartup.com)
- `vj-development` (deploys from `dev` to dev-ai, dev-vj.vjstartup.com)

The deploy workflow (`.github/workflows/deploy.yml`) writes them into the backend's `.env` and the frontend build.

## Set these now (checked 2026-10-01)

Today `vj-production` holds only `PLANE_DATABASE_URL` and `VITE_API_BASE_URL`, and has no variables. `GOOGLE_CLIENT_ID` and `PLANE_INTERNAL_TOKEN` exist as **repository** secrets, which every environment can read. An environment secret with the same name **overrides** a repository secret.

Add to **`vj-production`**:

| Add as | Name | Value | Without it |
|---|---|---|---|
| variable | `PLANE_API_URL` | `https://vjos.vjstartup.com`, unless Pavani gives an internal address gamma should use | Login, the leaderboard and startup workspaces stop working. **Set this before PR #30 merges**: that PR removes the deploy's built-in default. |
| secret | `ADMIN_EMAILS` | The admins' emails, comma separated | Nobody can become a site admin by signing in. |
| secret | `CLOUDINARY_CLOUD_NAME` | The team's Cloudinary cloud name | Uploads fail (startup files, story and venture photos). |
| secret | `CLOUDINARY_API_KEY` | From the Cloudinary dashboard | Uploads fail. |
| secret | `CLOUDINARY_API_SECRET` | From the Cloudinary dashboard | Uploads fail. |
| variable | `PLANE_ADMIN_URL` | `https://vjos.vjstartup.com/god-mode/` | No "Admin panel" link for admins. |

Add `PLANE_API_URL` (variable) to **`vj-development`** as well. Its other settings are already there or come from the repository secrets.

Already fine:
- `GOOGLE_CLIENT_ID` and `PLANE_INTERNAL_TOKEN`: repository secrets.
- `PLANE_DATABASE_URL` and `VITE_API_BASE_URL`: environment secrets.
- `CORS_ORIGINS`: the built-in list covers www, the bare domain and dev-vj.

## Backend (runtime)

| Name | Secret or variable | Needed? | What it is |
|---|---|---|---|
| `PLANE_DATABASE_URL` | secret | **required** | The shared Plane Postgres, as the backend container reaches it. |
| `GOOGLE_CLIENT_ID` | secret | **required** | The Google OAuth client id. Sign-ins are checked against it, and the login page reads it from the backend (`GET /auth/config`). It is set only here. |
| `PLANE_API_URL` | variable | **required** | VJOS (Plane) as the backend reaches it, e.g. `https://vjos.vjstartup.com`. Used for login, the leaderboard and startup workspaces. |
| `PLANE_INTERNAL_TOKEN` | secret | **required** | Must equal Plane's `PUBLIC_SITE_INTERNAL_TOKEN` exactly. Server-to-server only. |
| `CLOUDINARY_CLOUD_NAME` | secret | **required** for uploads | Startup files, story photos and venture photos. |
| `CLOUDINARY_API_KEY` | secret | **required** for uploads | |
| `CLOUDINARY_API_SECRET` | secret | **required** for uploads | |
| `ADMIN_EMAILS` | secret | recommended | Comma-separated emails that become admins when they sign in (`a@x.com,b@y.com`, no brackets or spaces). |
| `PLANE_ADMIN_URL` | variable | optional | VJOS's admin page (e.g. `https://vjos.vjstartup.com/god-mode/`), linked in the nav for admins. If unset, there is no link. |
| `CORS_ORIGINS` | variable | optional | Comma-separated browser origins allowed to call the API. If set, it replaces the built-in list (`https://www.vjstartup.com`, `https://vjstartup.com`, `https://hub.vjstartup.com`, `https://dev-vj.vjstartup.com`). |
| `INSTITUTIONAL_EMAIL_DOMAINS` | variable | optional | The college email domains. Default `vnrvjiet.in`. |

The deploy sets `NODE_ENV` itself (`production` on main, after PR #30), which drops the localhost origins from the CORS list. It also prints a warning naming every required setting that is empty. It prints names only.

## Frontend (build time, baked into the build)

| Name | Secret or variable | Needed? | What it is |
|---|---|---|---|
| `VITE_API_BASE_URL` | secret | optional | Where the API lives, e.g. `https://www.vjstartup.com/be`. If unset, a production build uses `/be` on its own domain. |
| `VITE_DEBUG_MODE` | secret | optional | `true` shows debug buttons. Default `false`. |
| `VITE_TEAM_SHEET_ID` | (not passed yet) | optional | A Google Sheet to read the club team from instead of the bundled list. |
| `VITE_GOOGLE_SHEETS_API_KEY` | secret | optional | Speeds up reading that sheet. |

**No longer read** by the site, so these can be deleted once this version is deployed: `VITE_GOOGLE_CLIENT` (now `GOOGLE_CLIENT_ID` on the backend), `VITE_PLANE_ADMIN_URL` (now `PLANE_ADMIN_URL`), `VITE_AUTH_URL` and `VITE_GOOGLE_SPREADSHEET_ID`.

## Outside GitHub

- **Google Cloud Console**, the OAuth client's *Authorized JavaScript origins*: `https://www.vjstartup.com`, plus `https://vjstartup.com` if that host serves pages instead of redirecting.
- **Plane**: `PUBLIC_SITE_INTERNAL_TOKEN`, in Plane's own deploy secrets, must match `PLANE_INTERNAL_TOKEN` above.

## What happens when a setting is missing

Nothing falls back to a built-in production value.

- **At start-up**, the backend logs one line per missing required setting. It logs names only, never values, for example `⚠️  PLANE_API_URL is not set: login, the leaderboard and startup workspaces won't work.` The server still starts, so one missing upload key doesn't take the whole site down.
- **Login** answers `503 Login is not set up on this server yet` if `GOOGLE_CLIENT_ID`, `PLANE_API_URL` or `PLANE_INTERNAL_TOKEN` is missing. If `GOOGLE_CLIENT_ID` is missing, the login page shows "Sign-in isn't available right now" instead of a broken Google button.
- **The leaderboard** answers `502 Leaderboard unavailable` and logs `PLANE_API_URL is not set`.
- **Creating a startup** still saves the startup. It logs that its VJOS workspace couldn't be set up; that step is safe to retry later.
- **Uploads** fail with an error message while the `CLOUDINARY_*` values are missing.
