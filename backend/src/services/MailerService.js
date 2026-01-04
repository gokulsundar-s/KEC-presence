const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASSWORD,
  },
});

const mailerService = (to, subject, text) => {
  console.log(
    `[INFO] - [${new Date().toISOString()}] - New email initiated to ${to}.`
  );
  const mailOptions = {
    from: process.env.MAIL,
    to: "gokulsundars.21cse@kongu.edu",
    subject: subject,
    text: text,
  };

  // transporter.sendMail(mailOptions, (error) => {
  //   if (error) {
  //     console.log(
  //       `[ERROR] - [${new Date().toISOString()}] - Error in sending mail:`,
  //       error
  //     );
  //   } else {
  //     console.log(
  //       `[INFO] - [${new Date().toISOString()}] - Email sent successfully to ${to}.`
  //     );
  //   }
  // });
};

module.exports = { mailerService };
