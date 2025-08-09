
import { authenticate } from "../middleware/authMiddleware";
import {addHabits, getHabits} from "../controllers/habitsController";
import express from 'express';
const router = express.Router();
router.post('/add', authenticate, addHabits);
router.get('/',authenticate,getHabits);

export default router;