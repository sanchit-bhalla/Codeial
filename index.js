const express = require("express");
// const cookieParser = require("cookie-parser"); // no need if we use express-session
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 8000;
// Connect with database
const db = require("./config/mongoose");
// used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
// Right now whenever server restarts, our session cookie gets reset. This is bad bcz whenever we deploy some new code to the production server, all the users gets logged out.
// Solution :  Keep persistent storage which keeps our cookies stored in the server.
// For this we will be using libraray called connect-mongo.
const MongoStore = require("connect-mongo");
const sassMiddleware = require("node-sass-middleware");

// It doesn't compile code when we run server. It gets compiled when the page is loaded. i.e if we open profile page, then user_profile.scss will gets compiled. This thing makes it slow. But on production we need to send compiled files beforehand
app.use(
  sassMiddleware({
    /* Options */
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended", // we want output to be in multiple lines i.e(in readable form)
    prefix: "/css", // It will tell the sass middleware that any request file will always be prefixed with <prefix> and this prefix should be ignored.
    // e.g <link rel="stylesheets" href="prefix/layout.css"/>
  })
);

// reads only form data not the params
app.use(express.urlencoded({ extended: true }));

// When the request is coming in, the cookies needs to be parsed
// app.use(cookieParser()); // no need if we use express-session

// Set Path of static files folder(asset)
app.use(express.static("assets")); // now use relative path for static file(/css/layout.css, ...). eg in layout.ejs

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// setup view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "codeial",
    // TODO: change the secret before deployment in the production
    secret: "blahsomething",
    saveUninitialized: false, // means if session is not established i.e user is not logged in or identity is not established, in that case we don't want to store extra data in the session cookie
    resave: false, // when identity is established and some session data is present, we don't want to rewrite it if it is not changed
    cookie: {
      maxAge: 1000 * 60 * 100, // Time(in milliseconds) after which session expires
    },
    store: MongoStore.create({
      client: db.getClient(),
      autoRemove: "disabled",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// use express router
// For any route '/' or '/...'
// using middleware to access this route before the server starts - ?
app.use("/", require("./routes")); // or require('/routes/index)

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
