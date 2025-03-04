const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const uri = process.env.MONGODB_URI;
// Create a new MongoClient instance and connect to the MongoDB server.
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        // You can add your database operations here
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await client.close();
    }
}

connectToDatabase();