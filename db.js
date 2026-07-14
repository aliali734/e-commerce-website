const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Connects to MongoDB using the connection string in MONGODB_URI.
 * Exits the process if the connection fails.
 * @returns {Promise<typeof mongoose>}
 */
async function connectDatabase() {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 6+ no longer needs useNewUrlParser/useUnifiedTopology,
      // they're defaults now. Kept here as a no-op comment for clarity.
    });

    console.log("MongoDB connected.");
    return mongoose;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

module.exports = { connectDatabase, mongoose };
