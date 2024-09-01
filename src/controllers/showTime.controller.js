import ShowTime from "../models/ShowTime.js";
import Theatre from "../models/Theater.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

// Add a new Showtime
export const addShowtime = asynchandler(async (req, res) => {
  const { ticketPrice, showtime, date ,movieId,theatreId} = req.body;
  console.log("Add Showtime",req.body)
  const theatre = await Theatre.findById(theatreId);

  // Validate input
  if (!ticketPrice || !showtime || !date || !movieId || !theatreId) {
    throw new ApiError(400, "All Fields are Required");
  }

  try {
    if (
      theatre.owner.toString() === req.user._id.toString() ||
      req.user.role === "SuperAdmin"
    ) {
      const newShowtime = new ShowTime({
        ticketPrice,
        showtime,
        date,
        movieId,
        theatreId,
      });

      const savedShowtime = await newShowtime.save();

      return res
        .status(201)
        .json(new ApiResponse(200, savedShowtime, "Added ShowTime"));
    } else {
      throw new ApiError(402, "Access Denied");
    }
  } catch (error) {
    throw new ApiError(500, error.message || "Server Error");
  }
});

// Update an existing Showtime
export const updateShowtime = asynchandler(async (req, res) => {
  const { showtimeId } = req.params;
  const { ticketPrice, showtime, date } = req.body;
  if ([ticketPrice, showtime, date].some((field) => field?.trim() === "")) {
    throw new ApiError(401, "All Fields Are Required");
  }
  try {
    const updatedShowtime = await ShowTime.findByIdAndUpdate(
      showtimeId,
      {
        $set: {
          ticketPrice,
          showtime,
          date,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, updatedShowtime, "Updated ShowTime"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error");
  }
});

// Delete a Showtime
export const deleteShowtime = asynchandler(async (req, res) => {
  const { showtimeId } = req.params;
  if (!showtimeId) {
    throw new ApiError(401, "Id is required");
  }

  try {
    const deletShowTime = await ShowTime.findByIdAndDelete(showtimeId);
    if (!deletShowTime) {
      throw new ApiError(404, "ShowTime Not Found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Showtime deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error");
  }
});

// Get all Showtimes (for customers)
export const getAllShowtimesByTheatreAndMovie = asynchandler(
  async (req, res) => {
    const { theatreId, movieId } = req.params;
    try {
      console.log("try");
      const showtimes = await ShowTime.find({ theatreId, movieId });
      if (!showtimes || showtimes.length === 0) {
        throw new ApiError(404, "No Showtimes found");
      }
      console.log(showtimes);
      return res
        .status(200)
        .json(new ApiResponse(200, showtimes, "Fetched All ShowTimes"));
    } catch (error) {
      throw new ApiError(500, error?.message || "Server Error");
    }
  }
);

export const getAllShowtimesByTheatre = asynchandler(async (req, res) => {
  const { theatreId } = req.params;
  console.log(theatreId,"ByTheater")
  try {
    console.log("try");
    const showtimes = await ShowTime.find({ theatreId });
    if (!showtimes || showtimes.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "No Showtimes found"));
    }
    console.log(showtimes);
    return res
      .status(200)
      .json(new ApiResponse(200, showtimes, "Fetched All ShowTimes"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error");
  }
});

export const getShowtimesById = asynchandler(async (req, res) => {
  const { showtimeId } = req.params;
  try {
    const showtimes = await ShowTime.findById(showtimeId);
    console.log(showtimes);
    return res
      .status(200)
      .json(new ApiResponse(200, showtimes, "Fetched All ShowTimes"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error");
  }
});