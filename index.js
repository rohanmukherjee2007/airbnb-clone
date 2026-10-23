import express from "express";
import ejsMate from "ejs-mate";
import mongoose from "mongoose";
import methodOverride from "method-override";
import path from "path";
import { fileURLToPath } from "url";
import Listing from "./models/listing.js";
import { NotFoundError, SchemaValidationError } from "./utils/errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
    .connect("mongodb://127.0.0.1:27017/airbnb-clone")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Connection to MongoDB failed");
        console.log(err);
    });

app.use((req, res, next) => {
    req.time = new Date().toISOString();
    console.log(req.method, req.hostname, req.path);
    console.log(req.time);
    next();
});

app.get("/", (req, res) => {
    res.send("Connected");
});

//Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
});

//Create listing Page
app.get("/listings/new", async (req, res) => {
    res.render("listings/createlisting.ejs", { title: "Airbnb: New Listing" });
});

//Show Single Listing Route
app.get("/listings/:id", async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new NotFoundError("Listing not found");
    }
    res.render("listings/showlisting.ejs", {
        listing,
        title: `Airbnb: ${listing.title}`,
    });
});

//Create New Listing
app.post("/listings", async (req, res) => {
    const { title, description, image, price, location, country } = req.body;
    const listingObject = {
        title: title,
        description: description,
        image: {
            filename: "listingimage",
            url: image,
        },
        price: price,
        location: location,
        country: country,
    };
    const required = ["title", "price", "location"];
    const missing = required.filter(key => !req.body[key]?.toString().trim());
    if (missing.length) {
        throw new SchemaValidationError(`${missing[0]} cannot be empty`, 400, missing[0]);
    }
    const newListing = new Listing(listingObject);
    await newListing.save();
    res.redirect("/listings");
});

//Show Edit Page
app.get("/listings/:id/edit", async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new NotFoundError("Listing not found");
    }
    res.render("listings/editlisting.ejs", {
        listing,
        title: `Airbnb: Editing ${listing.title}`,
    });
});

//Perform Edit
app.put("/listings/:id", async (req, res) => {
    const id = req.params.id;
    const { title, description, image, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(id, {
        title,
        description,
        image: {
            filename: "listingimage",
            url: image,
        },
        price,
        location,
        country,
    }, { runValidators: true });
    res.redirect(`/listings/${id}`);
});

//Delete Listing Route
app.delete("/listings/:id", async (req, res) => {
    const id = req.params.id;
    await Listing.findByIdAndDelete(id);
    res.sendStatus(204);
});

//404 middleware to trigger when no route gets a match
app.use((req, res, next) => {
    next(new NotFoundError("Page not found"));
});

//Error handling middleware
app.use((err, req, res, next) => {
    //Malformed ObjectIds in :id throw a CastError, treat them as not found
    if (err.name === "CastError") {
        err = new NotFoundError("Listing not found");
    }
    const { statusCode = 500, message = "Something went wrong", name = "Error" } = err;
    res.status(statusCode);
    if (statusCode === 404) {
        return res.render("./error/404.ejs");
    }
    res.send(`${name}: ${message}`);
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
