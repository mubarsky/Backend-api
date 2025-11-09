import { Resend } from "resend";

let resend;

function getResendClient() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY env variable");
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export const sendMail = async ({ to, subject, text, html }) => {
  const resendClient = getResendClient();

  const from =
    process.env.EMAIL_FROM || "HealthPro Hospital <onboarding@mubarsky.com>";

  const response = await resendClient.emails.send({
    from,
    to,
    subject,
    text,
    html,
  });

  console.log("📧 Email sent response:", response);

  return response;
};
