import User from "../models/User.js";
import { getFullTextSearch } from "../utils/fullTextSearch.js";

export async function getUsers(q) {
  let filter = {};
  if (q) {
    filter = {
      ...filter,
      ...getFullTextSearch(q,true, "name"),
    };
  }
  try {
    return await User.find(filter).populate("plants").populate("history");
  } catch (err) {
    console.error("Unable to find based on query in 'Users'", err);
    return [];
  }
}

export async function getUserById(id) {
  try {
    return await User.findById(id).populate("plants").populate("history");
  } catch (err) {
    console.error("Unable to read from 'Users'", err);
    return null;
  }
}

export async function updateUser(id, userData) {
  try {
    return await User.findByIdAndUpdate(id, userData, {
      new: true,           // returnera den uppdaterade användaren
      runValidators: true, // kontrollera att uppdateringen följer schemat
    });
  } catch (error) {
    console.error("Error updating 'User':", error);
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    const userToDelete = await User.findById(id);
    if (!userToDelete) return null;
    await User.deleteOne({ _id: userToDelete._id });
    return true;
  } catch (error) {
    console.error("Unable to delete 'User'", error);
    return false;
  }
}

export async function createUser(userData) {
  const user = new User(userData);
  await user.save();
  return user;
}

export async function findUserByEmail(email) {
  return await User.findOne({ email });
}
