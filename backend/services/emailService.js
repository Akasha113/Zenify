const nodemailer = require('nodemailer');

// Create transporter based on environment
const getTransporter = () => {
  if (process.env.SENDGRID_API_KEY) {
    // Using SendGrid
    const sgTransport = require('nodemailer-sendgrid-transport');
    return nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_API_KEY
        }
      })
    );
  } else {
    // Using Gmail
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }
};

const transporter = getTransporter();

const emailTemplates = {
  loginConfirmation: (name, email) => ({
    subject: '✅ Welcome to MindFul Journal - Login Confirmed',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6E2B8A 0%, #8B3AA3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f8f9fa; padding: 30px; border: 1px solid #e0e0e0; }
            .section { margin-bottom: 20px; }
            .section h2 { color: #6E2B8A; font-size: 18px; margin-top: 0; }
            .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #6E2B8A; margin: 15px 0; border-radius: 4px; }
            .button { display: inline-block; background: #6E2B8A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧠 MindFul Journal</h1>
              <p>Welcome to Your Mental Wellness Journey</p>
            </div>
            <div class="content">
              <div class="section">
                <h2>Hello ${name},</h2>
                <p>We're delighted to confirm that you've successfully logged into <strong>MindFul Journal</strong>!</p>
              </div>
              <div class="highlight">
                <strong>Login Confirmation Details:</strong><br/>
                📧 Email: ${email}<br/>
                ⏰ Login Time: ${new Date().toLocaleString()}<br/>
                ✅ Status: Successfully Logged In
              </div>
              <div class="section">
                <h2>What You Can Do Now:</h2>
                <p>
                  ✓ Chat with our AI-powered mental health companion<br/>
                  ✓ Track your daily mood and emotional well-being<br/>
                  ✓ Write and reflect in your private journal<br/>
                  ✓ Get personalized mental health insights<br/>
                  ✓ Access crisis support resources
                </p>
              </div>
              <div class="section">
                <h2>🚨 Crisis Support Available 24/7</h2>
                <p><strong>National Suicide Prevention Lifeline:</strong> Call or Text 988</p>
                <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
              </div>
              <div class="section" style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Visit MindFul Journal</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2026 MindFul Journal. All rights reserved.</p>
              <p>Your privacy is important to us. We never share your information.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  welcomeEmail: (name) => ({
    subject: '🎉 Welcome to MindFul Journal!',
    html: `
      <h2>Welcome to MindFul Journal, ${name}!</h2>
      <p>We're excited to have you as part of our mental wellness community.</p>
      <p><strong>Getting Started:</strong></p>
      <ul>
        <li>Complete your profile</li>
        <li>Set your mood tracking preferences</li>
        <li>Start chatting with our AI companion</li>
        <li>Begin journaling your thoughts</li>
      </ul>
      <p>If you have any questions, contact us at ${process.env.ADMIN_EMAIL}</p>
    `
  }),

  passwordReset: (resetLink) => ({
    subject: '🔐 Reset Your MindFul Journal Password',
    html: `
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password. Click the link below to proceed:</p>
      <a href="${resetLink}" style="display: inline-block; background: #6E2B8A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  }),

  crisisAlert: (userName, contentPreview) => ({
    subject: '⚠️ URGENT: User Crisis Alert - MindFul Journal Admin',
    html: `
      <h2>CRITICAL USER ALERT</h2>
      <p><strong>User:</strong> ${userName}</p>
      <p><strong>Alert Type:</strong> Potential Crisis Detected</p>
      <p><strong>Content Preview:</strong> "${contentPreview.substring(0, 100)}..."</p>
      <p style="color: #d32f2f; font-weight: bold;">This requires immediate professional attention.</p>
      <p>Please log in to the admin dashboard to review and take action.</p>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data = {}) => {
  try {
    const emailConfig = emailTemplates[template](data.name || '', data.email || '');
    
    const mailOptions = {
      from: process.env.GMAIL_USER || process.env.SENDGRID_USER || 'noreply@mindfulfjournal.com',
      to: to,
      subject: emailConfig.subject,
      html: emailConfig.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  emailTemplates
};
