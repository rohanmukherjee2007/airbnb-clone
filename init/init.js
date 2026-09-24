import mongoose from "mongoose";
import sampleListings from "./data.js";
import Listing from "../models/listing.js";

mongoose.connect("mongodb://127.0.0.1:27017/airbnb-clone")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Connection to MongoDB failed");
        console.log(err);
    });

async function initDb() {
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    console.log("Data successfully initialized");
}

await initDb();
