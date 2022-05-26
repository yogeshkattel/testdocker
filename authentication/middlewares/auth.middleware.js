import jwt from  'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../db.js';
import { compareSync } from 'bcrypt';
dotenv.config()

const AuthenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    
    const validate_token = jwt.verify(token, process.env.JWT_SECRET_KEY,async (err, user) => {
      if (err) return res.status(400).json({message:"Invalid Token"})
      const query = await pool.query("SELECT * FROM users WHERE id=$1",[user._user_id]);
      if (query.rows[0].is_blocked) return res.status(401).json({message: 'This account has been banned please contact system admin :)'})
      if (!query.rows[0].is_active) return res.status(401).json({message: 'Account not activate'})
      if (query.rowCount ===0) return res.status(404).json({message: "User not found"})
      if (err) return res.status(401).json({message: 'The token is invalid'})
      if (query.rows[0].is_active ) {
        req.user = user
        next()
      } else {
        return res.status(401).json({message: 'Please activate you account'})
      }
      
    });
  } catch (err) {
    // console.log(err)
    return res.status(400).json({message:'Something went  wrong'})
  }
}

const IsAdmin = async (req, res, next) => {
  try {
    const query = await pool.query("SELECT * FROM users WHERE id=$1",[req.user._user_id]);
    if (query.rowCount ===0) return res.status(404).json({message: "User not found"})
    if (query.rows[0].is_admin) {
      next()
    } else {
      return res.status(401).json({message: 'unauthorized'})
    }
    return res.status(500).json({message: 'Internal Server Error'})
 
  }catch(err) {
    console.log(err)
    return res.status(500).json({message:"Internal Server Error"})
  }
}

const IsBlockedWithEmail = async (req, res, next) => {
  try {
    const email= req.body.email.toLowerCase();
    const user = await pool.query("SELECT * from users WHERE email=$1", [email]);
    if (user.rowCount == 0) return res.status(404).json({message: "User with the email does't exists "})
    if (user.rows[0].is_blocked == true) return res.status(401).json({message: 'The user is blocked please contact admin for help '})
    
    req.user = user.rows[0]
    next()
  } catch (err){
    console.log(err)
    return res.status(500).json({message: 'Internal Server Error'})
  }
}

const IsActiveWithEmail = async (req, res, next) => {
  try {
    const email= req.body.email.toLowerCase();
    const user = await pool.query("SELECT * from users WHERE email=$1", [email]);
    if (user.rowCount == 0) return res.status(404).json({message: "User with the email does't exists "})
    if (user.rows[0].is_active == false) return res.status(401).json({message: 'Please activate your account first'})
    
    req.user = user.rows[0]
    next()
  } catch (err){
    console.log(err)
    return res.status(500).json({message: 'Internal Server Error'})
  }
}



export {
  AuthenticateToken,
  IsAdmin,
  IsBlockedWithEmail,
  IsActiveWithEmail
}