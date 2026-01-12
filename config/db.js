require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB, {
            dbName: 'test'
        });
        console.log('✅ MongoDB connected (read-only app)');
    } catch (err) {
        console.error('❌ MongoDB error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
