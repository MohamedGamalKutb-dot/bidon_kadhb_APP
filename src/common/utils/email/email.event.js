import { EventEmitter } from "node:events";
import { sendEmail } from "./send.email.js";
import { verifyEmailTemplate } from "./email.templat.js";
export const emailEvent = new EventEmitter();
emailEvent.on("sendEmail", async ({ recipients, subject, data }) => {
  try {
    await sendEmail({
      ...recipients,
      subject,
      html: verifyEmailTemplate({code:data.code, subject ,title: data.title ?? subject }),
    });
  } catch (error) {
    console.log(error);
    
  }
});
