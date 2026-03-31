import mongoose from 'mongoose';

const RolesUsersSchema = new mongoose.Schema({
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roles',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const RolesUsers = mongoose.model('RolesUsers', RolesUsersSchema);

export default RolesUsers;
