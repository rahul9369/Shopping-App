const express = require("express");
const app = express();
const path = require("path");
//const seedDB = require("./Seed");
const productRoutes = require("./router/product");
const authRoutes = require("./router/auth");
const cartRouter = require("./router/cart");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localstategy = require("passport-local");
const User = require("./models/user");

require("dotenv").config();

const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("OH No Error");
    console.log(err);
  });

//seedDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "weneedssomebettersecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("products/Landing");
});

app.use(productRoutes);
app.use(authRoutes);
app.use(cartRouter);

app.listen(3000, () => {
  console.log("server running at port 3000");
});
