import express from 'express';
import { login, logout, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateLoginInput } from '../validators/authValidators.js';

const router = express.Router();

router.post('/login', validateLoginInput, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
