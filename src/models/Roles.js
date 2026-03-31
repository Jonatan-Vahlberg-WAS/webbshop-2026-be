import mongoose from 'mongoose';

const RolesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

const Roles = mongoose.model('Roles', RolesSchema);

export default Roles;
