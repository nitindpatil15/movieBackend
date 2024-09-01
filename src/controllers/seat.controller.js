import mongoose from "mongoose";
import Seat from "../models/Seat.js";
import Showtime from "../models/ShowTime.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

export const addSeats = asynchandler(async (req, res) => {
  const { rows, numbers } = req.body;
  const { showtimeId } = req.params;

  console.log(
    `Received rows: ${rows}, numbers: ${numbers}, showtimeId: ${showtimeId}`
  );

  // Validate request body
  if (!rows || !numbers || !showtimeId) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const showtime = await Showtime.findById(showtimeId);
    const seatsToAdd = [];

    for (let i = 0; i < rows.length; i++) {
      for (let j = 1; j <= numbers; j++) {
        seatsToAdd.push({
          row: rows[i],
          number: j,
          movieId: showtime.movieId,
          theatreId: showtime.theatreId,
          showtimeId,
        });
      }
    }

    const createdSeats = await Seat.insertMany(seatsToAdd);

    return res
      .status(201)
      .json(new ApiResponse(201, createdSeats, "Seats added successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error");
  }
});

export const getAllSeats = asynchandler(async (req, res) => {
  const { showtimeId } = req.params;
  console.log("Showtime : ", showtimeId._id);

  // Validate showtimeId
  if (!mongoose.Types.ObjectId.isValid(showtimeId)) {
    throw new ApiError(400, "Invalid showtimeId");
  }

  try {
    // Correctly instantiate ObjectId using the `new` keyword
    const seats = await Seat.find({
      showtimeId: new mongoose.Types.ObjectId(showtimeId),
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, seats, "Available seats fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message || "Server Error");
  }
});

export const delteSeats = asynchandler(async (req, res) => {
  const { seatId } = req.params;
  try {
    const seats = await Seat.findByIdAndDelete(seatId);
    return res
      .status(200)
      .json(new ApiResponse(200, seats, "seats Deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Server Error");
  }
});
