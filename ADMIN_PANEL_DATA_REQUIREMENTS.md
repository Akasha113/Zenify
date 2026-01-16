# MindFul Journal - Admin Panel Data Requirements

## Current Status
✅ Already Implemented:
- Flagged content monitoring (chat & journal)
- Risk level detection (critical, high, medium, low)
- Content review tracking
- Auto-flagging system

## Recommended Admin Panel Dashboard Layout

### 1. **Dashboard Overview (Top Section)**

```
┌─────────────────────────────────────────────────────────┐
│  📊 ADMIN DASHBOARD - MindFul Journal                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ CRITICAL ⚠️  │  │   HIGH 🔴    │  │  MEDIUM 🟠   │   │
│  │      3       │  │      12      │  │      28      │   │
│  │   Pending    │  │   Reviewed   │  │   Reviewed   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Active Users │  │   Flagged    │  │  Avg Response│   │
│  │      47      │  │   Content    │  │   12 mins    │   │
│  │   Today      │  │      43      │  │   (Critical) │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                           │
│  Last Critical Alert: 2 hours ago (User #2847)          │
└─────────────────────────────────────────────────────────┘
```

### 2. **Flagged Content Table** (Main Section)

Display with sortable/filterable columns:

| Column | Data | Purpose |
|--------|------|---------|
| **ID** | Unique flag ID | Reference |
| **Risk Level** | 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low | Priority indicator |
| **User** | User ID / Anonymous | Who flagged |
| **Type** | Chat / Journal | Content source |
| **Content Preview** | First 100 chars | Quick view |
| **Keywords Detected** | List of crisis keywords | Why flagged |
| **Timestamp** | Date & time | When detected |
| **Status** | 🔵 Pending / ✅ Reviewed / 🔔 Escalated | Action status |
| **Actions** | View / Review / Escalate / Close | Admin actions |

**Example Row:**
```
🔴 CRITICAL | User#2847 | Chat | "I can't do this anymore, I'm going to..." 
Keywords: ["suicide", "ending"], Timestamp: 2min ago, Status: Pending
[👁️ View] [✅ Mark Reviewed] [🚨 Escalate] [❌ Close]
```

### 3. **Crisis Keywords Detection**

```json
{
  "criticalKeywords": [
    "suicide",
    "kill myself",
    "ending my life",
    "self harm",
    "cut myself",
    "no one cares"
  ],
  "highRiskKeywords": [
    "depressed",
    "hopeless",
    "can't handle",
    "want to die"
  ],
  "mediumRiskKeywords": [
    "sad",
    "anxious",
    "stress",
    "struggling"
  ]
}
```

### 4. **Detailed Alert View**

When admin clicks "View" on flagged content:

```
┌─────────────────────────────────────────────────────┐
│ ALERT DETAILS #FLAG_2847                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Risk Level: 🔴 CRITICAL                            │
│ Detected: Jan 15, 2026 - 2:34 PM                  │
│ User ID: user_2847 | Name: John Doe (if available)│
│ Email: john@example.com                            │
│                                                     │
│ ─────────────────────────────────────────────────  │
│ FULL CONTENT:                                       │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ "I can't do this anymore. Everything is too       │
│  much. I'm thinking about ending my life. No      │
│  one would even notice if I was gone."            │
│                                                     │
│ ─────────────────────────────────────────────────  │
│ ANALYSIS:                                           │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ Keywords Detected: suicide, ending life, self-harm │
│ Sentiment: Very Negative                           │
│ Context: First mention in conversation             │
│ Conversation ID: conv_2847                         │
│                                                     │
│ ─────────────────────────────────────────────────  │
│ ACTIONS TAKEN:                                      │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ ☐ Email sent to mental health coordinator         │
│ ☐ Assigned to counselor: [Dropdown]               │
│ ☐ Auto-escalated to crisis team                   │
│                                                     │
│ [👁️ Mark Reviewed] [🚨 Escalate] [📧 Send Alert] │
│ [💬 Contact User] [📋 View Full Chat] [❌ Close]  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 5. **User Activity Log**

Track individual user patterns:

```
USER PROFILE: john@example.com (ID: user_2847)
────────────────────────────────────
Account Created: Jan 1, 2026
Last Login: Today, 2:15 PM
Status: 🔴 HIGH RISK

Chat History:
- Jan 15, 2:34 PM - 🔴 Critical message detected
- Jan 15, 1:20 PM - Normal conversation
- Jan 14, 11:45 PM - 🟠 High-risk message detected

