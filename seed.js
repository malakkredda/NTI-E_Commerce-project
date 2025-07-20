const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Models
const User = require('./models/User');
const Product = require('./models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('password', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });
    await admin.save();

    // Create regular user
    const userPassword = await bcrypt.hash('password', 10);
    const user = new User({
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'user'
    });
    await user.save();

    // Sample products
    const products = [
      // Makeup products
      {
        name: 'Luxury Foundation',
        description: 'Full coverage foundation with SPF 30 protection',
        price: 45.99,
        category: 'makeup',
        quantity: 25,
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Matte Lipstick Set',
        description: 'Collection of 6 long-lasting matte lipsticks',
        price: 32.50,
        category: 'makeup',
        quantity: 15,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Eyeshadow Palette',
        description: '12-color eyeshadow palette with blendable formula',
        price: 28.99,
        category: 'makeup',
        quantity: 20,
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Waterproof Mascara',
        description: 'Long-lasting waterproof mascara for dramatic lashes',
        price: 18.75,
        category: 'makeup',
        quantity: 30,
        image: 'https://images.unsplash.com/photo-1631214540231-9511e748803b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Contour Kit',
        description: 'Professional contour and highlight kit',
        price: 39.99,
        category: 'makeup',
        quantity: 12,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      },
      
      // Accessories
      {
        name: 'Premium Makeup Brushes',
        description: 'Set of 12 professional makeup brushes',
        price: 55.00,
        category: 'accessories',
        quantity: 18,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'LED Vanity Mirror',
        description: 'Hollywood-style LED vanity mirror with dimmer',
        price: 89.99,
        category: 'accessories',
        quantity: 8,
        image: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Makeup Organizer',
        description: 'Clear acrylic makeup organizer with drawers',
        price: 24.99,
        category: 'accessories',
        quantity: 22,
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Beauty Blender Set',
        description: 'Set of 4 makeup sponges for flawless application',
        price: 16.50,
        category: 'accessories',
        quantity: 35,
        image: 'https://images.unsplash.com/photo-1549701328-eba253df4cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Eyelash Curler',
        description: 'Professional eyelash curler with refill pads',
        price: 12.99,
        category: 'accessories',
        quantity: 40,
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      }
    ];

    // Insert products
    await Product.insertMany(products);

    console.log('✅ Database seeded successfully!');
    console.log(`Created ${products.length} products`);
    console.log('Users created:');
    console.log('- Admin: admin@example.com / password');
    console.log('- User: user@example.com / password');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();