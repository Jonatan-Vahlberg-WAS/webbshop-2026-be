import mongoose from "mongoose";
import slugify from "slugify";

export const LIGHT_LEVELS = {
  directSun: "directSun",
  bright: "bright",
  partial: "partial",
  low: "low"
}

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  //TODO: Add more fields as needed
  species: {
    type: String,
    required: true,
  },
  lightLevels: {
    type: String,
    required: true,
    enum: [LIGHT_LEVELS.directSun, LIGHT_LEVELS.bright, LIGHT_LEVELS.partial, LIGHT_LEVELS.low]
  },
  ownerId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true 
  },
  coordinates: {
    type: [Number],
    default: [0, 0],
    required: true
  },
  meetingTime: {
    type: String,       //Change to date later
    required: true
  },
  available: {
    type: Boolean,
    default: true,
    required: true
  }
}, 
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

plantSchema.pre("validate", function(next){
  if(this.isModified("name")){
    this.slug = slugify(this.name, {
      lower: true
    })
  }
  return next()
})

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;