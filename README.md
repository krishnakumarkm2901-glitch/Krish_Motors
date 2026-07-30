KRISH MOTORS BIKE SERVICE BOOKING
COMPLETE PROJECT DOCUMENTATION
=================================

1. PROJECT OVERVIEW
-------------------

Krish Motors is a full-stack MERN application for booking and managing
two-wheeler services.

Main features:

- Customers can register and log in.
- Customers can browse available services.
- Logged-in customers can book a bike service.
- Customers can view their bookings and current booking status.
- Visitors and customers can send contact messages.
- Administrators can log in through a separate admin page.
- Administrators can manage services, bookings, users, and messages.

Technology stack:

- Frontend: React 18, React Router, Vite, HTML, and CSS
- Backend: Node.js and Express
- Database: MongoDB with Mongoose
- Authentication: JSON Web Tokens (JWT)
- Password protection: bcryptjs
- Frontend hosting: Vercel
- Backend hosting: Render


2. HIGH-LEVEL ARCHITECTURE
--------------------------

Browser
  |
  | Loads React frontend
  v
Vercel: https://krish-motors.vercel.app
  |
  | HTTPS requests such as POST /api/auth/login
  | Authorization: Bearer <JWT> is added for protected requests
  v
Render: https://krish-motors.onrender.com
  |
  | Express routes -> authentication middleware -> controllers
  v
MongoDB Atlas

The React application never connects directly to MongoDB. All database
operations go through the Express backend.


3. HOW TO INSTALL AND RUN THE PROJECT
-------------------------------------

Requirements:

- Node.js and npm
- A MongoDB database

Install frontend and backend dependencies from the project root:

  npm run setup

On Windows PowerShell, if script execution blocks npm.ps1, use:

  npm.cmd run setup

Run the frontend and backend together:

  npm run dev

Or on affected Windows systems:

  npm.cmd run dev

Default local addresses:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

Create a production frontend build:

  npm run build

The generated files are placed in client/dist. Generated build files and
node_modules are not source files and should not be edited manually.


4. ENVIRONMENT VARIABLES
------------------------

server/.env contains private backend configuration. It must not be committed.

Expected backend variables:

- PORT: Backend port. Render normally supplies this automatically.
- MONGODB_URI: MongoDB connection string.
- JWT_SECRET: Secret used to sign and verify login tokens.
- JWT_EXPIRES_IN: Token lifetime, such as 7d.
- CLIENT_ORIGIN: Frontend origin used by backend configuration.
- ADMIN_NAME: Name assigned to the seeded administrator.
- ADMIN_EMAIL: Administrator login email.
- ADMIN_PASSWORD: Administrator login password.

client/.env.development:

- Sets VITE_API_URL=http://localhost:5000 for local development.

client/.env.production:

- Sets VITE_API_URL=https://krish-motors.onrender.com for the deployed build.

client/.env.example:

- Provides a safe template showing which frontend API variable is required.

client/.env.local:

- Holds machine-specific Vite overrides. Vite gives this file higher priority
  than the general mode file. It should remain uncommitted if it contains local
  or sensitive configuration.

server/.env.example:

- Provides a safe template of the backend variables required by another
  developer or hosting environment.

Vite only exposes frontend variables beginning with VITE_. Frontend variables
are visible to users, so secrets must never be stored in a client environment
file.


5. ROOT FILES
-------------

package.json

The root npm configuration coordinates both applications. Its setup script
installs client and server packages. Its dev script starts Vite and Express
together with concurrently. The build script builds the React frontend, and
the start script starts the backend.

package-lock.json

Records exact versions of root dependencies. npm creates and updates this file
to make installations repeatable.

README.md

Provides a shorter setup, deployment, environment, endpoint, and security
reference for developers.

vercel.json

Rewrites all frontend paths to index.html. This is necessary because routes
such as /services and /admin are handled by React Router in the browser rather
than by physical files on Vercel.

.gitignore

Tells Git not to track dependencies, generated output, private environment
files, logs, and other local-only files.

PROJECT_DOCUMENTATION.txt

This document. It describes the structure, purpose, and runtime behavior of
the complete project.


6. FRONTEND FILES
-----------------

client/package.json

Defines the React application dependencies and scripts. React renders the UI,
react-router-dom handles browser routes, and Vite runs and builds the frontend.

client/package-lock.json

Locks exact frontend dependency versions.

client/index.html

The single HTML page served to the browser. It provides the root div where
React is mounted and loads /src/main.jsx.

client/vite.config.js

Enables the Vite React plugin and configures the development server to prefer
port 3000.

client/vercel.json

Provides the same single-page application rewrite required when the client
folder is deployed as the Vercel project root.

client/src/main.jsx

