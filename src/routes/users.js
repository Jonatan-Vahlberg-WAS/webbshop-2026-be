import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from "../db/users.js";

const userRouter = Router();

// GET /users
userRouter.get("/", async (req, res) => {
  // TODO Validation for Admin

  const { q } = req.query;

  const users = await getUsers(q);

  res.json(users);
});

// GET /users/:id
userRouter.get("/:id", async (req, res) => {
  // TODO Validation for User and Admin

  const user = await getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// DELETE /users/:id
userRouter.delete("/:id", async (req, res) => {
  // TODO Validation for Admin

  const user = await deleteUser(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(204).json();
});

// POST /users
userRouter.post("/", async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
});

// TODO PATCH /users/:id
// TODO Validation for User

// PUT /users/:id
userRouter.put("/:id", async (req, res) => {
  // TODO Validation for User
  
  const user = await updateUser(req.params.id, req.body);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

export default userRouter;
