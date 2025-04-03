const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 30000
  })
  .then(() => console.log('Đã kết nối MongoDB thành công!'))
  .catch(err => {
    console.error('Lỗi kết nối MongoDB chi tiết:', err);
    process.exit(1);
  });
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
