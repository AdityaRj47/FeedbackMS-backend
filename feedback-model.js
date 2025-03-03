const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email:{type: String, required: true},
    message:{type: String, required: true}
});
module.exports = mongoose.model("feedback-model", feedSchema);
