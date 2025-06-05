import { Router } from 'express';
import { IndexController } from '../controllers/index';
import { UserController } from '../controllers/user';
import { AuthController } from '../controllers/auth';
import { ExpenseController } from '../controllers/expanse';
import verifyToken from '../middlewares/authMiddleware';
import { GroupController } from '../controllers/group';

const router = Router();
const indexController = new IndexController();
const userController = new UserController();
const authController = new AuthController();
const groupController = new GroupController()
const expenseController = new ExpenseController();
export const setUserRoutes = () => {
    router.get('/', indexController.getIndex);
    router.get('/getUser',verifyToken, userController.getUser);
    router.post('/createUser', userController.createUser);
    
    return router;
};
export const setAuthRoutes = () => {
    router.post('/refresh', authController.refreshToken);
    router.post('/login', authController.login);
    router.post('/logout', authController.logout);
    return router;
};
export const setGroupRoutes = () => {
    router.get('/getGroups', verifyToken, groupController.getGroups);
    router.post('/createGroup', verifyToken, groupController.createGroup);
    router.post('/addUserToGroup', verifyToken, groupController.addUserToGroup);
    router.post('/addExpenseToGroup', verifyToken, groupController.addExpenseToGroup);
    router.get('/getGroupExpenses', verifyToken, groupController.getGroupExpenses);
    router.get('/getGroupUsers', verifyToken, groupController.getGroupUsers);
    return router;
}
export const setExpenseRoutes = () => {
    router.get('/getExpenses', verifyToken, expenseController.getExpenses);
    router.post('/createExpense', verifyToken, expenseController.createExpense);
    router.post('/addUserToExpense', verifyToken, expenseController.addUserToExpense);
    return router;
}