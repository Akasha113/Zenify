# MindFul Journal Backend

## Environment Setup

Create a `.env` file in the backend directory:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/mindful-journal
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindful-journal?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Service (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Email Service (SendGrid - Alternative)
SENDGRID_API_KEY=SG.your-sendgrid-key

# GitHub Models API (for AI chat)
GITHUB_API_TOKEN=your-github-token
GITHUB_MODEL=gpt-4o-mini

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Admin Email
ADMIN_EMAIL=admin@mindfulfjournal.com
```

## Installation

```bash
cd backend
npm install
```

## Running the Server

### Development (with auto-reload):
```bash
npm run dev
```

### Production:
```bash
npm start
```

## Database Setup

### Option 1: Local MongoDB

Install MongoDB Community Edition:
- Windows: https://www.mongodb.com/try/download/community
- Run: `mongod` in terminal

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Add to `.env` as `MONGODB_URI`

## API Endpoints

See `BACKEND_API.md` for complete API documentation.

## Key Features

✅ User Authentication (JWT)
✅ Real Email Notifications
✅ Chat with AI
✅ Journal Management
✅ Mood Tracking
✅ Admin Dashboard
✅ Crisis Detection
✅ User Activity Logging
✅ Data Analytics

## Testing

```bash
npm test
```

## Deployment

Recommended platforms:
- **Heroku** (Free tier available)
- **Railway**
- **Vercel** (serverless)
- **AWS** (EC2)
