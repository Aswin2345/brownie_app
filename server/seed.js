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
    priceHalfKg: 450,
    image: '/images/chocolate-brownie.png',
    category: 'brownie',
    available: true,
    featured: true,
  },
  {
    name: 'White Chocolate Brownie',
    description: 'Creamy white chocolate brownie with a buttery vanilla base',
    price: 40,
    priceHalfKg: 450,
    image: '/images/white-chocolate-brownie.png',
    category: 'brownie',
    available: true,
    featured: true,
  },
  {
    name: 'Nutella Brownie',
    description: 'Gooey Nutella-swirled brownie with hazelnut richness',
    price: 40,
    priceHalfKg: 450,
    image: '/images/nutella-brownie.png',
    category: 'brownie',
    available: true,
    featured: true,
  },
  {
    name: 'Oreo Brownie',
    description: 'Crushed Oreo brownie with cookies and cream layers',
    price: 40,
    priceHalfKg: 450,
    image: '/images/oreo-brownie.png',
    category: 'brownie',
    available: true,
    featured: false,
  },
  {
    name: 'Choco Lava Brownie',
    description: 'Molten center brownie with flowing chocolate lava',
    price: 50,
    priceHalfKg: 499,
    image: '/images/choco-lava-brownie.png',
    category: 'brownie',
    available: true,
    featured: true,
  },
  {
    name: 'Walnut Brownie',
    description: 'Classic brownie loaded with crunchy walnuts',
    price: 50,
    priceHalfKg: 499,
    image: '/images/walnut-brownie.png',
    category: 'brownie',
    available: true,
    featured: false,
  },
];

const adminData = {
  name: 'Sharp SK Admin',
  email: 'admin@sharpsk.com',
  password: 'SharpSK@2024',
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

    const productCount = await Product.countDocuments();
    let createdProducts = [];

    if (productCount === 0) {
      console.log('Seeding products...');
      createdProducts = await Product.insertMany(products);
      console.log(`${createdProducts.length} products seeded successfully`);
    } else {
      console.log(`Products already exist (${productCount}). Skipping product seed.`);
    }

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
    console.log('Admin Credentials:');
    console.log(`  Email:    ${adminData.email}`);
    console.log(`  Password: ${adminData.password}`);
    console.log('--------------------------------');

    if (createdProducts.length) {
      console.log('\nProducts seeded:');
      createdProducts.forEach((product) => {
        console.log(`  ${product.name} - Rs.${product.price}/pc, Rs.${product.priceHalfKg}/half kg`);
      });
    }

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