Journal Entries:
- Jan 15, 2:00 PM - 🟠 High-risk entry
- Jan 14, 5:30 PM - Normal entry

Mood Tracking:
- 7 days: sad → sad → very sad → extremely sad → sad → very sad → sad

Recommended Action:
⚠️ User showing escalating pattern of crisis indicators
→ Recommend immediate outreach by mental health professional
```

### 6. **Statistics & Reports**

```
PERIOD: Last 30 Days
──────────────────────

Flagged Content:
- Total: 487
- Critical: 23 (4.7%)
- High: 127 (26%)
- Medium: 247 (50.7%)
- Low: 90 (18.5%)

Response Time (Critical Cases):
- Average: 8 minutes
- Fastest: 2 minutes
- Slowest: 45 minutes

User Engagement:
- Active Users: 1,247
- New Users: 89
- Users at Risk: 156 (12.5%)

Crisis Interventions:
- Users Contacted: 23
- Escalated to Professionals: 8
- Resolved Cases: 4

Top Crisis Keywords:
1. "depressed" - 234 occurrences
2. "suicide" - 87 occurrences
3. "hopeless" - 76 occurrences
4. "can't handle" - 65 occurrences
5. "self harm" - 43 occurrences

Export as: [PDF] [CSV] [JSON]
```

### 7. **Administrative Tools**

```
TOOLS & SETTINGS
────────────────

🔧 Keyword Management:
   [Add Crisis Keyword] [Edit Existing] [Disable Keyword]

🔔 Alert Settings:
   - Critical alerts: Email + SMS + Push
   - High alerts: Email + Push
   - Medium alerts: Email only
   
⚙️ Escalation Rules:
   - Auto-escalate after X hours of no review
   - Auto-contact mental health coordinator
   - Auto-notify emergency services (for critical)

👥 Team Management:
   - Add/Remove Admins
   - Assign reviewers to cases
   - Set reviewer capacity

📊 Report Templates:
   - Daily Summary Report
   - Weekly Risk Analysis
   - Monthly User Health Report
```

### 8. **Emergency Response Panel**

```
🚨 ACTIVE EMERGENCIES (Last 24 Hours)
─────────────────────────────────────

[🔴] User #2847 - CRITICAL
   Status: Pending Professional Contact
   Time Flagged: 2 hours ago
   [Call Professional] [Send Alert] [Mark as Contacted]

[🟠] User #3012 - HIGH
   Status: Waiting for Review
   Time Flagged: 45 minutes ago
   [Review Now] [Assign to Team Member]

[🟡] User #4156 - MEDIUM
   Status: Under Review by John Admin
   Time Flagged: 30 minutes ago
   [View Details] [Add Notes]
```

### 9. **Notification Center for Admins**

```
🔔 NOTIFICATIONS
────────────────

NEW CRITICAL ALERT (2 min ago)
  User #2847 mentioned suicide in chat
  [View] [Dismiss]

HIGH RISK CONTENT (15 min ago)
  User #3012 journal entry flagged
  [View] [Dismiss]

ESCALATION NEEDED (1 hour ago)
  Multiple flagged items from User #4156 - no review
  [Auto-escalate] [Dismiss]

SYSTEM ALERT (2 hours ago)
  Email service down - notifications delayed
  [Acknowledge]
```

---

## Implementation Priority

### Phase 1 (Current) ✅
- [x] Flagged content detection
- [x] Risk level classification
- [x] Content review tracking
- [x] Basic admin dashboard

### Phase 2 (Recommended)
- [ ] User activity tracking
- [ ] Crisis keyword management
- [ ] Advanced filtering/search
- [ ] Export reports
- [ ] Statistics dashboard

### Phase 3 (Advanced)
- [ ] Integration with real mental health professionals
- [ ] SMS/Email alerts
- [ ] User contact automation
- [ ] Pattern analysis
- [ ] Predictive alerts

---

## Data Protection & Privacy

⚠️ **IMPORTANT:**
- All admin access should be logged
- Implement role-based access control (RBAC)
- Encrypt sensitive user data
- HIPAA compliance if handling real health data
- Audit trail for all admin actions
- Data retention policy (e.g., delete after 90 days)

---

## Current Admin Panel Improvements Needed

Looking at your `AdminPage.tsx`, add:

1. ✅ Flagged content display - Already done
2. 🔄 Search/filter functionality
3. 📊 Statistics cards (not just list)
4. 🎯 User activity tracking
5. ⏱️ Response time metrics
6. 📈 Trend analysis
7. 🎛️ Advanced filtering options

