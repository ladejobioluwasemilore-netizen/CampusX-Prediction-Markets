# CampusX — Frontend-only preview

CampusX is currently configured to run as a standalone static website. It does not require a database, Node server, API, environment variables, or backend deployment for its current preview functionality.

## Run it

1. Extract the project folder.
2. Open `public/index.html` in a browser, or publish the contents of `public/` as a static site (for example, GitHub Pages, Netlify, or a static hosting service).
3. Create an account with your email and password, then sign in. Accounts, markets, preferences, wallet display state, and positions are stored in that browser's local storage.

## Included in standalone mode

- Local email/password signup and login.
- Automatic local administrator role assignment for the six approved administrator email addresses.
- Dashboard, All Markets, portfolio, profile, preferences, notifications, and local market selections.
- Admin dashboard with local market creation, price editing, account search, account deactivation/reactivation, and account deletion.
- Responsive landing page and dashboard, charts, and existing visual effects.

## Approved administrator email mapping

- `progjossytech@gmail.com` → `Jossy08`
- `shinaayomiawwal@gmail.com` → `Awwa_1`
- `rachealkumapayi@gmail.com` → `Honey13`
- `mohd.yusuph08@gmail.com` → `Yusuph24`
- `amusafarid@gmail.com` → `Farid10`
- `digimide1@gmail.com` → `Digimide00`

## Important preview limitations

This is a browser-only prototype. Data is saved only in the current browser/device and is not shared between users or devices. Clearing browser storage removes the locally saved accounts and activity. Administrator permissions are only a front-end convenience in this preview and are not secure against a technically capable user. Do not use this version for real-money deposits, withdrawals, payments, or live betting.

Google sign-in is displayed as a disabled option until the authentication backend and verified Google OAuth flow are added. Use email and password for now. Payment checkout, cross-device accounts, central notifications, and server-side account administration will be connected when the backend/database phase begins.

## Future backend phase

The backend and database can be added later without changing the current static preview workflow. At that stage, move authentication and administrator checks to the server, use a persistent database, and integrate verified payment processing before enabling real-money features.
