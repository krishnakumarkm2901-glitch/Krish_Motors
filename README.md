# Bike Service Booking — MERN Stack

A full-stack bike service booking system built with:

- MongoDB for persistent application data
- Express for REST API routes and middleware
- React with Vite for the browser interface
- Node.js for the backend runtime

## Project structure

```text
bike-service-booking/
|-- client/                  React + Vite frontend
|   |-- public/
|   |-- src/
|   |-- .env.example
|   |-- package.json
|   `-- vite.config.js
|-- server/                  Node.js + Express backend
|   |-- controllers/
|   |-- database/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- app.js
|   |-- config.js
|   |-- .env.example
|   `-- package.json
|-- package.json
`-- README.md
```

## Local setup

Requirements:

- Node.js 18 or newer
- npm
- MongoDB running locally, or a MongoDB Atlas database

Install the root development tool and both applications:

```powershell
npm install
npm run setup
```

Copy the server environment template if `server/.env` does not exist:

```powershell
Copy-Item server/.env.example server/.env
```

Configure `server/.env`:

```env
MONGODB_URI=your-local-or-atlas-mongodb-connection-string
JWT_SECRET=replace-with-a-long-random-value
JWT_EXPIRES_IN=7d
ADMIN_NAME=Krish_Motors Admin
ADMIN_EMAIL=admin@krishmotors.com
ADMIN_PASSWORD=replace-with-a-strong-password
CLIENT_ORIGIN=http://localhost:3000
PORT=5000
```

For MongoDB Atlas, set `MONGODB_URI` to the Atlas connection string. Make
sure special characters in the database username and password are URL-encoded.

For Render, add these values under **Environment** in the backend service:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CLIENT_ORIGIN`

Render supplies `PORT` automatically. Do not commit `server/.env`; it is only
for local development.

Start the complete MERN development environment:

```powershell
npm run dev
```

Run that command from the repository root:

```text
C:\Users\user\Downloads\bike-service-booking\bike-service-booking
```

If your terminal is already inside `client`, either return to the root:

```powershell
cd ..
npm run dev
```

or use:

```powershell
npm run dev:full
```

- React client: `http://localhost:3000`
- Express API: `http://localhost:5000`
- API health check: `http://localhost:5000/api/health`

The Vite development server proxies `/api` requests to Express.
An `ECONNREFUSED` proxy error means the Express server is not running on port
5000. Starting the project with the root `npm run dev` command starts both
applications together.

## Other commands

```powershell
npm run client    # Start only React
npm run server    # Start only Express
npm run build     # Create the frontend production build
npm start         # Start the production Node.js server
```

For a separately hosted frontend, set `VITE_API_URL` to the public backend URL.
Set `CLIENT_ORIGIN` on the server to the public frontend origin.

## Main API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/services`
- `GET /api/bookings`
- `POST /api/bookings`
- `POST /api/contact`
- `/api/admin/*` for protected administration

Passwords are hashed with bcrypt. Authentication uses signed JWTs. Admin
credentials and database connection details remain on the server and are not
included in the React bundle.
