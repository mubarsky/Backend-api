import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"My App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  };
6
  return await transporter.sendMail(mailOptions);
};
