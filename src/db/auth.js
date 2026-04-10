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