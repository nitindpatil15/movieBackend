import mongoose,{Schema} from "mongoose";

const adsSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  targetAudience: {
    type: [String], // Array of strings, e.g., ['male', 'female', 'teens', 'adults']
    required: true,
  },
  impressions: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
  advertiser: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to a User model (assuming advertisers are users)
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Ad = mongoose.model('Ad', adsSchema);

export default Ad
