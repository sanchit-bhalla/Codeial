const mongoose = require("mongoose"); // new instance is not created. Same instance will be used which was used to setup connection with db in config folder - ?

const multer = require("multer");
const path = require("path");
const AVATAR_PATH = path.join("/uploads/users/avatars");

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
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true, // It will add 2 more fields 'createdAt' and 'updatedAt' in the schema
  }
);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", AVATAR_PATH));
    // __dirname => ...\codeial\models
    // path.join(__dirname, "..", AVATAR_PATH) => ...\codeial\uploads\users\avatars
  },
  filename: function (req, file, cb) {
    // adding uniqueSuffix so that each stored file will be of different name like 'avatar-1670300809642-215498859'
    // file.fieldname => avatar
    // Date.now() => returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// static methods
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single(
  "avatar"
); // .single("avater") means that only 1 file can be uploaded at a time
userSchema.statics.avatarPath = AVATAR_PATH;

// Convert Schema into Model
const User = mongoose.model("User", userSchema);

module.exports = User;
