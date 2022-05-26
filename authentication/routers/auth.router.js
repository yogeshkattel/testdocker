import express from 'express';
import { signup, login, profile, activateAccount, resentVerificationEmail, resetPassword,resetPasswordConfirmation } from '../controllers/auth.controller.js';
import { AuthenticateToken, IsAdmin, IsActiveWithEmail, IsBlockedWithEmail } from '../middlewares/auth.middleware.js'
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', AuthenticateToken ,profile);
router.get('/user/:token/activate',activateAccount);
router.post('/resend/verification/email',resentVerificationEmail);
router.post('/password/reset',[IsBlockedWithEmail, IsBlockedWithEmail],resetPassword);
router.post('/password/:token/reset/',resetPasswordConfirmation)

export {
  router as authRouter
}