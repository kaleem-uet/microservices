import express from 'express';
import { changePassword, loginCaptain, logoutCaptain, registerCaptain } from '../controlers/captain.controlers.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/register',registerCaptain)
router.post('/login', loginCaptain);
router.post("/change-password", authMiddleware, changePassword);
router.get('/logout', logoutCaptain)



export default router;