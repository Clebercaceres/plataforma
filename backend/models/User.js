const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  facebookId: {
    type: String,
    required: true
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Log de actividad
userSchema.pre('save', function(next) {
  if (this.isModified('loginAttempts')) {
    console.log(`Usuario ${this.email}: Intento de login #${this.loginAttempts}`);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
