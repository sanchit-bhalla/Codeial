const express = require("express");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 8000;

// Connect with database
require("./config/mongoose");

// reads only form data not the params
app.use(express.urlencoded({ extended: true }));

// When the request is coming in, the cookies needs to be parsed
app.use(cookieParser());

// Set Path of static files folder(asset)
app.use(express.static("assets")); // now use relative path for static file(/css/layout.css, ...). eg in layout.ejs

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

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
