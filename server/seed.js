import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Admin from './models/Admin.js';

dotenv.config();

const products = [
  {
    name: 'Chocolate Brownie',
    description: 'Rich dark chocolate brownie with intense cocoa flavor',
    price: 40,
    priceHalfKg: 400,
    image: '/images/chocolate-brownie.png',
    category: 'chocolate',
    available: true,
    featured: true,
  },
  {
    name: 'Double Chocolate Brownie',
    description: 'Loaded with double the chocolate — extra fudgy and irresistibly rich',
    price: 45,
    priceHalfKg: 450,
    image: '/images/double-chocolate-brownie.png',
    category: 'chocolate',
    available: true,
    featured: true,
  },
  {
    name: 'White Chocolate Brownie',
    description: 'Creamy white chocolate brownie with a buttery vanilla base',
    price: 40,
    priceHalfKg: 400,
    image: '/images/white-chocolate-brownie.png',
    category: 'classic',
    available: true,
    featured: true,
  },
  {
    name: 'Brownie Tub',
    description: 'A delightful tub filled with layers of brownie and rich chocolate sauce',
    price: 120,
    image: '/images/brownie-tub.png',
    category: 'chocolate',
    available: true,
    featured: true,
  },
  {
    name: 'White Sauce Pasta',
    description: 'Creamy and cheesy classic white sauce pasta',
    price: 120,
    image: '/images/white-sauce-pasta.png',
    category: 'savory',
    available: true,
    featured: true,
  },
];

const retiredProductNames = [
  'Chocolate Walnut Brownie',
  'Choco Lava Brownie',
  'Nutella Brownie',
  'Oreo Brownie',
  'Walnut Brownie',
];

const adminData = {
  name: 'Aswin Admin',
  email: 'admin@aswinbrownies.com',
  password: 'Aswin@2024',
};

const seed = async () => {
  try {
    const reset = process.argv.includes('--reset');

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    if (reset) {
      console.log('Reset requested. Clearing existing products and admin...');
      await Product.deleteMany({});
      await Admin.deleteMany({});
    }

    console.log('Removing retired products...');
    await Product.deleteMany({ name: { $in: retiredProductNames } });

    console.log('Syncing products...');
    const syncedProducts = await Promise.all(
      products.map((product) =>
        Product.findOneAndUpdate(
          { name: product.name },
          product,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );
    console.log(`${syncedProducts.length} products synced successfully`);

    let admin = await Admin.findOne({ email: adminData.email });
    if (!admin) {
      console.log('Creating admin user...');
      admin = await Admin.create(adminData);
      console.log(`Admin created: ${admin.email}`);
    } else {
      console.log(`Admin already exists: ${admin.email}`);
    }

    console.log('\nSeed completed successfully.');
    console.log('--------------------------------');
    console.log('Admin Credentials (first-time setup only):');
    console.log(`  Email:    ${adminData.email}`);
    console.log('  Password: [set in seed.js adminData — change after first login]');

    console.log('\nProducts available:');
    syncedProducts.forEach((product) => {
      console.log(`  ${product.name} - Rs.${product.price}/pc, Rs.${product.priceHalfKg}/half kg`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
