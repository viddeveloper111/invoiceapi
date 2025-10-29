const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than or equal to 0"],
    },
    model: {
      type: String,
      required: [true, "Product model is required"],
      trim: true,
    },
      gst: {
      type: Number,
      required: [true, "GST percentage is required"],
      min: [0, "GST must be greater than or equal to 0"],
      max: [100, "GST cannot exceed 100"],
    },
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
