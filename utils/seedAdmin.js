import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '03001234567';

const createAdminUser = async () => {
  try {
 
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');


    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      console.log('');
      console.log('💡 Tip: To create a new admin, delete the existing one first');
      console.log('   or change ADMIN_EMAIL in .env file');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      password: ADMIN_PASSWORD,
      role: 'admin'
    });

    console.log('');
    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    console.log('👤 Name:', adminUser.name);
    console.log('📱 Phone:', adminUser.phone);
    console.log('🔐 Role:', adminUser.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('⚠️  IMPORTANT: Please change the default password after first login!');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};


if (process.env.NODE_ENV === 'production') {
  console.log('⚠️  Warning: Running seed script in PRODUCTION mode!');
  console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...');
  setTimeout(createAdminUser, 5000);
} else {
  createAdminUser();
}