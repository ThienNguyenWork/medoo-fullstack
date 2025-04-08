const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Tên người dùng là bắt buộc'],
    unique: true,
    trim: true,
    minlength: [3, 'Tên người dùng phải có ít nhất 3 ký tự'],
    maxlength: [30, 'Tên người dùng không vượt quá 30 ký tự'],
    match: [/^[a-zA-Z0-9_]+$/, 'Tên người dùng chỉ chứa chữ cái, số và dấu gạch dưới']
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Email không hợp lệ'
    }
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [8, 'Mật khẩu phải có ít nhất 8 ký tự'],
    select: false // Không trả về password khi query
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: (v) => /^0x[a-fA-F0-9]{40}$/.test(v),
      message: 'Địa chỉ ví không hợp lệ'
    }
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isTeacher: {
    type: Boolean,
    default: false
  },
  teacherProfile: {
    bio: String,
    qualifications: [String],
    approved: {
      type: Boolean,
      default: false
    }
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // Tự động thêm createdAt, updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
userSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'instructor'
});

// Middleware hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12); // Tăng độ mạnh salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(new Error(`Lỗi hash password: ${error.message}`));
  }
});

// Method compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method generate reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 phút
  
  return resetToken;
};

// Static method
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email }).select('+password');
};

module.exports = mongoose.model('User', userSchema);