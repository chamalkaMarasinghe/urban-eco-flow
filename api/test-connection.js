const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    
    // Use the same remote cluster but with a test database name
    const mongoUri = process.env.DB_URI || 'mongodb://localhost:27017/urbanecoflow-test';
    
    // For remote cluster, we'll use a test database suffix
    let testMongoUri = mongoUri;
    if (mongoUri.includes('mongodb.net') || mongoUri.includes('mongodb+srv')) {
      // For MongoDB Atlas or remote clusters, append test database name
      testMongoUri = mongoUri.replace(/\/[^\/]*$/, '/urbanecoflow-test');
    }
    
    console.log(`Connecting to: ${testMongoUri.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials
    
    await mongoose.connect(testMongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Port: ${mongoose.connection.port}`);
    
    // Test basic operations
    const testCollection = mongoose.connection.db.collection('connection_test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Basic database operations working!');
    
    // Clean up
    await testCollection.deleteMany({ test: true });
    
    await mongoose.connection.close();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection test failed:');
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();
