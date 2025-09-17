const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    clearProducts();
  })
  .catch(err => console.error('MongoDB connection error:', err));

async function clearProducts() {
  try {
    // Clear all products
    const result = await mongoose.connection.db.collection('products').deleteMany({});
    console.log(`Deleted ${result.deletedCount} products`);
    
    // Clear all feature images
    const featureResult = await mongoose.connection.db.collection('features').deleteMany({});
    console.log(`Deleted ${featureResult.deletedCount} feature images`);
    
    console.log('Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}