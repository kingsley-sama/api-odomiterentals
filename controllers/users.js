#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Assume you have a User model defined somewhere
const User = require('./models/User');

const usersController = {
  get_user: async (user_id) => {
    try {
      const user = await User.findOne({ id: user_id });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error in get_user:', error);
      throw error;
    }
  },

  create_user: async (userData) => {
    try {
      // Check if username already exists
      const existingUser = await User.findOne({ user_name: userData.user_name });
      if (existingUser) {
        throw new Error('Username already exists');
      }

      // Check if first name and last name combination already exists
      const existingNameCombo = await User.findOne({
        first_name: userData.first_name,
        last_name: userData.last_name
      });
      if (existingNameCombo) {
        throw new Error('A user with this first and last name combination already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.passwd, 10);

      const newUser = new User({
        id: uuidv4(),
        user_name: userData.user_name,
        passwd: hashedPassword,
        profile_image: userData.profile_image,
        first_name: userData.first_name,
        last_name: userData.last_name,
        date: new Date()
      });

      await newUser.save();
      return newUser;
    } catch (error) {
      console.error('Error in create_user:', error);
      throw error;
    }
  },

  update_user: async (user_id, updateData) => {
    try {
      const user = await User.findOne({ id: user_id });
      if (!user) {
        throw new Error('User not found');
      }

      // If username is being updated, check for uniqueness
      if (updateData.user_name && updateData.user_name !== user.user_name) {
        const existingUser = await User.findOne({ user_name: updateData.user_name });
        if (existingUser) {
          throw new Error('Username already exists');
        }
      }

      // If name is being updated, check for unique combination
      if ((updateData.first_name && updateData.first_name !== user.first_name) ||
          (updateData.last_name && updateData.last_name !== user.last_name)) {
        const existingNameCombo = await User.findOne({
          first_name: updateData.first_name || user.first_name,
          last_name: updateData.last_name || user.last_name,
          id: { $ne: user_id }
        });
        if (existingNameCombo) {
          throw new Error('A user with this first and last name combination already exists');
        }
      }

      // If password is being updated, hash it
      if (updateData.passwd) {
        updateData.passwd = await bcrypt.hash(updateData.passwd, 10);
      }

      Object.assign(user, updateData);
      await user.save();
      return user;
    } catch (error) {
      console.error('Error in update_user:', error);
      throw error;
    }
  },

  delete_user: async (user_id) => {
    try {
      const result = await User.deleteOne({ id: user_id });
      if (result.deletedCount === 0) {
        throw new Error('User not found');
      }
      return { message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error in delete_user:', error);
      throw error;
    }
  },

  sign_in: async (username, password) => {
    try {
      const user = await User.findOne({ user_name: username });
      if (!user) {
        throw new Error('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.passwd);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Create a JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return { user, token };
    } catch (error) {
      console.error('Error in sign_in:', error);
      throw error;
    }
  }
};

module.exports = usersController;
