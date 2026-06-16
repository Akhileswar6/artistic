# Artistic

Artistic is a premium, full-stack web application designed for custom art commissions. It allows clients to upload their photos, select custom drawing styles, choose framing options, and commission beautiful hand-drawn sketches, portraits, and divine artworks. The platform features a unique two-stage payment flow (advance + balance), interactive dashboards, a dark/light mode toggle with theme memory, and a secure administration panel featuring rich visual analytics.

---

## 🚀 Key Features

### 👤 Customer Features
- **Dynamic Commission Ordering**: Three-step ordering wizard (Details ➔ Artwork Upload ➔ Confirmation) with real-time price calculations based on selected art style and framing options.
- **High-Quality Image Upload**: Secured client photo upload with file-size limitation (5MB) powered by `Multer` and hosted on `Cloudinary`.
- **Passwordless OTP-Based Login**: Seamless, password-free login and registration. Users receive secure 6-digit login codes directly in their inbox (via Brevo SMTP).
- **Google Authentication**: Single-click social authentication integrated with Firebase Auth.
- **Client Order Dashboard**: Detailed tracking of active/past orders, status logs, secure payment submission, and invoice downloads.
- **PDF Invoice Generation**: Instantly generate and download PDF invoices/receipts for orders using `jsPDF`.
- **Two-Stage Payment Flow**: Payment tracking through transaction IDs for the **25% advance** and the remaining **75% balance**.
- **Interactive Reviews**: Post-delivery feedback portal to submit ratings (1-5 stars) and written reviews.
- **Real-time Notifications**: Custom system notifications on order status changes, announcements, or profile edits.

### 👑 Admin & Management Panel
- **Analytical Dashboard**: Rich interactive charts tracking daily revenue trends, art style distribution, order statuses, user growth, and contact message trends (powered by `Recharts`).
- **Order Pipeline Manager**: Complete control over client orders, state updates, payment validations, history logs, and tracking details.
- **User Administration**: View registered user profiles and toggle account bans (block/unblock users) in bulk or individually.
- **Contact Message Portal**: Inbox for client feedback, support inquiries, and custom messaging inquiries.
- **Global Settings Configuration**: Set maintenance mode, base pricing variables, custom discounts, announcement banners, and contact information dynamically.
- **2FA OTP Protected Login**: Dedicated secure admin login portal with dual-factor verification (email-delivered verification code).
- **Automatic Audit Trail**: Tracks administrative activities and automatically handles logs cleanup (expiring order logs 7 days post-delivery).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite-bundled)
- **Styling**: Tailwind CSS v4 & Vanilla CSS
- **Routing**: React Router DOM v7
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React, React Icons & Griddy Icons
- **Utility Libraries**: Axios, jsPDF, React Hot Toast

### Backend
- **Server Environment**: Node.js & Express.js (v5)
- **Database**: MongoDB (via Mongoose)
- **Security & Tokens**: JSON Web Tokens (JWT), BcryptJS
- **File Management**: Multer, Multer-Storage-Cloudinary
- **Social Auth Admin**: Firebase Admin SDK
- **Email Delivery**: Brevo (Sendinblue) SMTP HTTP API
- **HTTP Client**: Node-fetch

---

## 📁 Directory Structure

```text
artistic/
├── dist/                      # Compiled frontend static files (production bundle)
├── public/                    # Frontend static assets (icons, logos)
├── src/                       # Frontend Source Code
│   ├── assets/                # Images, background sketches, styles
│   ├── Components/            # Reusable UI Elements
│   │   ├── Admin/             # Admin-specific helper components & Route guards
│   │   ├── Order/             # Ordering wizard forms (Details, ArtPhoto, Review)
│   │   └── ...                # Theme toggles, skeletons, optimized image components
│   ├── Layout/                # Common layouts (Navbar, Footer, Admin Sidebars)
│   ├── Pages/                 # Core page templates
│   │   ├── Admin/             # Dashboard, Users list, Orders panel, Settings
│   │   ├── Policies/          # Terms, Privacy, Refund policies
│   │   ├── User/              # Client Account, Orders list, Details, Notifications
│   │   └── ...                # Home page, Gallery, Process details, Contact form
│   ├── App.jsx                # Main application component & routing definitions
│   ├── config.js              # Environment url configurations
│   ├── firebase.js            # Firebase client authentication setup
│   ├── index.css              # Styling rules & custom tailwind directives
│   └── main.jsx               # React entry mount point
├── Backend/                   # Backend Server Code
│   ├── controllers/           # API handlers (Authentication, Order processing)
│   ├── middleware/            # JWT validation and Admin authorization guards
│   ├── models/                # MongoDB Mongoose database schemas
│   ├── routes/                # Express API endpoints mapping
│   ├── firebaseAdmin.js       # Firebase Admin initialization
│   ├── server.js              # Main Express server bootstrapper
│   └── serviceAccountKey.json # Firebase security credential (ignored in production)
├── index.html                 # HTML Entry file
├── vite.config.js             # Vite development configurations
└── package.json               # System configuration & dependencies
```

