if(process.env.NODE_ENV != "production"){//new environment var right now we are not in production level so we use dotenv,then after when we are in the production phase then we will not use the dotenv pkg
    require('dotenv').config();
}

console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;


main()
    .then(() => {
        console.log("Connected to DB!");
        app.listen(8080, () => {
            console.log("Server is listening");
        });
    }).catch((err) => {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error", (err) =>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



// app.get("/", (req, res) => {
//     res.send("Root is working")
// });


// creating middleware for flash
app.use(session(sessionOptions));
app.use(flash());

//creating for login signup using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// fake for demo purpose
// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

// root route redirects to listings
app.get("/", (req, res) => {
    res.redirect("/listings");
});

//call for the listing.js
app.use("/listings", listingRouter);
//call for review.js
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);



// app.get("/testListing",async (req,res)=>{//creating testlisting route 
//     let sampleListing = new Listing({
//         title:"My new Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successfully testing");
// });

// middleware for handling server side errors
app.all("*splat", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
    console.error(err);
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});
