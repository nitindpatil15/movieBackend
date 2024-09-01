import { Router } from "express";
import verifyJWT from "../middlewares/authMiddleware.js";
import {
  addShowtime,
  deleteShowtime,
  getAllShowtimesByTheatre,
  getAllShowtimesByTheatreAndMovie,
  getShowtimesById,
  updateShowtime,
} from "../controllers/showTime.controller.js";
import { authorizeAdmins } from "../middlewares/authorizesuperAdmin.js";

const router = Router();

router.route("/add/theatre").post(verifyJWT, authorizeAdmins,addShowtime);
router.route("/:showtimeId").get(verifyJWT,getShowtimesById);

router
  .route("/update/:showtimeId")
  .patch(verifyJWT, authorizeAdmins, updateShowtime);
router
  .route("/delete/:showtimeId")
  .delete(verifyJWT, authorizeAdmins, deleteShowtime);

router.route("/showtime/:movieId/:theatreId").get(getAllShowtimesByTheatreAndMovie);
router.route("/showtime/:theatreId").get(getAllShowtimesByTheatre);

export default router;
