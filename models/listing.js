import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            default: 'https://as2.ftcdn.net/jpg/05/97/47/95/1000_F_597479556_7bbQ7t4Z8k3xbAloHFHVdZIizWK1PdOo.jpg',
            set: url => !url ? 'https://as2.ftcdn.net/jpg/05/97/47/95/1000_F_597479556_7bbQ7t4Z8k3xbAloHFHVdZIizWK1PdOo.jpg' : url
        }
    },
    price: {
        type: Number,
        set: value => Math.round(value)
    },
    location: String,
    country: {
        type: String,
        default: "India",
        set: value => !value ? "India" : value
    }
});
const Listing = mongoose.model("Listing", listingSchema);
export default Listing;