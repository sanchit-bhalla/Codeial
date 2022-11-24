const mongoose = require("mongoose"); // new instance is not created. Same instance will be used which was used to setup connection with db in config folder - ?

// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // It will add 2 more fields 'createdAt' and 'updatedAt' in the schema
  }
);

// Convert Schema into Model
const User = mongoose.model("User", userSchema);

module.exports = User;
