const express = require("express");
const router = express.Router();
const cors = require("cors");
require("dotenv").config();
const nodemailer = require("nodemailer");
const path = require("path");
const favicon = require("serve-favicon");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

const contactEmail = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});
app.get("/", function (req, res) {
  res.send("hi from server!");
});
app.post("/contact", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const mail = {
    from: name,
    to: process.env.USER_EMAIL,
    subject: "Contact Form Submission",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR on Server" });
    } else {
      res.json({ status: "Message Sent" });
    }
  });
});

app.listen(process.env.PORT || 5000, () => console.log("Server Running"));
