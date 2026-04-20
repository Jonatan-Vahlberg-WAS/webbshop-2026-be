import Roles from '../models/Roles.js';
import RolesUser from '../models/connecting/rolesUsers.js';

export async function assignRoleToUser(userId, roleSlug) {
  try {
    const role = await Roles.findOne({ slug: roleSlug });
    if (!role) {
      throw new Error('Role not found');
    }

    const rolesUser = new RolesUser({ userId, roleId: role._id });
    await rolesUser.save();
  } catch (error) {
    console.error('Error assigning role to user:', error);
    throw error;
  }
}

export async function getUserRoles(userId) {
  try {
    const rolesUsers = await RolesUser.find({ userId }).populate('roleId');
    return rolesUsers.map((ru) => ru.roleId.slug);
  } catch (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
}

export async function getAllRoles() {
  try {
    const roles = await Roles.find();
    return roles;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function GetRolesByUser(user) {
  const users = Array.isArray(user) ? user : [user];

  for (const user of users) {
    const rolesUsers = await RolesUser.find({ userId: user._id }).populate(
      'roleId'
    );
    user.roles = rolesUsers.map((ru) => ru.roleId.slug);
  }

  return users;
}
