const mongoose = require('mongoose');

describe('Database Connection Tests', () => {
  it('should connect to remote MongoDB cluster', async () => {
    expect(mongoose.connection.readyState).toBe(1); // Connected state
  });

  it('should have access to test database', async () => {
    const dbName = mongoose.connection.db.databaseName;
    expect(dbName).toContain('test'); // Should be using test database
    console.log(`Connected to database: ${dbName}`);
  });

  it('should be able to perform basic database operations', async () => {
    const testCollection = mongoose.connection.db.collection('test_collection');
    
    // Insert a test document
    const insertResult = await testCollection.insertOne({ test: true, timestamp: new Date() });
    expect(insertResult.insertedId).toBeDefined();
    
    // Find the document
    const findResult = await testCollection.findOne({ test: true });
    expect(findResult).toBeDefined();
    expect(findResult.test).toBe(true);
    
    // Clean up
    await testCollection.deleteOne({ test: true });
    
    console.log('Basic database operations successful');
  });
});
