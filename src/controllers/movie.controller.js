import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Movie from "../models/Movie.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createMovie = asynchandler(async (req, res) => {
  try {
    const files = req.files;
    const {
      title,
      language,
      genre,
      director,
      description,
      duration,
      startDate,
      endDate,
      cast,
      crew,
    } = req.body;

    // Check for missing fields
    if (
      [
        title,
        language,
        genre,
        director,
        description,
        duration,
        startDate,
        endDate,
      ].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All Fields are Required");
    }

    // Log the received files for debugging
    console.log("Received files:", req.files);

    // Upload Movie Poster
    let movieImage;
    if (
      req.files &&
      req.files["image"] &&
      Array.isArray(req.files["image"]) &&
      req.files["image"].length > 0
    ) {
      movieImage = req.files["image"][0].path;
    } else {
      throw new ApiError(400, "Movie Image is Required");
    }
    const Image = await uploadOnCloudinary(movieImage);
    if (!Image) {
      throw new ApiError(402, "Failed to upload movie image");
    }

    // Upload Trailer Video
    let movieTrailer;
    if (
      req.files &&
      req.files["trailer"] &&
      Array.isArray(req.files["trailer"]) &&
      req.files["trailer"].length > 0
    ) {
      movieTrailer = req.files["trailer"][0].path;
    }
    const TrailerVideo = movieTrailer
      ? await uploadOnCloudinary(movieTrailer)
      : null;

    // Ensure `cast` and `crew` are arrays or parse them if they are strings
    let castArray = Array.isArray(cast) ? cast : JSON.parse(cast || "[]");
    let crewArray = Array.isArray(crew) ? crew : JSON.parse(crew || "[]");

    // Process Cast Images
    const processedCast = await Promise.all(
      castArray.map(async (member, index) => {
        let castImage = null;
        if (req.files && req.files[`cast[${index}][image]`]) {
          castImage = await uploadOnCloudinary(
            req.files[`cast[${index}][image]`][0].path
          );
        }
        return {
          name: member.name,
          role: member.role,
          image: castImage?.url || "",
        };
      })
    );

    // Process Crew Images
    const processedCrew = await Promise.all(
      crewArray.map(async (member, index) => {
        let crewImage = null;
        if (req.files && req.files[`crew[${index}][image]`]) {
          crewImage = await uploadOnCloudinary(
            req.files[`crew[${index}][image]`][0].path
          );
        }
        return {
          name: member.name,
          role: member.role,
          image: crewImage?.url || "",
        };
      })
    );
    // Create and save the movie
    const newMovie = new Movie({
      title,
      image: Image.url,
      language,
      genre,
      director,
      trailer: TrailerVideo?.url || "",
      description,
      duration,
      startDate,
      endDate,
      cast: processedCast,
      crew: processedCrew,
    });

    await newMovie.save();

    return res
      .status(200)
      .json(new ApiResponse(200, newMovie, "Movie created successfully"));
  } catch (error) {
    console.error("Error from createMovie: ", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// update movie data
export const updateMovieById = asynchandler(async (req, res) => {
  const { movieId } = req.params;
  const { title, language, genre, description, duration, endDate } = req.body;

  if (
    [title, language, genre, description, duration, endDate].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(402, "All Fields are Required");
  }
  try {
    // Upload Movie Poster
    let movieImage;
    if (
      req.files &&
      req.files["image"] &&
      Array.isArray(req.files["image"]) &&
      req.files["image"].length > 0
    ) {
      movieImage = req.files["image"][0].path;
    } else {
      throw new ApiError(400, "Movie Image is Required");
    }
    const Image = await uploadOnCloudinary(movieImage);
    if (!Image) {
      throw new ApiError(402, "Failed to upload movie image");
    }

    // Upload Trailer Video
    let movieTrailer;
    if (
      req.files &&
      req.files["trailer"] &&
      Array.isArray(req.files["trailer"]) &&
      req.files["trailer"].length > 0
    ) {
      movieTrailer = req.files["trailer"][0].path;
    }
    const TrailerVideo = movieTrailer
      ? await uploadOnCloudinary(movieTrailer)
      : null;

    console.log("Req Body",req.body)
    console.log("Req Files",req.files)

    const updatemovie = await Movie.findByIdAndUpdate(
      movieId,
      {
        $set: {
          title,
          image: Image?.url,
          language,
          genre,
          trailer:TrailerVideo?.url || "",
          description,
          duration,
          endDate,
        },
      },
      { new: true }
    );

    const updatedMovie = await updatemovie.save();

    return res
      .status(200)
      .json(new ApiResponse(200, updatedMovie, "Movie updated Successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error");
  }
});

// delete MovieById
export const DeleteMoviebyId = asynchandler(async (req, res) => {
  const { movieId } = req.params;
  if (!movieId) {
    throw new ApiError(402, "Movie Id is Required...");
  }
  try {
    const movie = await Movie.findByIdAndDelete(movieId);
    if (!movie) {
      throw new ApiError(401, "Movie Not Found...");
    }
    return res.status(200).json(new ApiResponse(200, {}, "Movie Deleted"));
  } catch (error) {
    console.error("GetMovie By ID: ", error);
    throw new ApiError(500, "Server Error");
  }
});

// get Movie By Id
export const getMovieById = asynchandler(async (req, res) => {
  const { movieId } = req.params;
  if (!movieId) {
    throw new ApiError(401, "Movie Id is Required...");
  }
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new ApiError(402, "Movie not Found...");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, movie, "Movie Fetched Successfully"));
  } catch (error) {
    console.error("Delete Movie By ID: ", error);
    throw new ApiError(500, "Server Error");
  }
});

// GetAll Movies for user
export const getAllMovies = asynchandler(async (req, res) => {
  try {
    const movies = await Movie.find({});
    if (!movies) {
      throw new ApiError(402, "No Movies Found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, movies, "Fetched All Movies..."));
  } catch (error) {
    console.error("Get All Movies: ", error);
    throw new ApiError(500, "Server Error");
  }
});

