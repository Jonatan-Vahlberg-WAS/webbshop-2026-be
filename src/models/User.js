import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    select: false, // Don't return password by default
  },
  role : {
    type: String,
    enum: ["admin", "user"],
    required: true,
    default: "user",
  },
  history: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Trade"
}],

}, { timestamps: true });

// Hasha lösenord innan sparande i databasen
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next()

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})

// Gör email case-insensitive för att undvika dubbletter som "example@EMAIL.COM"
userSchema.pre("save", async function(next) {
    if(!this.isModified("email")) return next()
    this.email = this.email.toLowerCase()
    next()
})

// Metod för att jämföra lösenord vid inloggning
userSchema.methods.isSamePassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema);

export default User;