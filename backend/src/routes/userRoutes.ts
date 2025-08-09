import *  as express from 'express';
import { getUserById, getUsers,insertUser } from '../controllers/userControllers';
import {authenticate, AuthenticatedRequest} from '../middleware/authMiddleware';
const router = express.Router();
router.get('/', authenticate, getUsers);
router.get('/:id',getUserById);
router.post('/', insertUser);
export default router;