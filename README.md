# Ticket Master 🎟️

A full-stack, multi-category ticket booking platform designed for booking **Movies**, **Trains**, and **Live Events**. It features real-time seat selection, secure payment processing, third-party OAuth 2.0 authentication, automated email notifications, and cloud media management.

---

## 📌 Table of Contents
- [Tech Stack](#-tech-stack)
- [System Architecture & Folder Structure](#-system-architecture--folder-structure)
- [Third-Party APIs & Integrations (Interview Focus)](#-third-party-apis--integrations-interview-focus)
  - [1. Cashfree Payment Gateway](#1-cashfree-payment-gateway)
  - [2. Nodemailer (Transactional Emails)](#2-nodemailer-transactional-emails)
  - [3. Cloudinary & Multer (Media Storage)](#3-cloudinary--multer-media-storage)
  - [4. DAuth & MyAuth (OAuth 2.0 SSO)](#4-dauth--myauth-oauth-20-sso)
  - [5. Socket.io (Real-Time Communication)](#5-socketio-real-time-communication)
- [Security, Middleware & Rate Limiting](#-security-middleware--rate-limiting)
- [Quickstart: How to Run the Project Locally](#-quickstart-how-to-run-the-project-locally)
- [Database Schema (MongoDB Collections)](#-database-schema-mongodb-collections)
- [Interview Cheat Sheet & Key Talking Points](#-interview-cheat-sheet--key-talking-points)

---

## 🚀 Tech Stack

### Frontend
- **React 19 & Vite 7**: Modern, high-performance SPA setup with fast HMR.
- **Tailwind CSS 4**: Modern utility-first styling with responsive layouts.
- **React Router 7**: Declarative client-side routing.
- **Socket.io Client**: Real-time communication for seat status and updates.
- **React Icons & React Calendar**: UI components for booking schedules and navigation.

### Backend
- **Node.js & Express 5**: Asynchronous REST API service.
- **MongoDB (Native Driver)**: High-throughput NoSQL database with connection pooling.
- **Socket.io**: WebSockets server for bi-directional live events.
- **JWT (`jsonwebtoken`)**: Stateless token-based user authentication.

### Cloud Services & External APIs
- **Cashfree PG**: Payment link creation, sandbox verification, and webhook handling.
- **Nodemailer**: SMTP mail delivery with HTML email templates.
- **Cloudinary**: CDN storage for movie posters, event banners, and profile photos.
- **DAuth & MyAuth**: OAuth 2.0 Authorization Code Grant Single Sign-On (SSO).

---

## 📂 System Architecture & Folder Structure

```text
ticket-master/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/
│   │   └── _redirects          # SPA redirect rule for Netlify deployments
│   ├── src/
│   │   ├── assets/             # Static mock catalogs (movies, trains, events)
│   │   ├── components/         # Reusable UI components (Header, Sidebar, Home)
│   │   ├── context/            # AuthContext (state for user, token, notifications)
│   │   ├── pages/              # Route views
│   │   │   ├── Login.jsx       # Password login & OAuth redirects
│   │   │   ├── Signup.jsx      # User registration
│   │   │   ├── DAuthCallback.jsx # OAuth code exchange handler
│   │   │   ├── Profile.jsx     # User profile & avatar upload
│   │   │   ├── Movies.jsx      # Movie list & theater selection
│   │   │   ├── TheatreSeats.jsx# Interactive grid for theater seats
│   │   │   ├── Trains.jsx      # Train search & coach selection
│   │   │   ├── Events.jsx      # Concerts, workshops, and stadium events
│   │   │   ├── TicketSummary.jsx # Pre-checkout summary & order creation
│   │   │   ├── Payments.jsx    # Cashfree integration view
│   │   │   ├── PaymentStatus.jsx # Payment verification & confirmation
│   │   │   ├── MyBookings.jsx  # User booking history & tickets
│   │   │   └── admin-components/ # Admin management (Add/Delete movies, events)
│   │   ├── App.jsx             # Route definitions
│   │   └── main.jsx            # React root & Context providers
│   ├── package.json
│   └── vite.config.js          # Vite config & environment variable mappings
│
└── server/                     # Backend API (Node + Express)
    ├── controllers/
    │   ├── authController.js   # Signup, login, JWT verify, DAuth & MyAuth exchange
    │   ├── ticketController.js # Booking creation, user booking queries, status updates
    │   ├── paymentController.js# Cashfree payment links, status checks, reconciliation
    │   ├── dataController.js   # CRUD operations for Movies, Trains, Events
    │   ├── emailController.js  # HTML email generation & Nodemailer dispatch
    │   └── uploadController.js # Cloudinary storage engine via Multer
    ├── routes/                 # Express route definitions
    │   ├── authRoutes.js
    │   ├── ticketRoutes.js
    │   ├── paymentRoutes.js
    │   ├── dataRoutes.js
    │   ├── emailRoutes.js
    │   └── uploadRoutes.js
    ├── middleware.js           # JWT verification middleware
    ├── server.js               # Express app, Socket.io, MongoDB connection pool
    └── package.json
```

---

## 🔌 Third-Party APIs & Integrations (Interview Focus)

### 1. Cashfree Payment Gateway
- **Where it is used**:
  - `server/controllers/paymentController.js`
  - `server/routes/paymentRoutes.js`
  - `client/src/pages/Payments.jsx` & `client/src/pages/PaymentStatus.jsx`
- **How it works**:
  1. **Link Generation (`POST /create-payment-link`)**: When a user proceeds to checkout, the server calls Cashfree's PG API (`https://sandbox.cashfree.com/pg/links`) with credentials (`x-client-id`, `x-client-secret`), order amount, customer details, and a return URL (`/payment-status`).
  2. Cashfree generates a secure checkout link (`link_url`) and unique ID (`link_id`). The user is redirected to pay via UPI, cards, or net banking.
  3. **Verification (`GET /update-payment-status/:bookingId`)**: When the user returns to the app, the backend calls Cashfree’s verification endpoint (`/pg/links/{linkId}`) to check if the transaction is `PAID` or `FAILED`.
  4. Once confirmed, both the `payment` and `ticket` records are atomically updated in MongoDB, and confirmation emails are triggered.

---

### 2. Nodemailer (Transactional Emails)
- **Where it is used**:
  - `server/controllers/emailController.js`
  - `server/controllers/authController.js` (forgot password link)
- **How it works**:
  - Utilizes standard Gmail SMTP transport configured via `EMAIL_USER` and an App Password (`EMAIL_PASS`).
  - Supports two email categories with responsive HTML templates:
    1. **Password Reset**: Generates a secure, time-sensitive reset link with a 24-hour expiration token.
    2. **Booking Confirmation**: Dispatches an itemized receipt including Booking ID, event/movie/train details, selected seats/coaches, total amount paid, and Cashfree reference ID.

---

### 3. Cloudinary & Multer (Media Storage)
- **Where it is used**:
  - `server/controllers/uploadController.js`
  - `client/src/pages/Profile.jsx` (avatar upload)
  - `client/src/pages/admin-components/MoviesAdd.jsx` (movie poster)
  - `client/src/pages/admin-components/EventsAdd.jsx` (event banner)
- **How it works**:
  - Instead of saving images to disk (which fails on serverless platforms like Render/Heroku), Multer is configured with `multer-storage-cloudinary`.
  - When an image (`jpg`/`png`) is uploaded via `POST /upload`, it streams directly to the Cloudinary cloud storage folder `ticket-master-uploads`.
  - Cloudinary returns a secure CDN URL (`req.file.path`) that is saved directly in the MongoDB document.

---

### 4. DAuth & MyAuth (OAuth 2.0 SSO)
- **Where it is used**:
  - `client/src/pages/Login.jsx` & `client/src/pages/DAuthCallback.jsx`
  - `server/controllers/authController.js` (`dAuthSigninController`, `myAuthSigninController`)
- **How it works (Authorization Code Grant)**:
  1. The user clicks **Sign in with DAuth**. The browser redirects to DAuth’s authorization endpoint:
     ```text
     https://auth.delta.nitt.edu/authorize?client_id=...&redirect_uri=...&scope=email openid profile
     ```
  2. After user authentication, DAuth redirects back to the frontend at:
     ```text
     http://localhost:5173/signin?code=AUTH_CODE&state=...
     ```
  3. `DAuthCallback.jsx` captures the temporary `code` and sends it to the backend (`POST /signin`).
  4. The backend performs a secure server-to-server exchange with DAuth:
     ```text
     POST https://auth.delta.nitt.edu/api/oauth/token
     (body: client_id, client_secret, code, redirect_uri)
     ```
  5. The backend receives the `access_token`, fetches the user's name and email, creates or updates their record in MongoDB, and issues a JWT token to the client.

---

### 5. Socket.io (Real-Time Communication)
- **Where it is used**:
  - `server/server.js`
  - `client/src/pages/TheatreSeats.jsx`
- **How it works**:
  - Initializes a WebSocket connection alongside the Express HTTP server with configured CORS origins.
  - Broadcasts seat lock/selection events so multiple users browsing the same theater showtime see seat status changes without manual page refreshes.

---

## 🛡️ Security, Middleware & Rate Limiting

### JWT Authentication Middleware (`verifyJWT`)
Located in [server/middleware.js](file:///home/kondabhaskar2509/Documents/bhaskarcodes/webdev/ticket-master/server/middleware.js).
- Protects private routes such as `/change-password` and `/profile-image`.
- Validates the `Authorization: Bearer <token>` HTTP header using the HMAC SHA-256 algorithm and attaches the decoded user payload to `req.user`.

### Rate Limiting (Recommended Production Pattern)
To protect sensitive authentication and payment endpoints against brute-force attacks and denial-of-service:
- **Auth Routes (`/login`, `/signup`, `/forgot-password-usercheck`)**: Max 5 requests per 15-minute window per IP.
- **Payment Creation (`/create-payment-link`)**: Max 10 requests per minute per IP to prevent spam order link generation.
- **Implementation via `express-rate-limit`**:
  ```javascript
  import rateLimit from "express-rate-limit";

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
    message: { error: "Too many login attempts. Please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/login", authLimiter);
  app.use("/signup", authLimiter);
  ```

---

## 💻 Quickstart: How to Run the Project Locally

Follow these steps to set up and run the application from scratch:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or free MongoDB Atlas cluster)
- Git

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/kondabhaskar2509/ticket-master.git
cd ticket-master
```

---

### Step 2: Configure and Start the Backend Server

1. Open a terminal and navigate to `server`:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   FRONTEND=http://localhost:5173
   BACKEND=http://localhost:5000
   JWT_SECRET=your_jwt_secret_key

   # MongoDB Connection String (Atlas or Local)
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/booking?retryWrites=true&w=majority

   # Cashfree PG Sandbox Keys
   CASHFREE_CLIENT_ID=your_cashfree_client_id
   CASHFREE_CLIENT_SECRET=your_cashfree_client_secret

   # Gmail Nodemailer SMTP (Use Gmail App Password, not regular password)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password

   # Cloudinary Media Storage
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret

   # DAuth OAuth Keys
   DAUTH_CLIENT_ID=your_dauth_client_id
   DAUTH_CLIENT_SECRET=your_dauth_client_secret
   DAUTH_REDIRECT_URI=http://localhost:5173/signin

   # MyAuth Keys (Optional)
   MYAUTH_CLIENT_ID=your_myauth_client_id
   MYAUTH_CLIENT_SECRET=your_myauth_client_secret
   MYAUTH_BASE_URL=http://localhost:3000
   ```

3. Start the server:
   ```bash
   npm start
   ```
   *You should see: `✅ Server listening on port 5000`*

---

### Step 3: Configure and Start the Frontend Client

1. Open a second terminal and navigate to `client`:
   ```bash
   cd client
   npm install
   ```

2. Create a `.env` file in the `client` directory:
   ```env
   FRONTEND=http://localhost:5173
   BACKEND=http://localhost:5000
   CLIENT_ID=your_dauth_client_id
   MYAUTH_SERVER=http://localhost:3000
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```text
   http://localhost:5173
   ```

---

## 🗄️ Database Schema (MongoDB Collections)

The application uses MongoDB native driver connected to the `booking` database with the following primary collections:

| Collection Name | Description | Key Fields |
| :--- | :--- | :--- |
| `ticketmasterusers` | Registered users & profiles | `name`, `email`, `password`, `profileImage`, `createdAt` |
| `ticket` | Booked tickets for all categories | `email`, `type` (Movie/Train/Event), `details`, `price`, `bookingStatus` (`PAID`/`PENDING`/`FAILED`), `link_id` |
| `payment` | Payment transactions & audit trail | `bookingId`, `email`, `amount`, `paymentStatus`, `method` (UPI), `linkId`, `createdAt` |
| `moviedata` | Movies catalog | `id`, `title`, `genre`, `rating`, `poster`, `theatres` |
| `eventdata` | Events catalog | `id`, `title`, `date`, `venue`, `price`, `banner` |
| `traindata` | Trains catalog & routes | `trainNumber`, `name`, `from`, `to`, `departureTime`, `classes` |
| `seats` | Seat availability matrices | `screenId`, `showTime`, `seatMatrix`, `lockedSeats` |

---

## 🎯 Interview Cheat Sheet & Key Talking Points

When presenting this project in an interview, focus on these architecture and engineering highlights:

### 1. "Tell me about the architecture of Ticket Master."
> *"Ticket Master is built as a decoupled full-stack platform. The frontend is a React 19 Single Page Application built with Vite and Tailwind CSS. The backend is an Express REST API connected to MongoDB with connection pooling. We use WebSockets for real-time seat coordination, Cashfree PG for handling financial transactions, Cloudinary for cloud media asset hosting, and OAuth 2.0 for Single Sign-On alongside traditional JWT authentication."*

### 2. "How did you handle payment security and consistency?"
> *"We avoid trusting frontend payment states. Instead of marking tickets as paid based on client redirect URLs, the client initiates a request to the server, which requests a cryptographically signed payment link from Cashfree. Once payment completes, our server independently verifies the order status with Cashfree's REST API before committing any status changes to MongoDB."*

### 3. "How does the OAuth 2.0 flow work in your app?"
> *"We implemented the Authorization Code Grant. The frontend redirects to the OAuth provider with our Client ID and Redirect URI. Once the user approves, the provider redirects back with a temporary authorization code. Our frontend hands this code to our backend, which exchanges it with the provider's token endpoint using the private Client Secret. This ensures the client secret is never exposed to the browser."*

### 4. "Why did you use Cloudinary instead of storing uploads on the server?"
> *"Modern cloud hosting environments (like Render or containerized pods) use ephemeral filesystems, meaning local disk writes disappear on server reboot. Using Cloudinary with `multer-storage-cloudinary` offloads media assets to a high-speed CDN, reducing server load and ensuring persistent media URLs across all deployments."*

### 5. "What challenges did you face and how did you resolve them?"
- **CORS & Environment Sync**: Synchronizing origin headers and redirect URIs between local development (`localhost:5173`) and production platforms (Netlify & Render).
- **Graceful Error Handling in Async MongoDB**: Implementing connection pooling and health checks to prevent silent server failures if MongoDB Atlas suspends free-tier clusters.
- **Handling Multi-category Tickets**: Designing a flexible polymorphic schema in MongoDB that can store attributes for movie tickets (seat numbers, screen), train tickets (coach, berth, PNR), and live events (standing/seated, date).
