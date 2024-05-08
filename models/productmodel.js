const multer = require('multer');
const { router } = require("../app");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  productname: {type: String, unique: true, required: true},
  price: {type: Number},
  unit: {type: Number},
  file: {type:String},
  status: {type: String}
},
{
    timestamps: true
});

module.exports = mongoose.model("product", productSchema);