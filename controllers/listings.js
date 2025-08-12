const Listing = require('../models/listing.js');
require('dotenv').config();
module.exports.index = async (req,res) => {

//   const allListings = await Listing.find({});
// res.render("listings/index.ejs",{allListings});
 const { search } = req.query;
  let listings;

  if (search) {
    // Case-insensitive search using regex
    listings = await Listing.find({
      title: { $regex: search, $options: 'i' }
    });
  } else {
    listings = await Listing.find({});
  }
    //console.log(req.query.search);

  res.render('listings/index', { allListings:listings,search});
};

module.exports.renderNewForm = (req,res) => {
  console.log(req.user);
  
  res.render("listings/new.ejs");
};

module.exports.filterByIcon = async (req, res) => {
  //console.log("Yeah this route detected");
  const { keyword } = req.params;

  // Convert to lowercase and trim for consistency
  const iconKeyword = keyword.toLowerCase().trim();

  const listings = await Listing.find({
    description: { $regex: iconKeyword, $options: 'i' }
  });

  res.render('listings/index', { allListings:listings,search:iconKeyword });
};


module.exports.showListing = async (req,res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews", populate:{
    path:"author",
  }}).populate("owner");

  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  else{
  res.render("listings/show.ejs",{listing});
  }
};

module.exports.createListing = async (req,res) => {
  // if(!req.body.listing){
  //   throw new ExpressError(400, "Send valid data for listing")
  // }

  
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url,filename};
  await newListing.save();
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
};


module.exports.renderEditForm = async (req,res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  
  let originalImageUrl = listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250"); //cloudinary api changes for image downscaling 
  res.render("listings/edit.ejs",{listing,originalImageUrl});
  
};

module.exports.updateListing = async (req,res) => {
  
  let {id} = req.params;

 
  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});//for updating credentials other than image

  //saving new image to updated form data
  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename};
  }
  
  await listing.save();

    req.flash("success","Listing Updated");

  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res) => {
  
  let {id} = req.params;

 
  await Listing.findByIdAndDelete(id,{...req.body.listing});
  
    req.flash("success","Listing Deleted");

  res.redirect(`/listings`);
};


//same as index logic
module.exports.searchListings = async (req, res) => {
  const { search } = req.query;
  let listings;

  if (search) {
    // Case-insensitive search using regex
    listings = await Listing.find({
      title: { $regex: search, $options: 'i' }
    });
  } else {
    listings = await Listing.find({});
  }

  res.render('listings/index', { listings, search });
};