---

## 🔄 Lifecycle of an Order & Payment Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    actor Admin
    
    Customer->>Backend: Submit order request (photo, address, style, frame)
    Note over Backend: Order created in "pending" status<br/>Base Price & 25% Advance calculated
    Admin->>Backend: Accept order (status: "accepted")
    Backend-->>Customer: Notify order accepted (UPI payment link unlocked)
    Customer->>Backend: Submit transaction ID for 25% Advance
    Admin->>Backend: Verify Advance Payment (status: "payment_done", isAdvancePaid: true)
    Note over Admin: Project goes to "in_progress" ➔ "completed"
    Customer->>Backend: Submit transaction ID for 75% Balance
    Admin->>Backend: Verify Balance Payment (status: "out_for_delivery", isFullPaid: true)
    Note over Customer, Admin: Delivery to doorstep
    Admin->>Backend: Mark Order as "delivered"
    Customer->>Backend: Leave Rating and Feedback review
```

---

## ⚙️ Environment Configurations

Setup `.env` configuration files inside both the frontend and backend directories before launching.

### Backend Configurations
Create a `.env` file at the root of the `Backend/` directory:

| Key | Description | Example Value |
| :--- | :--- | :--- |
| `MONGO_URI` | MongoDB Atlas Connection String | `mongodb+srv://<user>:<password>@cluster0.net/artistic` |
| `PORT` | Local server port | `5000` |
| `JWT_SECRET` | Token signature secret key | `your_secret_key_here` |
| `BREVO_API_KEY` | Brevo (Sendinblue) API Key | `xkeysib-...` |
| `EMAIL_USER` | Sender Address for System Emails | `artistic.official12@gmail.com` |
| `ADMIN_EMAIL` | Credentials for default admin login | `artistic.official12@gmail.com` |
| `ADMIN_PASSWORD` | Access password for default admin | `123456` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Account Identifier | `artistic` |
| `CLOUDINARY_API_KEY` | Cloudinary REST Credential Key | `471939434274861` |
| `CLOUDINARY_API_SECRET` | Cloudinary Encryption Private Key | `Vc4Cx...` |
| `FIREBASE_PROJECT_ID` | Social authentication sync | `artistic-91ca9` |
| `FIREBASE_CLIENT_EMAIL` | Firebase Service account email | `firebase-adminsdk-...gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Private encryption key for Firebase | `-----BEGIN PRIVATE KEY-----\nMIIEv...` |

### Frontend Configurations
Create a `.env` file at the root of the `artistic/` directory:

| Key | Description | Example Value |
| :--- | :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Web SDK API credential | `AIzaSyA...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Web Auth Domain | `artistic-91ca9.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firestore Project Identifier | `artistic-91ca9` |
| `VITE_FIREBASE_STORAGE_BUCKET`| Storage Location Domain | `artistic-91ca9.appspot.com` |
| `VITE_FIREBASE_APP_ID` | Client unique application ID | `1:89234892:web:a782b3a8` |

---

## 🛠️ Installation & Setup

Follow these steps to run the application locally on your machine.

### Prerequisites
- Node.js installed (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas cloud database
- Cloudinary, Brevo, and Firebase setup accounts

### 1. Clone the repository and navigate to the project directory
```bash
cd artistic
```

### 2. Configure Backend Server
```bash
# Navigate to Backend folder
cd Backend

# Install package dependencies
npm install

# Run backend server in development mode
# (Assumes Nodemon is installed locally, else use: npm start)
npm run dev
```
The server will boot up by default on: `http://localhost:5000`

### 3. Configure Frontend Client
Open a new terminal window at the root of the `artistic` folder:
```bash
# Install dependencies
npm install

# Run frontend development server
npm run dev
```
The Vite development server will startup at: `http://localhost:5173`

---

## 📝 Licence
This project is licensed under the **ISC License**. Refer to the backend `package.json` for details.
