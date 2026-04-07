import { Router } from "express"
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getUserBySlug,
  updateUserBySlug,
  deleteUserBySlug,
} from "../db/user.js"

const userRouter = Router()

userRouter.get("/", async (req, res) => {
  const { q } = req.query
  const users = await getUsers(q)
  res.json(users)
})

// userRouter.get("/:id", async (req, res) => {
//   const user = await getUserById(req.params.id)
//   if (!user) return res.status(404).json({ message: "User not found" })
//   res.json(user)
// })

userRouter.get("/:slug", async (req, res) => {
  const user = await getUserBySlug(req.params.slug)

  if(!user){
    return res.status(404).json({
      message: "User not found"
    })
  }

  res.json(user)
})

userRouter.post("/", async (req, res) => {
  const user = await createUser(req.body)
  res.status(201).json(user)
})

userRouter.put("/:slug", async (req, res) => {
  //kommer ha validering för user och admin
  const slug = req.params.slug
  const { name, email, password, location } =
    req.body

  if (
    !name ||
    !email ||
    !location 
  ) {
    return res.status(400).json({
      message:
        "All fields (name, email, location) are required",
    })
  }
  const updatedUser = await updateUserBySlug(slug, {
    name, 
    email, 
    password, 
    location
  })
  if (!updatedUser) {
    return res.status(404).json({
      message: "User",
    })
  }
  return res.status(200).json(updatedUser)
})

// userRouter.put("/:id", async (req, res) => {
//   const user = await updateUser(req.params.id, req.body)
//   if (!user) return res.status(404).json({ message: "User not found" })
//   res.json(user)
// })

// userRouter.patch("/:id", async (req, res) => {
//   const id = req.params.id
//   const updateData = req.body

//   const updatedUser = await updateUser(id, updateData)

//   if (!updatedUser) {
//     return res.status(404).json({
//       message: "User does not exist",
//     })
//   }

//   return res.status(200).json(updatedUser)
// })


//PATCH /plants/:slug
userRouter.patch("/:slug", async (req, res) => {
  //kommer ha validering för user och admin
  const slug = req.params.slug
  const {email, name, location} = req.body
  
  const updatedUser = await updateUserBySlug(slug, {email, name, location})
  
  if (!updatedUser) {
    return res.status(404).json({
      message: "User does not exist",
    })
  }
  
  return res.status(200).json(updatedUser)
})

userRouter.delete("/:slug", async (req, res) => {
  //kommer ha validering för user och admin
  const slug = req.params.slug
  const user = await deleteUserBySlug(slug)
  if (!user) {
    return res.status(400).json({
      message: "user does not exist",
    })
  }
  return res.status(204).json()
})

// userRouter.delete("/:id", async (req, res) => {
//   const user = await deleteUser(req.params.id)
//   if (!user) return res.status(404).json({ message: "User not found" })
//   res.status(204).json()
// })

export default userRouter
