import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true }, // Added unique and lowercase  password: { type: String, required: true }, // Hashed with bcrypt
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'agent'],
    default: 'agent'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);