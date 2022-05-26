import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
const access_token = (user) => {
  return jwt.sign({'_user_id':user.id, '_email': user.email, '_is_admin': user.is_admin, '_is_active':user.is_active}, process.env.JWT_SECRET_KEY, {expiresIn: '43200s'})
}

const activation_token = (email, id) => {
  return jwt.sign({'_email': email, '_user_id':id}, process.env.JWT_SECRET_ACTIVATION, {expiresIn: '1800s'})
}

const reset_password_token = (user) => {
  return jwt.sign({'_email': user.email, '_user_id':user.id, '_is_active':user.is_active,'_is_blocked':user.is_blocked }, process.env.RESET_PASSWORD_SECRET, {expiresIn: '1800s'})
}
export {
  access_token,
  activation_token,
  reset_password_token
}
