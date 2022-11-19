const mongoose = require("mongoose");

// connect to the database
mongoose.connect("mongodb://localhost:27017/codeial_development", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection (to check if it is successful)
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// up and running then print the message
db.once("open", function () {
  console.log("Successfully connected to the database");
});

module.exports = db;
