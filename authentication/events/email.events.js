import { sendActivationEmail,sendPasswordResetEmail } from '../utils/email.utils.js'
import EventEmitter from "events";

const event = new EventEmitter()

const AccountActivationEvent = event.on('sendVerificationEmail', (email, id) => {
  console.log(email)
  sendActivationEmail(email, id);
})

const PasswordResetEvent = event.on('sendResetPasswordEmail', (user) => {
  // console.log(email)
  sendPasswordResetEmail(user)
})

export {
  AccountActivationEvent,
  event,
  PasswordResetEvent
}