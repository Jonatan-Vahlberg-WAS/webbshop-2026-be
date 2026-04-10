import { Router } from "express";
import {
  validateRegister,
  validateAuthResult,
} from "../middleware/authValidation.js";
import { findUserByEmail } from "../db/users.js";
import { logInUser, refreshAccessToken, registerUser } from "../db/auth.js";
import { verifyRefreshToken } from "../utils/tokens.js";

const authRouter = Router();

// POST /auth/register
authRouter.post("/register",
  validateRegister,
  validateAuthResult,
  async (req, res) => {
    try{
      const {name, email, password, location} = req.body

      //Checking if email is already registerd
      const existingUser = await findUserByEmail(email)
      if(existingUser){
        return res.status(409).json({error: "Email already registerd"})
      }

      //Sending name, email, password and location to registerUser function and getting back user, accessToken and refreshToken
      const { user, accessToken, refreshToken } = await registerUser(name, email, password, location)

      return res.status(201).json({
        user, 
        accessToken,
        refreshToken
      })
    } catch(error){
      console.log("Failed to register user", error) 
      return res.status(400).json("User was not registerd")
    }
  }
);

// TODO POST /auth/login
authRouter.post("/login", async (req, res) => {
  const {email, password} = req.body

  try{
    //Sending email and password to logInUser function and getting back user, accessToken and refreshToken
    const {user, accessToken, refreshToken} = await logInUser(email, password)

    return res.json({
      user,
      accessToken,
      refreshToken
    })
  }catch(error){
    console.log("Error in login", error)
    return res.status(401).json({
      message: "Invalid credentials"
    })
  }
}) 

//TODO POST /auth/refresh
authRouter.post("/refresh", async (req, res) => {
  const {refreshToken} = req.body

  if(!refreshToken)
    return res.status(401).json({
      message: "Refresh token is required"
    })

    try{
      const decodedToken = verifyRefreshToken(refreshToken)
      const userId = decodedToken?.userId

      if(!userId){
        throw new Error()
      }
      const {accessToken} = await refreshAccessToken(refreshToken)
      return res.json({
        accessToken
      })
    }catch(error){
      return res.status(401).json({
        message: "Unauthorized"
      })
    }
})

export default authRouter;
