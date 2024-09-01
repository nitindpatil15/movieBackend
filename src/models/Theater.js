import mongoose, { Schema } from 'mongoose';

const theatreSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  seats: { 
    type: Number, 
    required: true 
  },
  image: { 
    type: String 
  },
  contact:{
    type:String
  },
  location:{
    type:String
  },
  movies: [
    {
      type:Schema.Types.ObjectId,
      ref:"Movie"
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
}, { timestamps: true });

const Theatre = mongoose.model('Theatre', theatreSchema);
export default Theatre;
