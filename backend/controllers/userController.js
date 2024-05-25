import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userSchema.js';
// import Campaign from '../models/campaignsSchema.js';
// import CampaignRecipient from '../models/campaignRecipientSchema.js';
// import Segment from '../models/segmentSchema.js';

// User Controller
class UserController {
  // User Sign Up
  static async signUp(req, res) {
    try {
      const { first_name, last_name, email, password, segment_id, is_admin } = req.body;

      // Validate user input
      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
          message: 'All fields are required'
        });
      }

      const emailToLower = email.toLowerCase();

      // Check if user already exists
      const userExists = await User.getUserByEmail(emailToLower);
      if (userExists) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: 'User already exists'
        });
      }

      // Check password length
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: 'Password must be at least 6 characters long'
        });
      }

      // Hash password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hash(password, salt);

      // Create user
      const user = await User.createUser(first_name, last_name, emailToLower, hashedPassword, segment_id, is_admin);

      // Create token
      const token = jsonwebtoken.sign(
        {
          first_name: user.first_name,
          last_name: user.last_name,
          email: emailToLower
        }, 
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Send response
      return res.status(201).json({
        success: true,
        status: 201,
        message: 'User created',
        token: token,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message
      });
    }
  }

  // User Sign In
  static async signIn(req, res) {
    try {
      const { email, password } = req.body;

      // Validate user input
      if (!email || !password) {
        return res.status(400).json({
          message: 'All fields are required'
        });
      }

      const emailToLower = email.toLowerCase();

      // Check if user exists
      const user = await User.getUserByEmail(emailToLower);
      if (!user) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: 'User not found'
        });
      }

      // Check password
      const passwordMatch = bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: 'Invalid credentials'
        });
      }

      // Create token
      const token = jsonwebtoken.sign(
        {
          first_name: user.first_name,
          last_name: user.last_name,
          email: emailToLower
        }, 
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Send response
      return res.status(200).json({
        success: true,
        status: 200,
        message: 'User signed in',
        token: token,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message
      });
    }
  }

  // Get user segment
  static async getUserSegment(req, res) {
    try {
      const { id } = req.params;

      // Check if user exists
      const user = await User.getUserById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: 'User not found'
        });
      }

      // Get user segment
      const segment = await User.getUserSegment(id);
      if (!segment) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: 'Segment not found'
        });
      }

      // Send response
      return res.status(200).json({
        success: true,
        status: 200,
        message: 'User segment',
        data: segment
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message
      });
    }
  }

  // Get user campaigns
  static async getUserCampaigns(req, res) {
    try {
      const { id } = req.params;

      // Check if user exists
      const user = await User.getUserById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: 'User not found'
        });
      }

      // Get user campaigns
      const campaigns = await User.getUserCampaigns(id);
      if (!campaigns) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: 'Campaigns not found'
        });
      }

      // Send response
      return res.status(200).json({
        success: true,
        status: 200,
        message: 'User campaigns',
        data: campaigns
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message
      });
    }
  }

  // Get user campaign recipients
  static async getUserCampaignRecipients(req, res) {
    try {
      const { id } = req.params;

      // Check if user exists
      const user = await User.getUserById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: 'User not found'
        });
      }

      // Get user campaign recipients
      const campaignRecipients = await User.getUserCampaignRecipients(id);
      if (!campaignRecipients) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: 'Campaign recipients not found'
        });
      }

      // Send response
      return res.status(200).json({
        success: true,
        status: 200,
        message: 'User campaign recipients',
        data: campaignRecipients
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message
      });
    }
  }
}

export default UserController;