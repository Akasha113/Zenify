# MindFul Journal - Complete API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Routes

### Register User
```
POST /auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```
**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

### Login
```
POST /auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:** (Same as register + sends login confirmation email)

### Get Current User
```
GET /auth/me
```
**Headers:** Authorization required
**Response:** User object

---

## 👤 User Routes

### Get User Profile
```
GET /users/profile
```
**Response:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": null,
  "bio": "I love mental wellness",
  "isAdmin": false,
  "riskLevel": "low",
  "lastLogin": "2026-01-15T10:30:00Z",
  "loginCount": 5,
  "settings": {
    "theme": "dark",
    "notifications": true,
    "fontSize": "medium",
    "emailNotifications": true
  }
}
```

### Update Profile
```
PUT /users/profile
```
**Body:**
```json
{
  "name": "John Doe",
  "bio": "New bio",
  "avatar": "https://example.com/avatar.jpg"
}
```

### Update Settings
```
PUT /users/settings
```
**Body:**
```json
{
  "theme": "dark",
  "notifications": true,
  "fontSize": "large",
  "emailNotifications": true
}
```

### Change Password
```
POST /users/change-password
```
**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

---

## 💬 Chat Routes

### Create Conversation
```
POST /chat
```
**Body:**
```json
{
  "title": "My First Chat"
}
```

### Get All Conversations
```
GET /chat
```
**Query Params:**
- `sort`: createdAt, updatedAt
- `limit`: 20 (default)
- `skip`: 0 (default)

**Response:**
```json
[
  {
    "_id": "...",
    "userId": "...",
    "title": "My First Chat",
    "riskLevel": "low",
    "flagged": false,
    "createdAt": "2026-01-15T10:30:00Z",
    "updatedAt": "2026-01-15T10:35:00Z"
  }
]
```

### Get Single Conversation
```
GET /chat/:id
```

### Add Message to Conversation
```
POST /chat/:id/messages
```
**Body:**
```json
{
  "content": "I'm feeling sad today",
  "role": "user"
}
```
**Response:** Updated conversation with all messages

### Delete Conversation
```
DELETE /chat/:id
```

---

## 📔 Journal Routes

### Create Journal Entry
```
POST /journal
```
**Body:**
```json
{
  "title": "My Day",
  "content": "Today was a good day...",
  "mood": "happy",
  "tags": ["productive", "happy"]
}
```

### Get All Journal Entries
```
GET /journal
```
**Query Params:**
- `limit`: 20
- `skip`: 0

### Get Single Entry
```
GET /journal/:id
```

### Update Entry
```
PUT /journal/:id
```
**Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "mood": "neutral",
  "tags": ["tag1", "tag2"]
}
```

### Delete Entry
```
DELETE /journal/:id
```

---

## 😊 Mood Routes

### Record Mood Entry
```
POST /mood
```
**Body:**
```json
{
  "mood": "happy",
  "intensity": 8,
  "note": "Had a great day",
  "activities": ["exercise", "reading"],
  "triggers": ["success", "family time"]
}
```

### Get Mood History
```
GET /mood
```
**Query Params:**
- `days`: 30 (default) - Last X days to retrieve

### Get Mood Statistics
```
GET /mood/stats/:period
```
**Params:**
- `period`: week, month, year

**Response:**
```json
{
  "period": "month",
  "totalEntries": 25,
  "averageIntensity": 6.5,
  "moodBreakdown": {
    "happy": 8,
    "neutral": 12,
    "sad": 5
  },
  "mostCommonMood": "neutral"
}
```

---

## 🔐 Admin Routes (Admin Only)

### Get Flagged Content
```
GET /admin/flagged
```
**Query Params:**
- `status`: pending, reviewed, escalated, all (default: all)
- `riskLevel`: critical, high, medium, low, all (default: all)
- `page`: 1 (default)
- `limit`: 20 (default)

**Response:**
```json
{
  "data": [
    {
      "_id": "...",
      "userId": {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "type": "chat",
      "content": "I'm thinking about...",
      "riskLevel": "high",
      "keywords": ["suicide"],
      "status": "pending",
      "flaggedAt": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

### Get Flagged Content Detail
```
GET /admin/flagged/:id
```

### Review Flagged Content
```
PUT /admin/flagged/:id/review
```
**Body:**
```json
{
  "status": "reviewed",
  "notes": "Reviewed and discussed with user",
  "actionTaken": "User provided crisis resources"
}
```

### Escalate Flagged Content
```
POST /admin/flagged/:id/escalate
```
**Body:**
```json
{
  "escalatedTo": ["admin_id_1", "admin_id_2"]
}
```

### Contact User
```
POST /admin/flagged/:id/contact-user
```
**Body:**
```json
{
  "method": "email"
}
```

### Get Dashboard Statistics
```
GET /admin/stats/overview
```
**Response:**
```json
{
  "total_flagged": 45,
  "critical": 3,
  "high": 12,
  "medium": 20,
  "low": 10,
  "pending": 5,
  "reviewed": 30,
  "escalated": 10,
  "total_users": 150,
  "active_users_24h": 45
}
```

### Get High-Risk Users
```
GET /admin/users/at-risk
```
**Response:**
```json
[
  {
    "_id": "user_id",
    "count": 5,
    "highestRisk": "critical",
    "lastFlagged": "2026-01-15T10:30:00Z",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

---

## 📧 Email Routes

### Send Test Email
```
POST /email/test
```
**Body:**
```json
{
  "email": "recipient@example.com",
  "name": "John Doe"
}
```

### Send Welcome Email
```
POST /email/welcome
```
(Sends to authenticated user)

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid email or password"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200  | OK - Request successful |
| 201  | Created - Resource created |
| 400  | Bad Request - Invalid input |
| 401  | Unauthorized - Auth required |
| 403  | Forbidden - No permission |
| 404  | Not Found - Resource doesn't exist |
| 500  | Server Error |

