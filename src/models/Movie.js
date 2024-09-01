import mongoose, { Schema } from "mongoose";

const castSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL
    required: true,
  },
});
const crewSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL
    required: true,
  },
});

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    cast: [castSchema], // Array of cast members
    crew: [crewSchema], // Array of cast members
    trailer: {
      type: String,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    theatres: [
      {
        type: Schema.Types.ObjectId,
        ref: "Theatre",
      },
    ],
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
