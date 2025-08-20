
```text
# 💬 Real-Time Chat Application

## 📖 Overview
The **Real-Time Chat Application** is a scalable and interactive communication platform built with the **MERN stack** and **Socket.io**.  
It enables users to send and receive messages instantly with secure authentication, role-based access, reminders, and group chat features.  
This project is designed to showcase **industry-level architecture, robust backend services, and modern UI/UX**  and **Gen-AI** to for proper maninataining the language of the user..

## ✨ Key Features
  🔹 **Real-Time Messaging** – Instant message delivery using Socket.io.  
  🔹 **One-to-One & Group Chats** – Supports private and group conversations.  
  🔹 **Message Deletion** – Admin, sender, and receiver can delete messages under specific rules.  
  🔹 **Video Call and Voice Call** – Users can set voice call and video Call.
  🔹 **Reminders & Notifications** – Users can set reminders for important messages.  
  🔹 **Online/Offline User Status** – Presence indicator for better user experience.  
  🔹 **Responsive UI** – Optimized for all devices using Chakra UI.
  🔹 **Abusive Language Detection & Auto-Block** – If a user sends abusive or offensive words, the system detects it 
        and **automatically blocks** the user to maintain a safe environment.  

## 🔐 Secure User Authentication
   ✅ **JWT Authentication** – Protects all routes with access tokens.  
   ✅ **Encrypted Passwords** – Stored securely with bcrypt hashing.  
   ✅ **Role-Based Access Control** – Admin vs normal user privileges.  
   ✅ **Session Management** – Tokens with expiry to maintain security.

## 👥 Role-Based Structure (Frontend)
🔹 **Admin** – Can manage users, delete any message, and monitor groups.  
🔹 **Sender** – Can delete their own messages (for themselves or everyone).  
🔹 **Receiver** – Can delete received messages (only for themselves).

## ⚙️ Robust Backend
🔹 **Express.js + Node.js** – Handles REST APIs and WebSocket connections.  
🔹 **Socket.io** – Enables real-time communication.  
🔹 **Middleware** – JWT verification, role validation, and error handling.  
🔹 **Scalable API Structure** – Designed for performance and maintainability.


## 💾 Persistent Storage
- **MongoDB** – Stores users, chats, and messages.  
- **Mongoose ODM** – For schema-based data modeling.  
- **Indexes & Optimized Queries** – Ensures fast message retrieval.  
- **Scalable Collections** – Separate models for users, conversations, and messages.  

##🏗️ Tech Stack

    ✨ **Frontend**  
       ⚛️ React.js (with Create React App / Vite)  
       🎨 Chakra UI / Tailwind CSS for responsive design  
       🔔 Socket.io-client for real-time communication  
       📦 Axios for API requests  
       🌐 React Router for navigation  

   ✨ **Backend**  
      🟢 Node.js + Express.js  
      🔔 Socket.io for WebSocket communication  
      🔐 JWT for authentication  
      🛡 bcrypt for password hashing  
      📦 dotenv for environment configuration  
      🧩 Middleware for role-based access control  

   📌 **Database**  
      🗄 MongoDB (Mongoose ODM) for storage of:  
         🔹 User authentication & profiles  
         🔹 Chat conversations (1-to-1 & group)  
         🔹 Messages with timestamps & deletion rules  
         🔹 Reminder and notification data 

## 🔄 Workflow
    1. User registers or logs in → JWT token issued.  
    2. Authenticated users connect via Socket.io.  
    3. Messages are exchanged instantly and saved in MongoDB.  
    4. Frontend listens to WebSocket events and updates UI in real time.  
    5. Notifications/reminders trigger alerts for users.  


## 🏗 Detailed System Architecture

                           +--------------------+
                           |       Client       |
                           | (Web Browser/App)  |
                           +---------+----------+
                                     |
                                     v
                           +--------------------+
                           |   React Frontend   |
                           |--------------------|
                           | - UI Components    |
                           | - Chat Window      |
                           | - Reminder Setup   |
                           | - Notifications    |
                           | - Auth Pages       |
                           +---------+----------+
                                     |
             --------------------------------------------------
             |                                                |
             v                                                v
   +---------------------+                       +---------------------+
   |  REST API (Express) |                       | WebSocket (Socket.io)|
   |---------------------|                       |----------------------|
   | - User Signup/Login |                       | - Real-time Messages |
   | - JWT Authentication|                       | - Typing Indicator   |
   | - User Management   |                       | - Online/Offline     |
   | - Reminder APIs     |                       | - Delivery Reports   |
   | - Message APIs      |                       +----------------------+
   | - Admin Controls    |
   +----------+----------+
              |
              v
   +---------------------+
   | Middleware Layer    |
   |---------------------|
   | - JWT Auth Check    |
   | - Role Validation   |
   | - Rate Limiting     |
   | - Abusive Language  |
   |   Detection & Block |
   +----------+----------+
              |
              v
   +---------------------+
   |  MongoDB Database   |
   |---------------------|
   | Collections:        |
   | - Users             |
   |   (id, email, role, |
   |    status, blocked) |
   | - Messages          |
   |   (sender, receiver,|
   |    content, time,   |
   |    deleted flag)    |
   | - Reminders         |
   |   (userId, message, |
   |    time, notified)  |
   | - Admin Logs        |
   |   (block actions,   |
   |    deleted msgs)    |
   +---------------------+

🔄 Flow Explanation

   🔹Client: User accesses the system from browser/app.
   🔹React Frontend: 
     Handles UI (chat, notifications, reminders, authentication forms).

   🔹Backend (Node.js + Express): 
     Provides REST APIs for CRUD operations (users, messages, reminders).

   🔹WebSocket (Socket.io): 
     Handles real-time messaging, typing status, message delivery.Middleware Layer:

   🔹Auth check (JWT validation).
     Role-based access (admin vs normal user).
     Rate limiting (avoid spam).
     Abusive language detection → If user sends abuse, system auto-blocks them.
     
   🔹MongoDB: Stores everything (users, chats, reminders, logs).

📂 Project Folder Structure:

chat-app/
│
├── 📁 backend/                 # Node.js + Express Backend
│   ├── 📁 config/               # Config files (db, environment, etc.)
│   │   └── db.js
│   │
│   ├── 📁 middleware/           # Middlewares (auth, role check, abuse filter)
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── abuseFilter.js
│   │
│   ├── 📁 models/               # Mongoose Models
│   │   ├── User.js
│   │   ├── Chat.js
│   │   ├── Reminder.js
│   │   └── BlockedUser.js
│   │
│   ├── 📁 routes/               # Express Routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── reminderRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── 📁 services/             # Business logic
│   │   ├── authService.js
│   │   ├── chatService.js
│   │   ├── reminderService.js
│   │   └── moderationService.js
│   │
│   ├── 📁 utils/                # Utility functions
│   │   ├── generateToken.js
│   │   └── logger.js
│   │
│   ├── server.js                # Entry point
│   └── socket.js                # Socket.io real-time logic
│
├── 📁 frontend/                 # React + Vite Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI Components
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   └── ReminderModal.jsx
│   │   │
│   │   ├── 📁 pages/            # Pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ChatRoom.jsx
│   │   │   └── AdminDashboard.jsx
│   │   │
│   │   ├── 📁 context/          # React Context (Auth, Chat, etc.)
│   │   │   ├── AuthContext.js
│   │   │   └── ChatContext.js
│   │   │
│   │   ├── 📁 services/         # API Calls using Axios
│   │   │   ├── authService.js
│   │   │   ├── chatService.js
│   │   │   └── reminderService.js
│   │   │
│   │   ├── 📁 utils/            # Helper functions
│   │   │   ├── formatDate.js
│   │   │   └── validateForm.js
│   │   │
│   │   ├── App.jsx              # Root Component
│   │   └── main.jsx             # Entry point
│   │
│   └── vite.config.js
│
├── 📄 package.json
├── 📄 README.md
├── 📄 .env
└── 📄 .gitignore







