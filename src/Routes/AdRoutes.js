import { Router } from "express";
import verifyJWT from "../middlewares/authMiddleware.js";
import { authorizeSuperAdmin } from "../middlewares/authorizesuperAdmin.js";
import { addAds, DeleteAd, fetchAds } from "../controllers/ad.controller.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = Router()

router.route("/ad/add").post(upload.single("imageUrl"),verifyJWT,authorizeSuperAdmin,addAds)
router.route("/ad/delete/:adId").delete(verifyJWT,authorizeSuperAdmin,DeleteAd)
router.route("/ad/fetch").get(fetchAds)

export default router