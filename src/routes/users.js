import { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "../db/user.js";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await getUsers(req.query.q);
  res.json(users);
});

userRouter.get("/:id", async (req, res) => {
  const user = await getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

userRouter.put("/:id", async (req, res) => {
  const user = await updateUser(req.params.id, req.body);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

userRouter.delete("/:id", async (req, res) => {
  const user = await deleteUser(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(204).json();
});

export default userRouter;