The frontend entry point. It finds the root element from index.html and renders
the App component inside React StrictMode.

client/src/App.jsx

Defines the application shell and all browser routes. It wraps the application
with AuthProvider and BrowserRouter, displays Navbar and Footer, and maps URLs
to pages:

- / -> Home
- /services -> Services
- /book-service -> protected customer booking page
- /contact -> Contact
- /login -> customer login and registration
- /loginadmin -> administrator login
- /dashboard -> protected customer dashboard
- /admin -> protected administrator dashboard

client/src/App.css

Contains layout styles associated with the main App shell.

client/src/index.css

Contains global design variables, resets, typography, container rules, buttons,
shared form styles, and other styles used throughout the frontend.


7. FRONTEND AUTHENTICATION AND API FILES
----------------------------------------

client/src/utils/api.js

Centralizes communication with the backend. It reads VITE_API_URL, adds /api
and the requested endpoint, sets JSON headers, and reads the JWT from
localStorage. When a token exists it sends:

  Authorization: Bearer <token>

It parses JSON responses and converts non-success responses into JavaScript
errors that pages can display.

client/src/context/AuthContext.jsx

Provides authentication state and functions to every component.

- savedSession reads the saved public user profile.
- On startup, /auth/me verifies an existing token.
- authenticate handles both login and registration.
- Successful authentication stores the token and user profile.
- logout removes the saved token and profile.
- useAuth allows components to access this shared state.

Local storage keys:

- krish_motors_token: signed JWT
- krish_motors_session: public user information

client/src/components/ProtectedRoute.jsx

Guards private pages. A visitor without a valid session is redirected to the
appropriate login page. A logged-in user with the wrong role is redirected to
their own dashboard. This improves navigation, while the backend middleware
provides the actual security enforcement.

client/src/utils/storage.js

Contains older/general localStorage helper functions, key constants, legacy
key migration, JSON reading/writing, change events, and browser-generated IDs.
The current server-backed login and booking flows mainly use api.js and
AuthContext instead.


8. FRONTEND COMPONENT FILES
---------------------------

client/src/components/Navbar.jsx

Renders desktop/mobile navigation. It changes links based on login role,
provides customer dashboard access, and performs logout.

client/src/components/Navbar.css

Styles the navigation bar, active links, authentication actions, hamburger
menu, and responsive mobile navigation.

client/src/components/Footer.jsx

Renders the business description, quick links, contact information, and a
copyright year calculated from the current date.

client/src/components/Footer.css

Styles the footer grid, branding, link columns, and responsive layout.

client/src/components/ServiceCard.jsx

Displays one service with image, description, price, and Book Now button.
Clicking Book Now opens /book-service and passes the selected service ID in
React Router state.

client/src/components/ServiceCard.css

Styles service cards, images, prices, spacing, hover behavior, and actions.


9. FRONTEND PAGE FILES
----------------------

client/src/pages/Home.jsx

Creates the public landing page. It displays the hero section and loads the
first three services as featured service cards.

client/src/pages/Home.css

Styles the hero, motorcycle image, featured service area, and responsive home
page layout.

client/src/pages/Services.jsx

Loads and displays all services using useServices and ServiceCard.

client/src/pages/Services.css

Styles the services page heading and service grid.

client/src/pages/BookService.jsx

Provides the protected booking form. It loads services, accepts customer and
bike information, validates the form, and sends POST /api/bookings. A service
selected from a ServiceCard can be preselected through router state.

client/src/pages/BookService.css

Styles the booking form, field layout, service selection, confirmation state,
and responsive presentation.

client/src/pages/Login.jsx

Provides customer login, customer registration, and administrator login modes.
It performs browser-side email, phone, and password validation, calls the
AuthContext functions, displays errors, and redirects successful users to the
correct dashboard.

client/src/pages/Login.css

Styles login/registration pages, form controls, error messages, and the admin
login card.

client/src/pages/Dashboard.jsx

Loads the current customer's bookings with GET /api/bookings and displays the
service, motorcycle, appointment date, and current status.

client/src/pages/AdminDashboard.jsx

Provides administrator management screens:

- Loads bookings, contacts, users, and services.
- Changes booking statuses.
- Opens phone links for contacting customers.
- Marks, replies to, and deletes contact messages.
- Lists registered users.
- Creates, edits, and deletes services.
- Accepts service image URLs or images converted to data URLs.

client/src/pages/Dashboard.css

Styles both customer and administrator dashboards, tables, status labels,
tabs, statistics, messages, and the service editor.

client/src/pages/Contact.jsx

Displays business contact information and a contact form. It validates input
and sends POST /api/contact. Logged-in users are associated with their message
through optional backend authentication.

