import {Router} from 'express';
import { AdminLogin, createAdmin, logoutforAll, registerUser, superAdminLogin, userLogin } from '../controllers/auth.controller.js';
import {authorizeSuperAdmin} from '../middlewares/authorizesuperAdmin.js';
import verifyJWT from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerMiddleware.js';

const router = Router();

router.route('/user/register').post(
    upload.single('avatar'),
    registerUser
  );;

// Login User
router.route('/user/login').post(userLogin);
router.route('/user/logout').post(verifyJWT,logoutforAll);

// SuperAdmin creates Admin
router.route('/superadmin/login').post(superAdminLogin);
router.route('/superAdmin/createAdmin/:theatreId').post(upload.single('avatar'),verifyJWT, authorizeSuperAdmin, createAdmin);
router.route('/admin/login').post(AdminLogin);

export default router;
