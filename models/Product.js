const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  price: { type: Number, required: true },
  category: { type: String, enum: ["makeup", "accessories"], required: true },
  quantity: { type: Number, default: 0 }
});

module.exports = mongoose.model("Product", productSchema);
