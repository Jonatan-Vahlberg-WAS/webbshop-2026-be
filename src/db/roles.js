import Roles from '../models/Roles.js';
import RolesUser from '../models/connecting/RolesUsers.js';

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
