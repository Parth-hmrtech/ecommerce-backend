import {
    createUser,
    loginUser,
    forgotUserPassword
} from '../services/auth.service.js';
import { sendEmail } from '../utils/emailService.js';
import { generateRandomPassword } from '../utils/password.js';
import { Sequelize } from 'sequelize'; // Make sure this is imported if not already

const createUserController = async (req, res) => {

  try {
    const user = await createUser(req.body);
  console.log("Received create user request:", req.body);

    return res.status(200).json({
      error: false,
      message: 'User registered successfully!',
      data: { user },
    });

  } catch (error) {
    console.error("User creation error:", error);

    // Sequelize unique constraint error (e.g. duplicate email+role)
    if (error instanceof Sequelize.UniqueConstraintError) {
      return res.status(400).json({
        error: true,
        message: 'Email already registered for this role.',
      });
    }

    // Application-level error from our own logic
    if (error.message && error.message.startsWith('Email is already registered as')) {
      return res.status(400).json({
        error: true,
        message: error.message,
      });
    }

    // Fallback: unexpected error
    return res.status(500).json({
      error: true,
      message: 'Something went wrong.',
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
    
        const newPassword = generateRandomPassword();
    
        const user = await forgotUserPassword(req.body.email, newPassword);
    
        await sendEmail(newPassword, req.body.email);
    
        res.json({
            status: 'success',
            message: 'Password sent to your email id',
            data: user
        });

    } catch (error) {
    
        throw Error(error);
    
    }
};

export {
    createUserController,
    loginUserController,
    logoutUserController,
    forgotPasswordController,
};










