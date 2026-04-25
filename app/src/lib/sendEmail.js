import nodemailer from "nodemailer"

export async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  try {
    const info = await transporter.sendMail({
      from: `"UI Theme Lab" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    })

    console.log("EMAIL SENT:", info.response)
  } catch (err) {
    console.log("EMAIL ERROR FULL:", err) 
    throw err
  }
}