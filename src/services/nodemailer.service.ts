import nodemailer from 'nodemailer'

import ENV from '@/env'

const transporter = nodemailer.createTransport({
  host: ENV.NODEMAILER_HOST, // SMTP server
  port: Number(ENV.NODEMAILER_PORT),
  secure: false, // Use TLS for secure connections
  requireTLS: true,
  auth: {
    user: ENV.NODEMAILER_USER_EMAIL, // your email
    pass: ENV.NODEMAILER_USER_PASSWORD, // your email account password
  },
})

const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<void> => {
  try {
    const mailOptions = {
      from: `${ENV.NODEMAILER_USER_NAME} <${ENV.NODEMAILER_USER_EMAIL}>`,
      to,
      subject,
      html,
    }

    const info = await transporter.sendMail(mailOptions)

    // eslint-disable-next-line no-console
    console.log('Email sent:', info.response)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error sending email:', error)
  }
}

const generateVerificationEmail = (verificationLink: string): string => {
  const email = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Your HyperStream Account</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 10px;
        }

        .logo {
          text-align: center;
          padding: 20px 0;
        }

        .logo img {
          max-width: 200px;
        }

        .content {
          text-align: center;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        .content h1 {
          color: #333333;
        }

        .content p {
          color: #555555;
        }

        .button {
          display: inline-block;
          background-color: #007bff;
          color: #ffffff !important;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
        }

        .footer {
          text-align: center;
          padding: 20px 0;
          color: #777777;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <div class="logo">
          <img
            src="https://example.com/hyperstream-logo.png"
            alt="HyperStream Logo"
          />
        </div>
        <div class="content">
          <h1>Verify Your HyperStream Account</h1>
          <p>
            Thank you for signing up for HyperStream! To complete the registration
            process, please click the button below to verify your email address:
          </p>
          <div style="text-align: center">
            <a href="${verificationLink}" class="button">Verify Email</a>
          </div>
          <p>If you did not sign up for HyperStream, please ignore this email.</p>
        </div>
        <div class="footer">&copy; HyperStream</div>
      </div>
    </body>
  </html>
  `

  return email
}

const generateResetPasswordEmail = (resetPasswordLink: string): string => {
  const email = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Your HyperStream Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 10px;
        }

        .logo {
          text-align: center;
          padding: 20px 0;
        }

        .logo img {
          max-width: 200px;
        }

        .content {
          text-align: center;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        .content h1 {
          color: #333333;
        }

        .content p {
          color: #555555;
        }

        .button {
          display: inline-block;
          background-color: #007bff;
          color: #ffffff !important;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
        }

        .footer {
          text-align: center;
          padding: 20px 0;
          color: #777777;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <div class="logo">
          <img
            src="https://example.com/hyperstream-logo.png"
            alt="HyperStream Logo"
          />
        </div>
        <div class="content">
          <h1>Reset Your HyperStream Account Password</h1>
          <p>
            You recently requested to reset your password for your HyperStream account. Click the button below to reset your password:
          </p>
          <div style="text-align: center">
            <a href="${resetPasswordLink}" class="button">Reset Password</a>
          </div>
          <p>If you did not request a password reset, please ignore this email.
          </p>
        </div>
        <div class="footer">&copy; HyperStream</div>
      </div>
    </body>
  </html>
  `

  return email
}

export { generateResetPasswordEmail, generateVerificationEmail, sendEmail }
