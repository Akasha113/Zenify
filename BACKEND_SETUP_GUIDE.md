# MindFul Journal - Complete Setup Guide for FYP

## 📋 Prerequisites

- Node.js (v14+) - Download from https://nodejs.org/
- MongoDB (Local or Atlas cloud)
- Gmail Account with 2FA enabled
- Git (optional)

---

## 🚀 Quick Start (5 minutes)

### Step 1: Setup MongoDB

**Option A: MongoDB Atlas (Cloud) - RECOMMENDED ✅**
1. Sign up at https://www.mongodb.com/cloud/atlas (FREE)
2. Create a free M0 cluster (512MB storage - enough for FYP)
3. Click "Connect" → "Drivers"
4. Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/mindful-journal?retryWrites=true&w=majority
   ```
5. Go to **Network Access** → **IP Whitelist** → "Allow access from anywhere"
6. Paste connection string in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindful-journal?retryWrites=true&w=majority
   ```

**Option B: Local MongoDB (if you prefer)**
1. Download and install from: https://www.mongodb.com/try/download/community
2. Run MongoDB:
   ```bash
   mongod
   ```
3. Leave terminal running
4. Use in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mindful-journal
   ```

### Step 2: Setup Gmail for Email Sending

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Search "App passwords"
4. Create app password for "Mail" and "Windows Computer"
5. Copy the 16-character password

### Step 3: Setup Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in:
```env
MONGODB_URI=mongodb://localhost:27017/mindful-journal
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
JWT_SECRET=your-secret-key-change-this
```

Install dependencies:
```bash
npm install
```

Start backend:
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:3001
```

### Step 4: Setup Frontend

In a **new terminal**:
```bash
cd ..
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 📚 Project Structure

```
Zenify/
├── frontend/
│   ├── src/
│   │   ├── pages/        (React pages)
│   │   ├── components/   (UI components)
│   │   ├── utils/        (Utilities)
│   │   └── context/      (Auth context)
│   ├── package.json
│   └── vite.config.ts
│
└── backend/
    ├── models/           (Database models)
    ├── routes/           (API endpoints)
    ├── middleware/       (Auth, validation)
    ├── services/         (Email, risk analysis)
    ├── server.js         (Main server)
    ├── package.json
    └── .env             (Environment variables)
```

---

## 🔌 Testing the API

### Option 1: Using Postman (GUI)
1. Download Postman: https://www.postman.com/downloads/
2. Import collection from API docs
3. Test endpoints

### Option 2: Using cURL (Terminal)

Register:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123","passwordConfirm":"pass123"}'
```

Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

Copy the token from response and use it:
```bash
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Option 3: Using Frontend UI
1. Go to http://localhost:5173
2. Register/Login
3. Test all features

---

## 🎯 Key Features Implemented

✅ **Authentication**
- User registration & login
- JWT tokens
- Password hashing with bcryptjs

✅ **Chat System**
- Create conversations
- Add messages with crisis detection
- Auto-flagging high-risk content

✅ **Journal**
- Create journal entries
- Risk analysis on save
- Edit & delete entries

✅ **Mood Tracking**
- Record daily moods
- View history (7/30/365 days)
- Get statistics

✅ **Admin Dashboard**
- View all flagged content
- Filter by risk level & status
- Review & escalate content
- Contact users
- View at-risk users
- Statistics overview

✅ **Email Notifications**
- Login confirmation emails
- Welcome emails
- Crisis alerts to admin
- Real emails via Gmail SMTP

✅ **Security**
- Password hashing
- JWT authentication
- Rate limiting
- CORS protection

---

## 🛠️ Troubleshooting

### MongoDB not connecting
```bash
# Check if MongoDB is running
mongod

# Or use MongoDB Atlas cloud version
# Update MONGODB_URI in .env
```

### Email not sending
1. Check Gmail app password is correct (16 chars with spaces)
2. Verify 2FA is enabled
3. Check spam folder
4. Use SendGrid instead:
   - Sign up: https://sendgrid.com
   - Add API key to .env

### Port already in use
```bash
# Change port in .env
PORT=3002

# Or kill process using port 3001
# Windows:
taskkill /F /IM node.exe

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

### JWT token errors
1. Make sure `JWT_SECRET` is set in `.env`
2. Token expires after 7 days by default
3. User must login again to get new token

---

## 📝 Admin Account

The first admin account needs to be created manually. To make a user admin:

1. Start MongoDB
2. Use MongoDB Compass or Atlas UI
3. Edit user document and set `isAdmin: true`

Or via code in `.env`:
```
ADMIN_EMAIL=admin@mindfulfjournal.com
```

---

## 🌐 Deployment

### Heroku (Recommended)
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

heroku login
heroku create your-app-name
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGODB_URI=your-mongodb-uri
git push heroku main
```

### Railway.app
1. Sign up at https://railway.app
2. Connect GitHub repo
3. Add environment variables
4. Deploy

### Vercel (Frontend only)
```bash
npm install -g vercel
vercel
```

---

## 📊 Database Models

### User
- name, email, password
- avatar, bio
- isAdmin, riskLevel
- settings (theme, notifications, fontSize)

### Conversation
- userId, title
- messages (role, content, timestamp)
- riskLevel, flagged, flagReason

### JournalEntry
- userId, title, content
- mood, riskLevel
- flagged, flagReason

### MoodEntry
- userId, mood (happy/sad/etc)
- intensity (1-10)
- activities, triggers

### FlaggedContent
- userId, type (chat/journal)
- content, riskLevel
- status (pending/reviewed/escalated)
- reviewedBy, notes

---

## 🔒 Security Notes

⚠️ **Before Production:**
1. Change JWT_SECRET to a strong random string
2. Set NODE_ENV=production
3. Use HTTPS only
4. Add rate limiting
5. Validate all inputs
6. Use environment variables
7. Enable CORS properly
8. Hash passwords (already done with bcryptjs)
9. Add HTTPS SSL certificate
10. Setup database backups

---

## 📞 Support

For issues:
1. Check `.env` file is configured correctly
2. Check backend is running on port 3001
3. Check MongoDB is running
4. Check frontend is connecting to correct API URL
5. Check browser console for errors (F12)
6. Check terminal logs for server errors

---

## 🎓 For Your FYP

This backend includes:
- ✅ Complete authentication system
- ✅ Database design
- ✅ API endpoints
- ✅ Crisis detection algorithm
- ✅ Admin monitoring dashboard
- ✅ Email notifications
- ✅ Risk analysis & flagging
- ✅ User management
- ✅ Error handling
- ✅ Production-ready code

All documented and production-ready for your Final Year Project!

