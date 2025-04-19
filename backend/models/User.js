const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    timestamp: Date
  },
  timezone: String,
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastLoginDate: Date,
  ip: String
});

// Log de actividad
userSchema.pre('save', function(next) {
  if (this.isModified('loginAttempts')) {
    console.log(`Usuario ${this.email}: Intento de login #${this.loginAttempts}`);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