client/src/pages/Contact.css

Styles contact information cards, the message form, errors, and success state.


10. FRONTEND DATA AND HOOKS
---------------------------

client/src/hooks/useServices.jsx

Reusable hook for retrieving services. It begins with local default services,
requests GET /api/services, and replaces the defaults with database results.
If the backend is unavailable, the public pages can still show default service
information.

client/src/data/services.js

Contains the frontend fallback list of general service, oil change, brake
service, and water wash. This improves public page resilience but does not
replace the database for admin changes or booking validation.


11. BACKEND FILES
-----------------

server/package.json

Defines backend scripts and packages:

- express: HTTP server and routing
- mongoose: MongoDB models and queries
- cors: cross-origin browser request headers
- dotenv: environment file loading
- bcryptjs: secure password hashing and comparison
- jsonwebtoken: signed authentication tokens
- nodemon: automatic development restart

server/package-lock.json

Locks exact backend dependency versions.

server/config.js

Loads server/.env and creates a normalized configuration object. It supplies
the port, MongoDB URI, JWT settings, frontend origin, and administrator
details. validateEnvironment stops startup when MongoDB configuration is
missing or malformed.

server/app.js

The backend entry point and Express application factory.

Startup order:

1. Validate environment settings.
2. Connect to MongoDB.
3. Insert default services when they do not exist.
4. Create or update the configured administrator.
5. Create Express and listen on Render's PORT or local port 5000.

Middleware order:

1. Disable the X-Powered-By response header.
2. Apply CORS before every route.
3. Handle global OPTIONS preflight requests.
4. Parse JSON request bodies up to 3 MB.
5. Register health, authentication, booking, service, admin, and contact routes.
6. Return JSON for unknown endpoints.
7. Convert application errors into safe JSON responses.

Allowed browser origins include the Vercel frontend and local ports 3000 and
5173. CORS permits credentials, common API methods, Content-Type, and
Authorization.

server/database/db.js

Connects and disconnects Mongoose. strictQuery is enabled before connecting.
The connection must succeed before the API begins listening.

server/utils/helpers.js

Contains shared backend helpers:

- hasMissingFields checks required request properties.
- makeServiceId creates random service IDs using cryptographic random bytes.
- asyncHandler forwards rejected controller promises to Express error handling.


12. DATABASE MODEL FILES
------------------------

server/models/user.js

Defines registered users and administrators. Fields include name, email, phone,
passwordHash, role, registration time, update time, and last login.
passwordHash is excluded from normal queries. toPublicJSON returns only safe
profile fields.

server/models/service.js

Defines service ID, name, description, price, image, and timestamps. Its JSON
transform removes MongoDB internal fields and timestamps from API responses.

server/models/booking.js

Defines the customer reference, customer details, bike details, selected
service, requested date, status, booking time, and update time. Allowed statuses
are Pending, Contacted, Confirmed, In Service, Delivered, and Cancelled.

server/models/contact.js

Defines contact messages with optional user reference, sender name, email,
message, status, sent time, and update time. Allowed statuses are Unread, Read,
and Replied.


13. AUTHENTICATION MIDDLEWARE
-----------------------------

server/middleware/auth.js

createToken signs a JWT containing the user's database ID and role.

readUserFromToken reads the Authorization Bearer token, verifies its signature,
and loads the current user from MongoDB.

requireAuth rejects missing/invalid sessions and can require a specific role.
For example, requireAuth("admin") prevents customers from using admin APIs.

optionalAuth continues even when no valid token exists. It is used by the
contact endpoint so both visitors and logged-in customers can send messages.


14. CONTROLLER FILES
--------------------

server/controllers/auth_controller.js

- register validates fields, prevents duplicate email addresses, hashes the
  password with bcryptjs using 12 rounds, creates a customer, and returns a JWT.
- login finds the user, compares the submitted password with the stored hash,
  checks the requested role, updates last login, and returns a JWT.
- currentUser returns the authenticated public profile.
- ensureAdmin hashes ADMIN_PASSWORD and upserts the configured admin on every
  server startup.

Passwords are never decoded. bcrypt is one-way hashing; login works by comparing
the submitted password against the stored hash.

server/controllers/service_controller.js

Lists services, lets administrators create/update/delete services, and inserts
four default services during backend startup if they do not already exist.

server/controllers/booking_controller.js

Validates booking fields, confirms that the chosen service exists, creates a
booking linked to the authenticated customer, and lists only that customer's
bookings.

server/controllers/contact_controller.js

Validates and saves contact messages. It associates the user ID when the sender
has a valid token and stores null for a visitor.

server/controllers/admin_controller.js

