# Switching www.vjstartup.com to the new site

Today www.vjstartup.com serves an old static build and the old backend (`/be/*` answers with old 404 pages). The new site is already deployed on gamma: the frontend on port 3005 and backend 2 on port 6220. This is the order to switch, who does each step, and how to undo it.

VJOS-side steps (team import with `public_site`, problem and idea imports, Google sign-in settings in VJOS admin) are on the VJOS deploy checklist. This runbook says when to run them.

## 1. Settings (Tanush)
Set everything in the **"Set these now"** table of [SETTINGS.md](SETTINGS.md), in the `vj-production` environment. In particular, `PLANE_API_URL` must be set before PR #30 merges.

In the Google Cloud Console, the OAuth client's *Authorized JavaScript origins* must include `https://www.vjstartup.com`, plus `https://vjstartup.com` if that host will serve pages.

## 2. Merge (Tanush)
Merge PR #29 (site settings), then PR #30 (deploy settings). Wait for the main deploy to go green.

Check the deploy log:
- **"Apply site database changes"** reports its statements as applied.
- **The required-settings warning** names nothing. If it names a setting, go back to step 1.

## 3. Smoke test on gamma, before anything public changes (Pavani, or anyone on the network)
Replace `<gamma>` with gamma's address.

```bash
for p in stats-api content-api story-api/stories leaderboard-api/members auth/config; do
  printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code} %{content_type}\n' "http://<gamma>:6220/$p"
done
curl -s -o /dev/null -w '%{http_code}\n' http://<gamma>:3005/programs/startup-challenge-2
```

Every line should be `200 application/json`, and the last one `200`: a deep link must return the app, not a 404.
- `auth/config` must show a `googleClientId`.
- `leaderboard-api/members` proves backend 2 can reach VJOS through `PLANE_API_URL`.

Also confirm that the old backend stays reachable at its own address after the switch, and write that address down for step 6.

## 4. Import (VJOS deploy owner)
Run the problems-and-ideas import immediately before the switch.

## 5. Switch the proxy (Pavani)
- `www.vjstartup.com/be/*` goes to `gamma:6220`, **with the `/be` prefix stripped**. Backend 2 serves `/problem-api`, `/stats-api` and so on at its root.
- Everything else on `www.vjstartup.com` goes to `gamma:3005`. Unknown paths must return `index.html`, because the site routes in the browser.
- Pass the real `Host` and `X-Forwarded-Proto` headers through.

## 6. Import again (VJOS deploy owner)
Immediately after the switch, run the import with `legacy_url=<old backend address from step 3>`. Without that input, the import would read www's `/be`, which is now the new backend.

## 7. Check (site-code session + Tanush)
- Go through every page on desktop and phone: home, problems, ideas, startups, programs, a program, stories, club, leaderboard, journey, login.
- Tanush signs in with Google, which exercises backend 2 → VJOS user upsert.
- An admin opens `/manage`.

## 8. Bare domain (Pavani)
- Redirect `vjstartup.com` with a 301 to `https://www.vjstartup.com`, keeping the path.
- Fix the certificate on `dev-vj.vjstartup.com`.

## Rolling back
Keep the old static build and the old backend running, unchanged, for about a week. Rolling back means reverting Pavani's proxy change from step 5.

Anything submitted on the new site after the switch is only in the new database (Postgres). A rollback would not show it on the old site. Decide before step 5 whether that risk is acceptable for the first days.
