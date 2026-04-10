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