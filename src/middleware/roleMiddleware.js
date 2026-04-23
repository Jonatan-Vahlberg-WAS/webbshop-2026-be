import RolesUsers from '../models/connecting/rolesUsers.js';

const requiredRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const rolesArray = Array.isArray(requiredRole)
        ? requiredRole
        : [requiredRole];
      const userId = req.user.id;
      const userRoles = await RolesUsers.find({ userId }).populate('roleId');
      const hasRequiredRole = userRoles.some((roleUser) =>
        rolesArray.includes(roleUser.roleId.slug)
      );

      if (!hasRequiredRole) {
        return res.status(403).json({ error: 'Access denied' });
      }
      next();
    } catch (error) {
      console.error('Error in role middleware:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

export default requiredRole;
