# CampusX — accounts backend

## What this folder is
The CampusX site files, updated so sign-up, sign-in, profiles and the admin
account screen now talk to your Supabase project.

## Files
- `public/` — the site.
  - `campusx-backend.js` — new. Talks to Supabase: sign up, sign in, sign out,
    profile save, admin list / deactivate / delete.
  - `campusx-config.js` — new. Holds your Supabase project address and the
    publishable key. Both are browser-public values; never put a service-role
    key in here.
  - `index.html`, `dashboard.html`, `admin.html` — each now loads
    `campusx-config.js` then `campusx-backend.js` before its own script.
  - `app.js`, `dashboard.js`, `admin.js` — the forms and buttons call the
    Supabase functions above instead of saving accounts in the browser only.
- `supabase/campusx-setup.sql` — the database setup you already ran in the SQL
    Editor. Kept here so the repo records how the tables were created.

## Behaviour now
- New account: name, email, password -> Supabase sends a confirmation email ->
  they sign in after clicking the link.
- Profiles (name, phone, campus, department, level) are stored in the database,
  so they follow the user to any device.
- Admin rights come from the `user_roles` table. The six approved emails become
  admins once their email is confirmed. The email list in the page scripts is
  display only and grants nothing.
- Deactivated accounts cannot sign in.

## Not moved yet
Markets, wallet, positions and payments still live in each visitor's browser.

## Supabase settings to check
- Keep email confirmation ON (Authentication → Sign In / Providers → Email). With it off, anyone could sign up with an admin email.
- Add your live site address (e.g. the Render URL) under Authentication → URL Configuration → Site URL and Redirect URLs, so confirmation links open your site.
