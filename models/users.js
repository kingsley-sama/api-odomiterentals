#!/usr/bin/Node
const mongoose = require('mongoose')
const UserDetailSchema = new mongoose.Schema(
  {
    id: String,
    user_name: String,
    passwd: String,
    profile_image: String,
    first_name: String,
    last_name: String,
    date: {
      type: Date,
      default: Date.now
    },
  }
)
const User = mongoose.model('User', UserDetailSchema);
module.exports.UserDetail = User;
