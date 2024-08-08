const nodemailer = require("nodemailer");
const dotenv = require('dotenv')
const path = require('path')
dotenv.config()
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.gmail_user,
    pass: process.env.gmail_passwd
  },
});

// async..await is not allowed in global scope, must use a wrapper

async function sendMail(user_email, user_name) {
  const mail_options = {
    from: {
      name: "Odomite Rentals",
      address: process.env.gmail_user
    },
    to: [process.env.gmail_user, user_name],
    subject: "Order Comfirmed ✔",
    text: `Hello ${user_name}: bellow is an attatched invoice for your order`,
    html: `<h1> ${user_name ? user_name : 'hello there'}</h1>`
  }

  // send mail with defined transport object
  try {
    const info = await transporter.sendMail(mail_options);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error)
  }
}

module.exports = sendMail;
