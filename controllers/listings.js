const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const { resolveImageValue } = require("../utils/imageHelper.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    const listingsWithImage = allListings.map(listing => {
        const plainListing = listing.toObject();
        return {
            ...plainListing,
            image: resolveImageValue(plainListing)
        };
    });
    res.render("listings/index.ejs", { allListings: listingsWithImage });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);

    const listingWithImage = {
        ...listing.toObject(),
        image: resolveImageValue(listing.toObject()),
        imageUrl: resolveImageValue(listing.toObject())
    };
    res.render("listings/show.ejs", { listing: listingWithImage });
};

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient
    .forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
    })
    .send()

    // console.log(response.body.features[0].geometry);
    // res.send("Done!!");


    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"..",filename);

    // if (!req.body || !req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing");
    // }

    // Joi ne individual fields pe validation add kar diya

    // for handling the post errors from the hoppscotch
    // if(!newListing.title){
        //     throw new ExpressError(400, "Title is Missing!");
        // }
        // if(!newListing.description){
            //     throw new ExpressError(400, "Description is Missing!");
            // }
            // if(!newListing.location){
                //     throw new ExpressError(400, "Location is Missing!");
                // }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    //storing this coordinates into database from mapbox in the listings
    newListing.geometry = response.body.features[0].geometry;
    
    let savedListing = await newListing.save();
    console.log(savedListing);
    // for flash msg
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    //edit page preview image
    let OriginalImageUrl = listing.image.url;
    OriginalImageUrl = OriginalImageUrl.replace("/upload","/upload/w_250");

    res.render("listings/edit.ejs", { listing , OriginalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    const updateData = { ...req.body.listing };
    delete updateData.image;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    Object.assign(listing, updateData);
    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
    }
    await listing.save();

    // if(typeof req.file){
    //     let url = req.file.path;
    //     let filename=req.file.filename;
    //     listing.image={url,filename};
    //     await listing.save();
    // }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};