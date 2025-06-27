const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://editoruser:editor123@realtime-editor.h3iwpnv.mongodb.net/realtime-editor?retryWrites=true&w=majority&appName=realtime-editor'
    );
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
