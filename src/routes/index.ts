import { Router } from 'express';
import { IndexController } from '../controllers/index';
import { UserController } from '../controllers/user';
import { AuthController } from '../controllers/auth';
import verifyToken from '../middlewares/authMiddleware';

const router = Router();
const indexController = new IndexController();
const userController = new UserController();
const authController = new AuthController();
export const setUserRoutes = () => {
    router.get('/', indexController.getIndex);
    router.get('/getUser/:id',verifyToken, userController.getUser);
    router.post('/createUser', userController.createUser);
    
    return router;
};
export const setAuthRoutes = () => {
    router.post('/refresh', authController.refreshToken);
    router.post('/login', authController.login);
    return router;
};