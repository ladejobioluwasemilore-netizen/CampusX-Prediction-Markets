# Shared markets and profiles

1. In the existing CampusX account project's SQL Editor, run `shared-markets-setup.sql`. It uses the accounts and administrator roles already installed by `campusx-setup.sql`; it does not create a different account service.
2. Deploy the updated site files together, including `campusx-markets.js`.
3. Sign in with an existing confirmed administrator account. Create a market in Market Studio or the dashboard's admin area, then open a different signed-in user account in another browser. The market should appear automatically (within 15 seconds if real-time delivery is unavailable).
4. Edit prices and confirm both accounts show the same prices: Market Studio shows share prices and the dashboard shows their reciprocal decimal odds. Delete or close a market from the dashboard and check the other account.
5. Save a name and institution on the profile page. Sign out, then sign in on another browser and confirm both values load. Clearing the institution should remain cleared.

Database rules permit active signed-in users to read shared markets and only active administrators to write. Administrator roles come from `user_roles`, not a browser email allowlist. Profiles retain the existing own-account update policy, with editable columns restricted to personal details.

The shared list is authoritative after it loads: local demo catalogues are not automatically published. Create actual markets through either admin screen. Market writes use only changed records and explicit deletion markers, so an older browser does not erase another administrator's new markets.

Live account verification and applying this SQL require the project owner's account access; mock browser checks are not a substitute. Wallets, payments, challenge entries, and other prototype-only features are outside this change.