const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  mobile: { type: String, trim: true },
  state: { type: String },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  savedColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }],
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }],
  profile: {
    tenth_percentage: Number,
    twelfth_percentage: Number,
    entrance_score: Number,
    exam_type: String,
    budget: Number,
    preferred_course: String,
    preferred_state: String,
    category: { type: String, enum: ['General', 'OBC', 'SC', 'ST', 'EWS'], default: 'General' }
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
