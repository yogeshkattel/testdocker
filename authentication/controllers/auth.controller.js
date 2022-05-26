import pool from "../db.js";
import bcrypt, { compareSync } from 'bcrypt';
import { access_token } from "../utils/jwtTokenGen.js";
import { AccountActivationEvent, event,PasswordResetEvent } from '../events/email.events.js';
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  try {
    let { firstName, lastName, age, email, password, password2 } = req.body;
    if ( !firstName || !lastName || !age || !email || !password || !password2 ) return res.status(401).json({message: 'Please fill all the forms one or more fields are empty'});
    if (password !== password2) {
      return res.status(401).json({message: 'Both the passwords must be same'})
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password2, salt);
    email = email.toLowerCase()
    const query = await pool.query("INSERT INTO users(firstName, lastName, age, email, password) VALUES($1, $2, $3, $4, $5) RETURNING id, firstName, lastName, age, email", [firstName,lastName, age, email, password]);

    // console.log(query)
    event.emit('sendVerificationEmail',email, query.rows[0].id)
    return res.status(200).json({data: query.rows[0]})
  } catch(err) {
    console.log(err)
    if (err.code ==23505) return res.status(400).json({message: 'User with the email already exists'})
    return res.status(500).json({message: 'Internal Server Error'})
    
  }
  
}

const login = async (req, res) => {
  try{
    console.log(req.body.password)
    const { email, password } = req.body;
    console.log(password)
    if (!email || !password ) return res.status(400).json({message: " email or password field cant be empty"})
    
    const query = await pool.query("SELECT * FROM users WHERE email=$1", [email])
    if (query.rows[0].is_blocked) return res.status(401).json({message: "This Account is blocked"})
    if (query.rowCount === 0) {
      return res.status(404).json({message: "User not found"})
    }
    if (query.rows[0].is_active !==true) return res.status(401).json({message: 'Account is not active please activate first'})
    const verifyPassword = await bcrypt.compare(password, query.rows[0].password)
    
    if (verifyPassword) {
      
      return res.status(200).json({access_token: access_token(query.rows[0]), message:"logged in successfully"})
    } else {
      return res.status(400).json({message: "Username or password incorrect"})
    }
  } catch(err) {
    console.log(err)
    return res.status(500).json({message: 'Internal Server Error'})
  }
}

const profile = async (req, res) => {
  try {
    // console.log(req.user)
    const { _email, _user_id } = req.user;
    const query = await pool.query('SELECT firstName, lastName, age, email, created_at FROM users WHERE id=$1', [_user_id])
    if (query.rowCount === 0) return res.status(401).json({message: 'User not found'})
    return res.status(200).json({data: query.rows[0]})
  }catch(err){
    console.log(err)
    return res.status(500).json({message: 'Internal Server Error'})
  }
}

const activateAccount = async (req, res) => {
  try {
    const { token } = req.params;
    
    const validate_token = jwt.verify(token, process.env.JWT_SECRET_ACTIVATION, async (err, user) => {
      // console.log(err)
      if (err) return res.status(401).json({message: 'The token is invalid or expired'})
      const thisuser = await pool.query("SELECT is_active FROM users WHERE id=$1", [user._user_id])
      if (thisuser.rowCount ==0) return res.status(400).json({message: 'Token expired'})
      if (thisuser.rows[0].is_active == true) return res.status(400).json({message: "User already active"})
      const query = await pool.query("UPDATE users SET is_active=true WHERE id=$1 ", [user._user_id])
      // console.log(query)
      
      return res.status(200).json({message: 'Account activated'})
    })

  } catch(err) {
    // console.log(err)
    return res.status(500).json({message: 'Internal Server Error'})
  }
}

const resentVerificationEmail = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const user = await pool.query("SELECT id, is_active from users WHERE email=$1", [email]);
    console.log(user)
    if (user.rowCount == 0) return res.status(404).json({message: "User with the email does't exists "})
    if (user.rows[0].is_active == true) return res.status(400).json({message: 'Account already activated'})
    event.emit('sendVerificationEmail', email, user.rows[0].id)
    return res.status(200).json({message: "Activation  email has been sent to the email"})

  }catch(err){
    console.log(err)
    return res.status(500).json({message: 'Internal Server Error'})
  }
}

const resetPassword = async (req, res) => {
  try {
    event.emit('sendResetPasswordEmail', req.user)
    return res.status(200).json({message: "Password Reset  email has been sent to the email"})
  }catch(err){
    console.log(err)
    return res.status(500).json({message: 'Internal Server Error'})
  }
}

const resetPasswordConfirmation = async (req, res) => {
  try {
    const resetToken = req.params.token;
    let { password, password2 } = req.body;
    if (!password || !password2) return res.status(400).json({message: 'password and  confirmation password cant be empty'});
    if (password !== password2) return res.status(400).json({message: 'Both the passwords must be same'})
    const verifyToken = jwt.verify(resetToken, process.env.RESET_PASSWORD_SECRET, async (err, user) => {
      if (user._is_active && !user._is_blocked) return res.status(400).json({message: 'This user is either banned or not active'})
      if (err) return res.status(400).json({message: "Invalid Token"})
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password2, salt);

      const query = await pool.query("UPDATE users SET password=$1 WHERE id=$2", [password, user._user_id])
      return res.status(200).json({message: 'Your password has been successfully changed'})

    });

  } catch(err) {
    console.log(err)
    return res.status(500).status("Internal Server Error")
  }
}

export {
  signup,
  login,
  profile,
  activateAccount,
  resentVerificationEmail,
  resetPassword,
  resetPasswordConfirmation
}