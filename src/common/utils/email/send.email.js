import nodemailer from "nodemailer";
import { APP_EMAIL, APP_PASSWORD, APPLICATION_NAME } from "../../../config.js";
import { BadExeception } from "../../exceptions/error.exceptions.js";
export const UserEmailKey =({email,subject})=>{
  return `User::${email}:: ${subject}::OTP`
}
export const UserEmailTrailsKey =({email,subject})=>{
  return `${UserEmailKey({email,subject})}::Trails`
}


// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // يسمح بتجاوز التحقق من الشهادة المحلية
  }
});
export const sendEmail = async ({
      to, // list of recipients
      cc,
      bcc,
      subject, // subject line
      text, // plain text body
      html, // HTML body
      attachments=[],

}) => {
  try {
    if (!to?.length && !cc?.length && !bcc?.length ) {
        throw BadExeception("Missing email Recipients")
    }
    if (!text?.length && !html?.length && !attachments?.length ) {
        throw BadExeception("Missing email content")
    }
    const info = await transporter.sendMail({
      from: `"${APPLICATION_NAME}" <${APP_EMAIL}>`, // sender address
      to, // list of recipients
      cc,
      bcc,
      subject, // subject line
      text, // plain text body
      html, // HTML body
      attachments,

    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

