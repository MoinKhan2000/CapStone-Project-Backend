import nodemailer from "nodemailer";

export const sendWelcomeEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.STOREFLEET_SMTP_MAIL,
      pass: process.env.STOREFLEET_SMTP_MAIL_PASSWORD,
    },
  });
  console.log(process.env.STOREFLEET_SMTP_MAIL);
  console.log(process.env.STOREFLEET_SMTP_MAIL_PASSWORD);

  const mailOptions = {
    from: process.env.STOREFLEET_MAIL,
    to: user.email,
    subject: "Welcome to Storefleet!",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* Add your custom CSS styles here */
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
          }
          .logo {
            max-width: 150px;
            display: block;
            margin: 0 auto;
          }
          .content {
            margin-top: 20px;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #20d49a;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          /* Mobile Responsive Styles */
          @media only screen and (max-width: 600px) {
            .container {
              padding: 10px;
            }
            .logo {
              max-width: 100px;
            }
            .button {
              display: block;
              margin-top: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img class="logo" src="https://files.codingninjas.in/logo1-32230.png" alt="Storefleet Logo">
            <h1>Hello, ${user.name}</h1>
          </div>
          <div class="content">
            <p>Thank you for registering with Storefleet. We're excited to have you as a new member of our community.</p>
            <!-- Add more content as needed -->
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending welcome email to ${user.email}:`, error);
    throw error;
  }
};
