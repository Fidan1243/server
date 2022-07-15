import express from 'express';
import {signin,signup,RefreshToken} from'../controllers/user.controller.js'
const router = express.Router();
//http://localhost:5000/posts
router.post('/signin',signin);
router.post('/signup',signup);
router.post('/token',RefreshToken);

export default router;