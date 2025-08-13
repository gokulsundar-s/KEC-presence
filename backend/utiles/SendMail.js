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

const sendMail = (to, subject, text) => {
  const mailOptions = {
    from: "gokulsundars.21cse@kongu.edu",
    to: "gokulsundars.21cse@kongu.edu",
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log("Error in sending mail:", error);
    }
  });
};

module.exports = { sendMail };
