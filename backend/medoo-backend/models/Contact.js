const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  otherContactMethod: { type: String },
  questionType: { type: String },
  content: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Contact', contactSchema);
