# 🔐 Admin Section Guide - MindFul Journal

## How to Access Admin Section

### Login with Admin Account
1. **Go to Login Page**: Navigate to `http://localhost:5174/login`
2. **Use Admin Credentials**:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
3. **Click "Sign In"**
4. **Admin Dashboard link** will automatically appear in the Sidebar (only visible for admin users)
5. **Click "Admin" in the Sidebar** to access the Admin Dashboard

---

## Admin Dashboard Features

### Location
- **Sidebar**: Look for the "Admin" menu item (only shows if you're logged in as admin)
- **Direct URL**: `http://localhost:5174/admin`

### What Admins Can Do

#### 1. **View Flagged Content**
   - See all user messages and journal entries that contain concerning keywords
   - Monitor mental health crisis indicators
   - Track content that may need intervention

#### 2. **Filter & Search Flagged Content**
   - **Status Filter**: View All | Pending | Reviewed
   - **Risk Level Filter**: Critical | High | Medium | Low
   - **Sort by**: Most recent first

#### 3. **Risk Assessment**
   - **Critical**: Immediate intervention needed (suicide/self-harm mentions)
   - **High**: Serious concern requiring attention
   - **Medium**: Moderate concern to monitor
   - **Low**: Minor warning signs

#### 4. **Mark Content as Reviewed**
   - Click "Mark as Reviewed" button
   - Records admin name and timestamp
   - Tracks when content was reviewed

---

## Admin Database Structure

### Data Stored for Admin Monitoring

```javascript
FlaggedContent = {
  id: string,                    // Unique identifier
  contentType: 'message' | 'journal_entry',  // Type of content
  content: string,               // The actual flagged text
  reason: string,                // Why it was flagged (keywords found)
  riskLevel: 'critical' | 'high' | 'medium' | 'low',  // Severity
  timestamp: number,             // When it was flagged (milliseconds)
  userId: string,                // Which user created the content
  reviewed: boolean,             // Has admin reviewed it?
  reviewedAt: number,            // When admin reviewed it (optional)
  reviewedBy: string,            // Which admin reviewed it (optional)
}
```

### What Content Gets Flagged?

The system automatically flags content containing keywords related to:

#### **CRITICAL Keywords** (Suicide/Self-Harm):
- "suicide", "kill myself", "end my life", "no point", "better off dead", "self harm", "cut myself", "harm myself"

#### **HIGH Keywords** (Severe Crisis):
- "depressed", "hopeless", "worthless", "hate myself", "give up", "can't cope", "breakdown", "panic attack"

#### **MEDIUM Keywords** (Mental Health Concern):
- "sad", "lonely", "anxious", "stressed", "worried", "scared", "overwhelmed", "struggling"

#### **LOW Keywords** (General wellness):
- "tired", "upset", "frustrated", "confused", "confused", "unsure"

---

## Admin Workflow

### Step 1: Monitor Flagged Content
```
Dashboard → View all flagged messages/journal entries
```

### Step 2: Identify Risk Level
```
Look at the "Risk Level" badge:
🔴 Critical → Immediate action needed
🟠 High → Close monitoring
🟡 Medium → Regular check-ins
🟢 Low → General awareness
```

### Step 3: Review Content Details
```
Read:
- The user's content
- Reason for flagging
- Risk level
- Timestamp of the content
```

### Step 4: Take Action
```
Option 1: Mark as Reviewed
→ Click "Mark as Reviewed" 
→ Records your name and time

Option 2: Contact User/Authorities (Manual)
→ Use the user info to reach out
→ Follow your crisis response protocol
```

### Step 5: Filter & Track
```
Filter by Status: "Reviewed" to see handled cases
Filter by Risk: "Critical" to see urgent items
```

---

## Key Metrics for Admins

### What to Monitor

1. **Pending Critical Cases**
   - How many unreviewed critical-risk contents
   - Response time to critical items

2. **User Safety Trends**
   - Patterns of crisis mentions
   - Frequency of concerning content
   - Which users need support

3. **Content Types**
   - Chat messages vs Journal entries
   - Time of day concerning content appears

4. **Review Status**
   - How many flagged items are reviewed
   - Which items are pending action

---

## Crisis Response Resources

When you see a CRITICAL flagged item, have these ready:

### Immediate Response
1. **Mark as Reviewed** in the system
2. **Note the user** for follow-up
3. **Check timestamp** - is it recent?
4. **Escalate if needed** - contact crisis services

### Resources to Share with Users
- **National Suicide Prevention Lifeline**: 988 (US)
- **Crisis Text Line**: Text HOME to 741741
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

---

## Admin Account Types

### Super Admin
- Email: `admin@example.com`
- Password: `admin123`
- Permissions: Full access to admin dashboard

### Regular User (Demo)
- Email: `demo@example.com`
- Password: `demo123`
- Permissions: Can use all features except admin dashboard

---

## Data Privacy Notes

⚠️ **Important**: In a production system:
- Never store passwords in plain text (hash them!)
- Encrypt sensitive data
- Use role-based access control
- Implement audit logs for admin actions
- Add data retention policies
- Ensure HIPAA/privacy law compliance

Current implementation uses localStorage (client-side only) for demo purposes.

---

## Troubleshooting

### Admin Dashboard Not Showing?
- **Issue**: You're not logged in as admin
- **Solution**: Log in with `admin@example.com` / `admin123`

### Can't see Admin in Sidebar?
- **Issue**: Not authenticated as admin user
- **Solution**: Check user dropdown menu - should show "Admin User" name

### Flagged Content Not Appearing?
- **Issue**: No content has been flagged yet
- **Solution**: Create journal entries or chat messages with concerning keywords to trigger flagging

### Want to Add More Admin Users?
Currently, you must create them in `AuthContext.tsx`. In production, use:
- Admin registration form
- Role assignment system
- Permission management

---

## API Endpoints (For Backend Integration)

When moving to a real backend, create these endpoints:

```
GET /api/admin/flagged-content          - Get all flagged content
GET /api/admin/flagged-content/:id      - Get single flagged item
PUT /api/admin/flagged-content/:id      - Mark as reviewed
GET /api/admin/analytics                - Get admin statistics
POST /api/admin/users                   - Manage admin users
GET /api/admin/logs                     - View audit logs
```

---

## Summary

✅ **Admin Section Is Ready!**
- Login with admin account
- Monitor flagged content
- Review and track concerning messages
- Use risk levels to prioritize action
- All data stored locally (client-side)

🚀 **Next Steps**:
1. Test by creating journal entries with crisis keywords
2. See them appear in admin dashboard
3. Practice marking them as reviewed
4. Set up crisis response protocols
