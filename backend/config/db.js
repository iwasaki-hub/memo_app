const mongoose = require("mongoose");

async function connectToMongo() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set.");
  }

  return mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
}

module.exports = { connectToMongo, mongoose };