Lists all bookings, users, and contact messages. It validates MongoDB IDs and
allowed statuses before updating bookings/messages, and can delete contact
messages.


15. ROUTE FILES AND API ENDPOINTS
---------------------------------

server/routes/auth.js

- POST /api/auth/register: create a customer account
- POST /api/auth/login: log in a customer or administrator
- GET /api/auth/me: validate token and return the current user

server/routes/services.js

- GET /api/services: public service list
- POST /api/services: administrator creates a service
- PUT /api/services/:identifier: administrator updates a service
- DELETE /api/services/:identifier: administrator deletes a service

server/routes/booking.js

- GET /api/bookings: customer lists their own bookings
- POST /api/bookings: customer creates a booking

server/routes/contact.js

- POST /api/contact: visitor/customer sends a message

server/routes/admin.js

Every endpoint in this router first requires the admin role.

- GET /api/admin/bookings
- PATCH /api/admin/bookings/:identifier
- GET /api/admin/users
- GET /api/admin/contacts
- PATCH /api/admin/contacts/:identifier
- DELETE /api/admin/contacts/:identifier


16. COMPLETE RUNTIME FLOWS
--------------------------

Application startup:

1. npm starts client Vite and server/app.js.
2. Vite serves index.html and the React modules.
3. The backend validates environment variables.
4. Mongoose connects to MongoDB.
5. Default services and the configured administrator are upserted.
6. Express starts listening.
7. React mounts App, restores a saved login, and displays the matching page.

Customer registration:

1. Login.jsx validates name, phone, email, and password.
2. AuthContext calls POST /api/auth/register.
3. auth_controller checks data and duplicate email.
4. bcryptjs hashes the password.
5. Mongoose stores the new User.
6. The backend signs and returns a JWT.
7. AuthContext stores the token/profile and redirects to /dashboard.

Login:

1. Login.jsx submits email, password, and expected role.
2. The backend selects the normally hidden passwordHash.
3. bcrypt compares the submitted password with the hash.
4. The role is checked and lastLogin is saved.
5. A signed JWT and safe user profile are returned.
6. Future api.js requests send the JWT as a Bearer token.

Booking:

1. ProtectedRoute requires a customer session.
2. BookService.jsx submits bike, customer, service, and date information.
3. requireAuth("user") verifies the JWT and loads the user.
4. booking_controller confirms that the service exists.
5. MongoDB stores the booking with the user's ID.
6. Dashboard.jsx later requests and displays that user's bookings.

Administrator management:

1. /loginadmin requests the admin role during login.
2. ProtectedRoute requires role admin for /admin.
3. Each /api/admin route independently runs requireAuth("admin").
4. AdminDashboard loads management data and sends PATCH/DELETE requests.
5. Controllers validate changes before updating MongoDB.

CORS/preflight:

1. The Vercel page sends a cross-origin request to Render.
2. For requests requiring preflight, the browser first sends OPTIONS.
3. cors middleware recognizes the Vercel origin.
4. Express returns allowed origin, headers, methods, and credentials headers.
5. The browser then permits the actual API request.


17. DEPLOYMENT
--------------

Vercel:

- Build the client with npm run build.
- Configure the project so VITE_API_URL points to the Render backend.
- SPA rewrites return index.html for React routes.

Render:

- Install server dependencies.
- Start the server with npm start or the configured root start script.
- Define MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, and other server
  environment variables.
- Render provides PORT; app.js reads it through config.js.
- The Vercel origin must remain in the CORS allowlist.

After source changes, both platforms must redeploy the relevant application.
A local code change does not automatically update an existing deployment unless
the hosting service is connected to the branch containing that change.


18. SECURITY NOTES
------------------

- Never commit server/.env or real passwords.
- Use a long, random JWT_SECRET in production.
- Use a dedicated MongoDB account with only required permissions.
- Passwords are hashed with bcryptjs and are not stored as plain text.
- Frontend route protection is for navigation; backend role checks enforce
  security.
- HTTPS should be used for all production frontend/backend communication.
- localStorage tokens can be exposed by cross-site scripting, so avoid rendering
  untrusted HTML and keep dependencies updated.
- The administrator is synchronized from environment variables during startup;
  changing ADMIN_PASSWORD requires restarting/redeploying the backend.


19. GENERATED AND NON-SOURCE DIRECTORIES
----------------------------------------

node_modules, client/node_modules, server/node_modules:

Downloaded npm packages. Recreate them with npm install; do not edit them.

client/dist and build:

Generated production frontend output. Recreate it with npm run build.

.git:

Git history and repository metadata.

.vercel:

Local Vercel project metadata generated by the Vercel tooling.

Log files:

Development process output used for troubleshooting. They are not application
source code.


END OF DOCUMENTATION
====================
