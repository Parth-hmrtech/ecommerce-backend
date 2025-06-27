import {
  createUser,
  loginUser,
  forgotUserPassword
} from '../services/auth.service.js';
import { sendEmail } from '../utils/emailService.js';
import { generateRandomPassword } from '../utils/password.js';
import { Sequelize } from 'sequelize'; // Make sure this is imported if not already
import { uploadFile } from '../utils/uploadImage.js';




const createUserController = async (req, res) => {
  try {
    const userData = { ...req.body };
    if (req.file) {
      const filePath = req.file.path;
      const imageUrl = await uploadFile(filePath);
      userData.image_url = imageUrl;
    } else {
      console.log('No file uploaded');
    }

    console.log("Final user data to save:", userData);

    const user = await createUser(userData);

    return res.status(200).json({
      error: false,
      message: 'User registered successfully!',
      data: { user },
    });

  } catch (error) {
    console.error("User creation error:", error);

    if (error instanceof Sequelize.UniqueConstraintError) {
      return res.status(400).json({
        error: true,
        message: 'Email already registered for this role.',
      });
    }

    if (error.message && error.message.startsWith('Email is already registered as')) {
      return res.status(400).json({
        error: true,
        message: error.message,
      });
    }

    return res.status(500).json({
      error: true,
      message: error.message || 'Something went wrong.',
    });
  }
};




const loginUserController = async (req, res) => {
  try {
    const { token, user } = await loginUser(req.body);

    req.session.jwt = token;

    return res.status(200).json({
      error: false,
      message: "You have logged in successfully!",
      data: { user, token },
    });

  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(401).json({
      error: true,
      message: error.message || "Invalid login credentials",
    });
  }
};

const logoutUserController = (req, res) => {

  req.session.destroy(() => {

    res.clearCookie('connect.sid');

    return res.status(200).json({
      error: false,
      message: "Logged out successfully",
      data: null,
    });

  });
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ status: 'error', message: 'Email and role are required' });
    }

    const newPassword = generateRandomPassword();

    const user = await forgotUserPassword(email, newPassword, role);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    await sendEmail(newPassword, email);

    res.json({
      status: 'success',
      message: 'Password sent to your email id',
      data: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export {
  createUserController,
  loginUserController,
  logoutUserController,
  forgotPasswordController,
};










