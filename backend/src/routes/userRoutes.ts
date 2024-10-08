import { Router } from 'express';
import { registerUserHandler, loginUserHandler, getAllUsersHandler } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authenticate';

const router = Router();

router.post('/register', registerUserHandler);
router.post('/login',loginUserHandler);
router.get('/', getAllUsersHandler);

export default router;
