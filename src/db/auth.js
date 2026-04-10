import User from "../models/User.js"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/tokens.js"

function _generateTokens(user){
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  return {accessToken, refreshToken}
}

function _getUserObject(user){
  const userObject = user.toObject()
  delete userObject.password
  return userObject
}

export async function registerUser(name, email, password, location){
  const newUser = new User({name, email, password, location})
  await newUser.save()
  const {accessToken, refreshToken} = _generateTokens(newUser)

  const userObject = _getUserObject(newUser)

  return { user: userObject, accessToken, refreshToken}
}

export async function logInUser(email, password){
    const user = await User.findOne({email: email.toLowerCase()}).select(
      "+password" //gör så att man ska kunna få password
    )
  
    const response = "Invalid credentials"
  
    if(!user){
      throw new Error(response)
    }
  
    const isSamePassword = await user.isSamePassword(password)
  
    if(!isSamePassword){
      throw new Error(response)
    }
  
    const {accessToken, refreshToken} = _generateTokens(user)
    const userObject = _getUserObject(user)

    return {user: userObject, accessToken, refreshToken}
}