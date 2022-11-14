const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/codeial_development");
  console.log("Connection made with codeial_development");

  // use `await mongoose.connect('mongodb://user:password@localhost:27017/codeial_development');` if your database has auth enabled
}
