# Admin Access Quick Reference

## 🔓 Login Credentials

### Admin Account
```
Email: admin@example.com
Password: admin123
```

### Regular User (for testing)
```
Email: demo@example.com
Password: demo123
```

---

## 📊 Admin Dashboard Overview

| Feature | Description | Purpose |
|---------|-------------|---------|
| **Flagged Content** | All monitored messages & journal entries | Safety monitoring |
| **Status Filter** | All / Pending / Reviewed | Track review progress |
| **Risk Level Filter** | Critical / High / Medium / Low | Prioritize urgent cases |
| **Mark Reviewed** | Document admin action | Track interventions |
| **Content Details** | Full message + reason + timestamp | Assess situation |

---

## 🚨 Risk Levels

| Level | Color | Response | Examples |
|-------|-------|----------|----------|
| **Critical** | 🔴 Red | Immediate intervention | Suicide mentions, self-harm |
| **High** | 🟠 Orange | Urgent attention | Severe depression, hopelessness |
| **Medium** | 🟡 Yellow | Close monitoring | Anxiety, stress, loneliness |
| **Low** | 🟢 Green | General awareness | Tiredness, frustration |

---

## 📋 Admin Database Structure

### FlaggedContent Table
```javascript
{
  id: "unique_id",
  contentType: "message" or "journal_entry",
  content: "actual text content",
  reason: "keywords that triggered flag",
  riskLevel: "critical/high/medium/low",
  timestamp: 1705315200000,          // when flagged
  userId: "user_who_created_it",
  reviewed: true/false,              // has admin seen it?
  reviewedAt: 1705320000000,         // when reviewed
  reviewedBy: "Admin User"           // which admin
}
```

### Other Admin Data

**UserProfile Table** - Track per user:
```javascript
{
  name: "user name",
  email: "user@example.com",
  isAdmin: false/true,
  joinDate: timestamp
}
```

**Conversations Table** - All messages:
```javascript
{
  id: "conversation_id",
  messages: [
    {
      role: "user" or "assistant",
      content: "message text",
      timestamp: timestamp
    }
  ]
}
```

**JournalEntries Table** - All journals:
```javascript
{
  id: "entry_id",
  title: "entry title",
  content: "full entry text",
  mood: "great/good/neutral/bad/awful",
  tags: ["tag1", "tag2"],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🔍 How Content Gets Flagged

### Automatic Flagging System

The system scans all user content (chat messages + journal entries) and assigns risk levels based on keywords:

#### Critical Risk Keywords
```
suicide, kill myself, end my life, no point living,
better off dead, self harm, cut myself, harm myself,
jump off, hang myself, overdose
```

#### High Risk Keywords
```
depressed, hopeless, worthless, hate myself, give up,
can't cope, complete breakdown, severe panic attack,
constant worry, unable to function, life isn't worth
```

#### Medium Risk Keywords
```
sad, lonely, anxious, stressed, worried, scared,
overwhelmed, struggling, down, upset, exhausted
```

#### Low Risk Keywords
```
tired, frustrated, confused, unsure, overwhelmed,
bothered, concerned
```

---

## 📈 Admin Workflow

```
1. LOGIN
   ↓
2. NAVIGATE TO ADMIN
   (Sidebar → Admin, or /admin)
   ↓
3. REVIEW DASHBOARD
   - See total flagged items
   - See breakdown by risk level
   - See pending items
   ↓
4. APPLY FILTERS
   - Status: All/Pending/Reviewed
   - Risk: Critical/High/Medium/Low
   ↓
5. READ FLAGGED CONTENT
   - User who created it
   - What they said
   - Why it was flagged
   - When it was created
   ↓
6. TAKE ACTION
   - Option A: Click "Mark as Reviewed" (documented)
   - Option B: Contact user directly (if critical)
   - Option C: Escalate to authorities (if emergency)
   ↓
7. DOCUMENT
   - System records admin name
   - System records timestamp
   - System shows review status
```

---

## 🎯 Admin Priorities

### Daily Tasks
- [ ] Check Critical items (unreviewed)
- [ ] Review High risk items
- [ ] Update Medium items if 24+ hours old
- [ ] Note trends in Low items

### Weekly Tasks
- [ ] Generate safety report
- [ ] Identify at-risk users
- [ ] Review all pending items
- [ ] Update crisis protocols

### Monthly Tasks
- [ ] Analyze patterns
- [ ] User risk assessment
- [ ] Resource effectiveness review
- [ ] Policy updates

---

## 🚨 Crisis Resources (Include in User Messages)

**When you see CRITICAL:**
- Call: 988 (US Suicide Prevention Lifeline)
- Text: HOME to 741741 (Crisis Text Line)
- Email: Send crisis resources
- Follow: Company escalation protocol

---

## 💾 Data Storage (Current Implementation)

```
Storage Location: Browser localStorage
Type: Client-side only
Persistence: Until browser cache cleared
Backup: Manual export via Settings
Production: Should use backend database
```

---

## ⚠️ Important Notes

1. **Admin-Only Access**: Only users with `isAdmin: true` can see admin dashboard
2. **No Hard Delete**: Reviewed items are marked, not deleted (for audit trail)
3. **User Privacy**: Admin can see all user messages/journals
4. **Timestamp**: All actions are logged with exact timestamp
5. **Production**: This demo uses localStorage - use secure backend DB in production

---

## Testing the Admin System

### Create Flagged Content (to test)
1. Log in as `demo@example.com` / `demo123`
2. Go to Chat or Journal
3. Write something with keywords:
   - "I'm feeling suicidal" → Critical
   - "I hate myself and feel hopeless" → High
   - "I'm really anxious and stressed" → Medium

### Watch It Get Flagged
1. Submit the message
2. Log out
3. Log in as `admin@example.com` / `admin123`
4. Go to Admin Dashboard
5. See your flagged content appear!

### Mark as Reviewed
1. Click "Mark as Reviewed" button
2. Check "Reviewed" status updates
3. See admin name recorded
4. Filter by "Reviewed" to verify

---

## API Integration (Future)

When connecting to a backend:

```javascript
// Admin API calls would look like:

// Get all flagged content
GET /api/admin/flagged-content
Response: Array<FlaggedContent>

// Get flagged content by user
GET /api/admin/flagged-content?userId=123
Response: Array<FlaggedContent>

// Mark as reviewed
PUT /api/admin/flagged-content/456
Body: { reviewed: true }
Response: Updated FlaggedContent

// Get admin analytics
GET /api/admin/analytics
Response: {
  totalFlagged: 42,
  pending: 5,
  critical: 2,
  high: 8,
  byUser: {...},
  byDate: {...}
}
```

---

## Summary

✅ Admin section is **LIVE** and ready!
- Access with: `admin@example.com` / `admin123`
- Monitor flagged content automatically
- Manage by risk level and status
- Track all interventions
- All data stored locally for now
- Built for mental health safety first!

🚀 Ready to protect users!
