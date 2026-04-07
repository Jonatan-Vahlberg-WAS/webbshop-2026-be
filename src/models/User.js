import mongoose from "mongoose";
import bcrypt from "bcrypt";
import slugify from "slugify";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true, 
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
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
  location: {
    type: [Number],
    default: [0, 0],
    required: true
  },
    plants: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Plant",
        default: [],
      },
    ],
    history: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Trade",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    next();
  } catch (err) {
    next(err);
  }
});

userSchema.pre("validate", function(next){
  if(this.isModified("name")){
    this.slug = slugify(this.name, {
      lower: true
    })
  }
  return next()
})

// Använder lowercase: true för email istället
/* userSchema.pre("save", async function (next) {
  if (!this.isModified("email")) {
    return next();
  }

  this.email = this.email.toLowerCase();
}) */

userSchema.methods.isSamePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
