import express from "express";
import { addSeats, delteSeats, getAllSeats } from "../controllers/seat.controller.js";
import {
  cancelReservationByAdmin,
  getAllReservations,
} from "../controllers/booking.controller.js";
import verifyJWT from "../middlewares/authMiddleware.js";
import {
  authorizeAdmins,
  authorizeSuperAdmin,
} from "../middlewares/authorizesuperAdmin.js";

const router = express.Router();

router
  .route("/showtimes/:showtimeId/seats")
  .post(verifyJWT, authorizeAdmins, addSeats);

router.route("/showtimes/:showtimeId/seats").get(getAllSeats);

router.route("/seat/delted/:seatId").delete(verifyJWT,authorizeAdmins,delteSeats);

router.route("/admin/getallreservations").get(verifyJWT, getAllReservations);

router
  .route("/cancelreservationbyAdmin/:reservationId")
  .delete(verifyJWT, cancelReservationByAdmin);

export default router;
