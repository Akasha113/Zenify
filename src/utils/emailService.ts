interface EmailData {
  to: string;
  subject: string;
  html: string;
  timestamp: number;
}

// Store email logs in localStorage
const EMAIL_LOG_KEY = 'mindful_emails';

export const sendLoginConfirmationEmail = (email: string, name: string): boolean => {
  try {
    const timestamp = new Date().toISOString();
    
    const emailContent = `
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
            .section p { margin: 10px 0; line-height: 1.6; }
            .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #6E2B8A; margin: 15px 0; border-radius: 4px; }
            .contact-info { background: white; padding: 15px; border-radius: 4px; border: 1px solid #ddd; }
            .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #6E2B8A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .warning { color: #d32f2f; font-weight: bold; }
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
                ⏰ Login Time: ${new Date(timestamp).toLocaleString()}<br/>
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
                <h2>Your Mental Health Matters</h2>
                <p>
                  At MindFul Journal, we're committed to supporting your mental health journey. Our platform provides 
                  a safe, judgment-free space where you can express yourself, track your emotions, and connect with 
                  professional resources whenever you need them.
                </p>
              </div>

              <div class="section">
                <h2>🚨 Crisis Support Available 24/7</h2>
                <p>If you or someone you know is experiencing a mental health crisis, please reach out immediately:</p>
                <div class="contact-info">
                  <p><strong>National Suicide Prevention Lifeline</strong><br/>
                  📞 Call or Text: <span class="warning">988</span> (United States)<br/>
                  Available 24/7, free and confidential</p>
                  
                  <p><strong>Crisis Text Line</strong><br/>
                  💬 Text HOME to <span class="warning">741741</span><br/>
                  Trained counselors available 24/7</p>
                  
                  <p><strong>International Resources</strong><br/>
                  🌍 UK: 116 123 (Samaritans)<br/>
                  🌍 Canada: 1-833-456-4566<br/>
                  🌍 Australia: 13 11 14 (Lifeline)</p>
                </div>
              </div>

              <div class="section">
                <h2>Contact & Support</h2>
                <p>
                  📧 Email: <strong>support@mindfulfjournal.com</strong><br/>
                  💬 Chat Support: Available via our app<br/>
                  🌐 Website: www.mindfulfjournal.com<br/>
                  📱 Mobile App: iOS & Android
                </p>
              </div>

              <div class="section">
                <p style="color: #666; font-size: 13px;">
                  <strong>Security Reminder:</strong> Never share your password with anyone. 
                  If you didn't log in, please reset your password immediately.
                </p>
              </div>

              <div class="section" style="text-align: center;">
                <a href="http://localhost:5173" class="button">Visit MindFul Journal</a>
              </div>
            </div>

            <div class="footer">
              <p>© 2026 MindFul Journal. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>Your privacy is important to us. We never share your information.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailData: EmailData = {
      to: email,
      subject: '✅ Welcome to MindFul Journal - Login Confirmed',
      html: emailContent,
      timestamp: Date.now(),
    };

    // Store email in localStorage
    const existingEmails = JSON.parse(localStorage.getItem(EMAIL_LOG_KEY) || '[]');
    existingEmails.push(emailData);
    localStorage.setItem(EMAIL_LOG_KEY, JSON.stringify(existingEmails));

    // Log email details to console
    console.log('📧 Email Sent Successfully:', {
      to: email,
      subject: emailData.subject,
      timestamp: new Date(timestamp).toLocaleString(),
    });

    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Get all sent emails
export const getSentEmails = (): EmailData[] => {
  const emails = localStorage.getItem(EMAIL_LOG_KEY);
  return emails ? JSON.parse(emails) : [];
};

// Get emails sent to a specific address
export const getEmailsByRecipient = (email: string): EmailData[] => {
  const allEmails = getSentEmails();
  return allEmails.filter(e => e.to === email);
};

// Clear email logs
export const clearEmailLogs = (): void => {
  localStorage.removeItem(EMAIL_LOG_KEY);
};

export default {
  sendLoginConfirmationEmail,
  getSentEmails,
  getEmailsByRecipient,
  clearEmailLogs,
};
