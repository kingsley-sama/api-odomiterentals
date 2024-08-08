const express = require('express')
const { upload, processAndUploadImage } = require('../milldewares/cloudinary');
const { v4: uuidv4 } = require('uuid');
const { UserDetail } = require('../models/users');
const userRouter = express.Router()

userRouter.post('/signup', upload, processAndUploadImage, async (req, res) => {
  if (!req.processedImage) {
    return res.status(400).send({ error: "Profile Image required" });
  }
  try {
    const { user_name, passwd, first_name, last_name } = req.body;

    // Check if user already exists
    const existingUser = await UserDetail.findOne({ user_name });
    if (existingUser) {
      return res.status(400).send({ error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(passwd, 10);

    const newUser = new UserDetail({
      id: uuidv4(),
      user_name,
      passwd: hashedPassword, // Store hashed password
      first_name,
      last_name,
      profile_image: req.processedImage.url
    });
    await newUser.save();

    // Don't send password back in response
    const userResponse = newUser.toObject();
    delete userResponse.passwd;

    res.status(201).send(userResponse);
  } catch (e) {
    console.log('Signup error:', e);
    res.status(500).send('Internal Server Error');
  }
});

userRouter.get('/', async (req, res) => {
  res.send('<h1> hi there friend</h1>')
});
module.exports = userRouter;
