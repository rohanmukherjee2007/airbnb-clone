import express from 'express';
import mongoose from 'mongoose';
import path from "path";
import { fileURLToPath } from "url";
import Listing from './models/listing.js';
import { rmSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/airbnb-clone")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Connection to MongoDB failed");
        console.log(err);
    });

app.get('/', (req, res) => {
    res.send("Connected");
});

//Index Route
app.get('/listings', async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
});

//Show Route
app.get('/listings/:id', async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findOne({ _id: id });
    res.render("listings/show.ejs", { listing });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
