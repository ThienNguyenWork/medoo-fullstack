// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const authRoutes = require('./routes/authRoutes');  // Sử dụng authRoutes riêng
const courseRoutes = require('./routes/courseRoutes');
const contactRoutes = require('./routes/contactRoutes');
const progressRoutes = require('./routes/progressRoutes')
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/contacts', contactRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/progress", progressRoutes);

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000
})
  .then(() => {
    console.log('✅ Đã kết nối MongoDB thành công!');
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối MongoDB chi tiết:', err);
    process.exit(1);
  });
