const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 8000;

app.use(expressLayouts);

// use express router
// For any route '/' or '/...'
// using middleware to access this route before the server starts - ?
app.use("/", require("./routes")); // or require('/routes/index)

// setup view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
