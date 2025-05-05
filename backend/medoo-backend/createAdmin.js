// createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const email = 'admin@example.com';
  const username = 'superadmin';
  const plainPassword = 'medooadmin@'; // mật khẩu bạn muốn

  if (await User.findOne({ email })) {
    console.log('⚠️ Admin đã tồn tại, không tạo lại.');
    return mongoose.disconnect();
  }

  const admin = new User({
    username,
    email,
    password: plainPassword,   // <-- truyền thẳng plain-text
    role: 'admin',
    emailVerified: true
  });

  await admin.save();           // <-- pre('save') sẽ hash 1 lần
  console.log('✅ Tạo admin thành công:', { email, username });
  mongoose.disconnect();
}

createAdmin().catch(err => {
  console.error('❌ Lỗi tạo admin:', err);
  mongoose.disconnect();
});
