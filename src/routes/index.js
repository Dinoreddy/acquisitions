import express from 'express';
const router = express.Router();
import authRoutes from '#routes/auth.routes.js';
import userRoutes from '#routes/user.routes.js';
import { isAuthenticated } from '#middlewares/auth.middleware.js';

router.use('/auth', authRoutes);
router.use('/users', isAuthenticated, userRoutes);


export default router;
