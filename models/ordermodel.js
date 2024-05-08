const multer = require('multer');
const { router } = require("../app");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
    order_name: { type: String },
    name: { type: String }, 
    price: { type: Number }, 
    quantity: { type: Number },
    total: { type: Number },
    product_id:{type: String}
},
{
    timestamps: true
});

module.exports = mongoose.model("order", orderSchema);