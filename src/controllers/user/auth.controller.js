const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../../models/User");
const CustomError = require("../../errors/CustomError");
const { secretKey } = require('../../secret');

const registerController = async (req, res, next) => {
    try {
      const userData = req.body;
      const newUser = new User(userData); 
      await newUser.save(); 
      const response = {
        username: newUser.username,
        email: newUser.email,
      };
      res.status(201).json({ message: 'User registered successfully', response });
    } catch (error) {
      next(new CustomError(error.message, error.status)); // Ensure `next` is passed in the function signature
    }
  };
  

  const loginController = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare provided password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        secretKey, 
        { expiresIn: '1h' } 
      );
      res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
  
      // Send response with token
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error); // Pass any errors to the error handler
    }
  };

module.exports = {
    registerController,
    loginController
};