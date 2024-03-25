const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listings.js");
const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';

main()
    .then(() => { console.log("Connected to DB") })
    .catch((err) => { console.log(err) });

async function main() {
    await mongoose.connect(mongo_url);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
        ...obj, owner: "65f5d030b4e12e64e117caf3"
    }));//This is the id of the user who is the owner of all the listings
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
}

initDB();