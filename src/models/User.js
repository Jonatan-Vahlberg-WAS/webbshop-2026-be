import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    // Regex: Minst 8 tecken, en stor, en liten, en siffra, ett specialtecken
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
    'Lösenordet är för svagt. Kräver 8 tecken, stor/liten bokstav, siffra och symbol.']
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timpstamps: true
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //TODO: Add salt and hash password
  next();
});

const User = mongoose.model('User', userSchema);

export default User;