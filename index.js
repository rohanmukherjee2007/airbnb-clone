import express from 'express';
import mongoose from 'mongoose';

const app = express();

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

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
