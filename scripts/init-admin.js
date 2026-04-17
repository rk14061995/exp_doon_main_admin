const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple Admin schema for initialization
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rahul:rahul@indiacluster.yy7fw2y.mongodb.net/explore_dehradun?retryWrites=true&w=majority';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

console.log('Using MongoDB URI:', MONGODB_URI ? 'Set' : 'Not set');

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function initAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const admin = new Admin({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      isActive: true,
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

initAdmin();
