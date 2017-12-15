const mongoose = require("mongoose");

const cardSchema = mongoose.Schema({
    name: String,
    image: String, 
    description: String,
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Card", cardSchema);