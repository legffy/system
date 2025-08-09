import { signup,login } from "../controllers/authController";
import express from 'express';
import { authenticate,AuthenticatedRequest } from "../middleware/authMiddleware";
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/api/protected', authenticate, async (req: AuthenticatedRequest, res) => {
    console.log("Protected route accessed by user:", req.user?.id);
    res.status(200).json({user: req.user });
});

export default router;
