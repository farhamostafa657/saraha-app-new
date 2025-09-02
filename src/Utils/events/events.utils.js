import { EventEmitter } from "node:events";
import { sendEmail, subject } from "../email/sendEmail.utils.js";
import { template } from "../email/generateTemplate.utils.js";

export const emailEvent = new EventEmitter();
emailEvent.on("confirmEmail", async (data) => {
  await sendEmail({
    to: data.to,
    subject: subject.confirmEmail,
    text: data.text,
    html: template({
      firstName: data.firstName,
      otp: data.otp,
      subject: subject.confirmEmail,
    }),
  });
});

emailEvent.on("forgetPassword", async (data) => {
  await sendEmail({
    to: data.to,
    subject: subject.resetPassword,
    html: template({
      firstName: data.firstName,
      otp: data.otp,
      subject: subject.resetPassword,
    }),
  });
});
