import { Router } from "express";
import verifyJWT from "../middlewares/authMiddleware.js";
import { authorizeSuperAdmin } from "../middlewares/authorizesuperAdmin.js";
import { deleteUser, getAllUser, getCurrentUser, updateuser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = Router()

router.route("/user/all").get(verifyJWT,authorizeSuperAdmin,getAllUser)
router.route("/user/current").get(upload.single("avatar"),verifyJWT,getCurrentUser)
router.route("/user/update/:userId").patch(upload.single("avatar"),updateuser)
router.route("/user/delete/:userId").delete(verifyJWT,deleteUser)

export default router