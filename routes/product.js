const express = require('express')
const { upload, processAndUploadImage } = require('../milldewares/cloudinary');
const { v4: uuidv4 } = require('uuid');
const { ProductDetail } = require('../models/products');
const productRouter = express.Router()
productRouter.get('/', async(req, res)=>res.send('<h1>Hi there</h1>'))
productRouter.post('/', upload, processAndUploadImage, async (req, res) => {
  if (!req.processedImage) {
    return res.status(400).send({ error: "Profile Image required" });
  }
  try {
    const { product_name, cartegory, price, desc } = req.body;
    const existingProduct = await ProductDetail.findOne({ product_name });
    if (existingProduct) {
      return res.status(400).send({ error: "product already exists" });
    }
    const newProduct = new ProductDetail({
      id: uuidv4(),
      product_name,
      cartegory,
      desc,
      price,
      product_image: req.processedImage.url
    });
    await newProduct.save();

    const userResponse = newProduct.toObject();
    res.status(201).send(userResponse);
  } catch (e) {
    console.log('Add product error:', e);
    res.status(500).send('Internal Server Error');
  }
});
// Update products
productRouter.put('/', upload, processAndUploadImage, async (req, res) => {
  if (!req.processedImage) {
    return res.status(400).send({ error: "Profile Image required" });
  }
  try {
    const { product_name, cartegory, price, desc } = req.body;
    const existingProduct = await ProductDetail.findOne({ product_name });
    if (existingProduct) {
      return res.status(400).send({ error: "product already exists" });
    }
    const newProduct = new ProductDetail({
      id: uuidv4(),
      product_name,
      cartegory,
      desc,
      price,
      product_image: req.processedImage.url
    });
    await newProduct.save();

    const userResponse = newProduct.toObject();
    res.status(201).send(userResponse);
  } catch (e) {
    console.log('Add product error:', e);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = productRouter;
