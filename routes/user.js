const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const saveRedirectUrl = require("../middleware.js");
const { signup, renderSignupForm, renderLoginForm, login, logout } = require("../controllers/users.js");


router.route("/signup").get(renderSignupForm).post(wrapAsync(signup));
router.route("/login").get(renderLoginForm).post( passport.authenticate("local",{
failureRedirect:"/login",
failureFlash: true,
}),login
); 
//router.get("/signup",renderSignupForm);

//router.post("/signup", wrapAsync(signup));

//router.get("/login",renderLoginForm)

// router.post("/login", passport.authenticate("local",{
// failureRedirect:"/login",
// failureFlash: true,
// }),login
// );

router.get("/logout",logout);

module.exports = router;