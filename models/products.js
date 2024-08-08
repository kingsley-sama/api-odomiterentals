#!/usr/bin/node
const mongoose = require('mongoose');

// Define the schema for the Product
const ProductSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    cartegory: {
        type: String,
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
  product_image: {
        type: String, // This could be a URL or file path
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    }
});
// Create and export the Product model
const Product = mongoose.model('Product', ProductSchema);
module.exports.ProductDetail = Product;
