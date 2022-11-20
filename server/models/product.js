const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      require: true,
    },
    description: {
      type: String,
      required: true,
      max: 3000,
    },
    photo: {
      data: Buffer,
      ContentType: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
