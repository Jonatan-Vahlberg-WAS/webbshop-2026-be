import { Router } from "express"
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from "../db/user.js"

const userRouter = Router()

/* 
app.get('/posts', async (req, res) => {
  const posts = await Post.find().populate('author');
  res.json(posts);
});
 */

userRouter.get("/", async (req, res) => {
  const { q } = req.query
  const users = await getUsers(q)
  res.json(users)
})

userRouter.get("/:id", async (req, res) => {
  const user = await getUserById(req.params.id)
  if (!user) return res.status(404).json({ message: "User not found" })
  res.json(user)
})

userRouter.post("/", async (req, res) => {
  const user = await createUser(req.body)
  res.status(201).json(user)
})

userRouter.put("/:id", async (req, res) => {
  const user = await updateUser(req.params.id, req.body)
  if (!user) return res.status(404).json({ message: "User not found" })
  res.json(user)
})

userRouter.delete("/:id", async (req, res) => {
  const user = await deleteUser(req.params.id)
  if (!user) return res.status(404).json({ message: "User not found" })
  res.status(204).json()
})

export default userRouter
