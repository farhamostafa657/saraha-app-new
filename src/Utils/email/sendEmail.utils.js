import nodemailer from "nodemailer";

export async function sendEmail({
  to = "",
  cc = "",
  bcc = "",
  subject = "",
  text = "",
  html = "",
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Farha Mostafa" <${process.env.EMAIL}>`,
    to,
    cc,
    bcc,
    subject,
    text,
    html,
  });

  console.log("Email sent:", info.messageId);
  return info;
}

export const subject = {
  welcome: "Welcome From Saraha App",
  confirmEmail: "Confirm Your Email",
  resetPassword: "Reset Your Password",
};
