import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false,
  },
  resetPasswordCode: {
    type: String,
    required: false,
    default: null,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
    default: "user",
  },
  address: {
    type: String,
    trim: true,
  },
  plants: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Plant",
      required: false,
    },
  ],
  history: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Trade",
      required: false,
    },
  ],
}, {
  timestamps: true
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //TODO: Add salt and hash password
  next();
});

const User = mongoose.model("User", userSchema);

export default User;