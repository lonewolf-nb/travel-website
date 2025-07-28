if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

const express = require('express');
const app = express();
const Listing = require('./models/listing.js');
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


async function main() {
  await mongoose.connect(MONGO_URL);
}

main().then(() => {
  console.log("connected to DB");
})
.catch((err) => {
  console.log(err);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave:false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // time in miliseconds(1 week)
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  },
};

//Home route
// app.get("/",(req,res) => {
//  // res.send("Root here");
//  res.render("HomePage/home.ejs");
// })

//session related
app.use(session(sessionOptions));
app.use(flash());

//authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.currUser =  req.user;
//console.log(res.locals.success);
next();
});



//listing related route(new, show, update, create, delete etc)
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter); //review related routes 
app.use("/",userRouter); //user related routes 

app.get('/map', (req, res) => {
  const travelSpots = [
    { name: "Mehrangarh Fort", lat: 26.2978, lng: 73.0186, description: "Majestic fort with panoramic views" },
    { name: "Umaid Bhawan Palace", lat: 26.2816, lng: 73.0457, description: "Luxury heritage palace and museum" }
    // Pull from MongoDB or other source as needed
  ];

  res.render('listings/maps.ejs', {
    apiKey: process.env.MAP_API_KEY,
    locations: travelSpots
  });
});

//if match with no route
app.all("*catchall", (req,res,next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err,req,res,next) => {
  let {statusCode=500, message="Error occured"} = err;
  //res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{err});
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});