const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,          // ← changed from 587
  secure: true,       // ← changed from false
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,  // ← helps with antivirus/proxy interference
  },
});

const sendPasswordResetEmail = async (toEmail, adminName, resetUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "Reset your admin password — Clothing Store",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #d6336c;">Password Reset Request</h2>
        <p>Hi ${adminName || "Admin"},</p>
        <p>We received a request to reset the password for your Clothing Store admin account.</p>
        <p>Click the button below to set a new password. This link will expire in <strong>1 hour</strong>.</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}"
             style="background: #d6336c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reset Password
          </a>
        </p>
        <p style="font-size: 13px; color: #888;">
          Or copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #d6336c;">${resetUrl}</a>
        </p>
        <p style="font-size: 13px; color: #888;">
          If you didn't request this, you can safely ignore this email. Your password won't change.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa;">Clothing Store · This is an automated message, please do not reply.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };