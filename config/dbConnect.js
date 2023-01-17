const mongoose = require("mongoose");
const { logEvents } = require("../middleware/logger");

// connect to mongoDB
mongoose.set("strictQuery", true);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error:${error.message}`);
    logEvents(
      `${err.no}:${err.code}\t${err.syscall}\t${err.hostname}`,
      "mongoErrLog.log"
    );
    process.exit(1);
  }
};

module.exports = connectDB;
