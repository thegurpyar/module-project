// import nodemailer from "nodemailer";

// /**
//  * Send an email using nodemailer
//  * @param {Object} params - Email parameters
//  * @param {string} params.to - Recipient email
//  * @param {string} params.subject - Email subject
//  * @param {string} params.html - HTML body
//  * @returns {Promise<object>}
//  */
// const sendMail = async ({ to, subject, html }) => {
//   // Load fresh env values
//   const {
//     MAIL_HOST,
//     MAIL_PORT,
//     MAIL_USER,
//     MAIL_PASS,
//     MAIL_FROM_NAME,
//     MAIL_FROM_EMAIL,
//   } = process.env;

//   // console.log("📧 Mail config:", {
//   //   host: MAIL_HOST,
//   //   port: MAIL_PORT,
//   //   user: MAIL_USER ? "loaded" : "missing",
//   // });

//   if (!to || !subject || !html) {
//     throw new Error("Missing required email parameters");
//   }

//   // Fail fast if envs are missing
//   if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS) {
//     throw new Error("Mail configuration missing from environment variables");
//   }

//   // Create transporter
//   const transporter = nodemailer.createTransport({
//     host: MAIL_HOST,
//     port: Number(MAIL_PORT) || 2525,
//     auth: {
//       user: MAIL_USER,
//       pass: MAIL_PASS,
//     },
//   });

//   // Send email
//   const info = await transporter.sendMail({
//     from: `"${MAIL_FROM_NAME}" <${MAIL_FROM_EMAIL}>`,
//     to,
//     subject,
//     html,
//   });

  
//   return info;
// };

// export default sendMail;