import nodemailer from 'nodemailer';
import { activation_token, reset_password_token } from './jwtTokenGen.js';
import dotenv from 'dotenv';
dotenv.config()

// configure email transporter
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_HOST_NAME,
    pass: process.env.EMAIL_HOST_PASSWORD,
  }
})



const sendActivationEmail = async (email, id) => {
  try {
    const token = activation_token(email, id)
    const mailOptions ={
      from: process.env.EMAIL_HOST_NAME,
      to: email,
      subject: 'Account activation',
      html: `${token}`
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err)
      else console.log(info)
    })
  } catch(err) {
    console.log(err)
  }

}

const sendPasswordResetEmail = async (user) => {
  try {
    const token = reset_password_token(user);
    console.log(user)
    const mailOptions ={
      from: process.env.EMAIL_HOST_NAME,
      to: user.email,
      subject: 'password reset email',
      html: `${token}`
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err)
      else console.log(info)
    })
  } catch(err) {
    console.log(err)
  }
}
export {
  sendActivationEmail,
  sendPasswordResetEmail
}