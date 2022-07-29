const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Initialization Functions
admin.initializeApp();
// Refer to firebase static database
const database = admin.database();

const sendEmail = async (snapshot, context) => {
  // Get record snapshot data
  const user_email = snapshot.val()["email"];
  const user_message = snapshot.val()["message"];

  // Admin email credentials
  const admin_email = "gecko.web.services@gmail.com";
  const custom_gmail_token = "hxhkiaznrenxiule";

  // Create email data
  const emailData = {
    from: user_email,
    to: admin_email,
    email: user_email,
    subject: `Wiadomość od ${user_email} na [Gecko Web Services - Platform]`,
    html: `<h2>Wiadomość od [${user_email}]</h2><p>${user_message}</p>`,
  };

  // Create transported settings for host mail services
  const mail_transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: admin_email,
      pass: custom_gmail_token,
    },
  });

  // Send email via nodemailer
  const {accepted} = await mail_transporter.sendMail(emailData);

  // Updated record data to save on firebase database messages
  const recordData = {
    user_email,
    user_message,
    sent: !!accepted.length || false,
  };

  // Update record data with sent property whenever email was sent or not
  await database.ref(`/messages/${context.params.documentId}`).set(recordData);
};

// Function to send email to admin whenever user send message via gecko web services page.
exports.emailNotification = functions.database.ref("/messages/{documentId}").onCreate(sendEmail);
