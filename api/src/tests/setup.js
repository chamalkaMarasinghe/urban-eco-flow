const mongoose = require('mongoose');
require('dotenv').config();

// Setup test database
beforeAll(async () => {
  // Use the same remote cluster but with a test database name
  const mongoUri = process.env.DB_URI || 'mongodb://localhost:27017/urbanecoflow-test';
  
  // For remote cluster, we'll use a test database suffix
  let testMongoUri = mongoUri;
  if (mongoUri.includes('mongodb.net') || mongoUri.includes('mongodb+srv')) {
    // For MongoDB Atlas or remote clusters, append test database name
    testMongoUri = mongoUri.replace(/\/[^\/]*$/, '/urbanecoflow-test');
  }
  
  await mongoose.connect(testMongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  console.log(`Connected to test database: ${testMongoUri}`);
});

// Cleanup after all tests
afterAll(async () => {
  // Clean up test data before closing connection
  try {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    
    console.log('Test data cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
  
  await mongoose.connection.close();
});

// Clean database between tests
beforeEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      // Only clean collections that exist and are not system collections
      if (collection && !key.startsWith('system.')) {
        await collection.deleteMany({});
      }
    }
  } catch (error) {
    console.error('Error cleaning collections:', error);
  }
});
