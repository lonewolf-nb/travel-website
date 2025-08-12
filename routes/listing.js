const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listing.js');
const {isLoggedIn,isOwner,validateListing } = require("../middleware.js");
const { index, showListing, renderNewForm, createListing, renderEditForm, updateListing, destroyListing, filterByIcon } = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage}) ;

//const upload = multer({ dest: 'uploads/' }) local storage


router.route("/")
.get(wrapAsync(index))
.post(isLoggedIn,upload.single('listing[image]'),  validateListing,wrapAsync(createListing));
// .post(upload.single('listing[image]'),(req,res) => {
//     res.send(req.file);
// })

//search route

//icons route
router.get('/filter/:keyword', filterByIcon);

//New Route
router.get("/new",isLoggedIn, renderNewForm);


router.route("/:id").get(wrapAsync(showListing)).put(isLoggedIn, isOwner , upload.single('listing[image]'),validateListing, wrapAsync(updateListing)).delete(isLoggedIn,isOwner , wrapAsync(destroyListing));




//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner ,wrapAsync(renderEditForm))


module.exports = router;

//Index Route
//router.get("/",wrapAsync(index));

//Show Route
//router.get("/:id",wrapAsync(showListing));

//Create Route
//router.post("/",isLoggedIn, validateListing, wrapAsync(createListing));


//Update Route
//router.put("/:id",isLoggedIn, isOwner , validateListing, wrapAsync(updateListing))

//Delete Route
//router.delete("/:id",isLoggedIn,isOwner , wrapAsync(destroyListing))