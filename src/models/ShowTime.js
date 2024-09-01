import mongoose,{Schema} from "mongoose";

const showtimeSchema = new Schema(
  {
    ticketPrice: {
      type: String,
      required: true,
    },
    showtime: {
      type: String,
      required: true,
    },
    date:[{
      type:String,
      required:true
    }],
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    theatreId: {
      type: Schema.Types.ObjectId,
      ref: "Theatre",
      required: true,
    },
  },
  { timestamps: true }
);

const Showtime = mongoose.model("Showtime", showtimeSchema);
export default Showtime;
