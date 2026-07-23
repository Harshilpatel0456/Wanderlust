const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner, validateListing} = require("../middleware.js");
const { resolveImageValue } = require("../utils/imageHelper.js");

//controller mvc
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



router.route("/")
//Index Route
    .get(wrapAsync(listingController.index))
//Create Route
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));
    // .post((req,res)=>{
    //     res.send(req.file);
    // })

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))//Show Route
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))//Update Route
    .delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));//Delete Route

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;


// index route
// router.get("/", wrapAsync(listingController.index));

//Show Route
// router.get("/:id", wrapAsync(listingController.showListing));
//Create Route
// router.post("/", isLoggedIn,validateListing, wrapAsync(listingController.createListing));


//Update Route
// router.put("/:id", isLoggedIn, isOwner,validateListing, wrapAsync(listingController.updateListing));
//Delete Route
// router.delete("/:id", isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));