import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  row: [{
    type: String,
    required: true,
  }],
  number: {
    type: Number,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
    index: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  theatreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true,
  },
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true,
  },
});

const Seat = mongoose.model('Seat', seatSchema);

export default Seat;
