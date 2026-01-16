# Real Email Setup Guide

## Option 1: Using Gmail SMTP (Simplest)

### Step 1: Enable 2FA on Gmail
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Search "App passwords" 
4. Create app password for "Mail" and "Windows Computer"
5. Copy the 16-character password

### Step 2: Create Backend API (Node.js + Express + Nodemailer)

Install dependencies:
```bash
npm install express nodemailer cors dotenv
```

Create `backend/emailService.js`:
```javascript
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // your-email@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD, // 16-char app password
  },
});

async function sendLoginEmail(to, name, email) {
  const htmlContent = `
    <!-- Email HTML from emailService.ts -->
  `;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: to,
      subject: '✅ Welcome to MindFul Journal - Login Confirmed',
      html: htmlContent,
    });
    console.log('Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

module.exports = { sendLoginEmail };
```

Create `backend/server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const { sendLoginEmail } = require('./emailService');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Email endpoint
app.post('/api/send-login-email', async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name required' });
  }

  const success = await sendLoginEmail(email, name, email);

  if (success) {
    return res.json({ success: true, message: 'Email sent successfully' });
  } else {
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(3001, () => {
  console.log('Email server running on port 3001');
});
```

Create `.env` file:
```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

Run backend:
```bash
node backend/server.js
```

### Step 3: Update Frontend emailService.ts

Replace the localStorage email service with API call:

```typescript
export const sendLoginConfirmationEmail = async (email: string, name: string): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3001/api/send-login-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('📧 Email sent to:', email);
      return true;
    } else {
      console.error('Email send failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
};
```

---

## Option 2: Using SendGrid (Enterprise-Ready)

1. Sign up at https://sendgrid.com
2. Get API key from Settings → API Keys
3. Install: `npm install @sendgrid/mail`
4. Use in backend:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: 'noreply@mindfulfjournal.com',
  subject: '✅ Login Confirmed',
  html: emailContent,
});
```

---

## Option 3: Using Mailgun

1. Sign up at https://mailgun.com
2. Get API credentials
3. Install: `npm install mailgun.js`
4. Configure and send emails

---

## Gmail-Specific Notes

- **App passwords only work with 2FA enabled**
- **Alternative:** Use Gmail API instead of SMTP (more secure)
- **Rate limit:** ~500 emails/day free tier
- **Production:** Use a professional email service

