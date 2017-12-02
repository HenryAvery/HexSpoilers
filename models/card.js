const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    name: String,
    image: String, 
    description: String
});

module.exports = mongoose.model("Card", cardSchema);