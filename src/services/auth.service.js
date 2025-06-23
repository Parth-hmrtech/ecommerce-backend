import jwt from 'jsonwebtoken';
import users from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '../.env' });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const createUser = async (userBody) => {
  const { email, role } = userBody;

  if (!email || !role) {
    throw new Error('Email and role are required.');
  }

  // Allow same email for one buyer and one seller, but not same role twice
  const existingUser = await users.findOne({
    where: { email, role }, // checks uniqueness per (email + role)
  });

  if (existingUser) {
    throw new Error(`Email is already registered as a ${role}.`);
  }

  // All good — create new user
  return await users.create(userBody);
};



const loginUser = async ({ email, password, role }) => {
  // Find user by email, role, and active status
  const user = await users.findOne({
    where: {
      email,
      role,
      is_active: true,
    },
  });

  // If user not found or password mismatch
  if (!user || !(await user.validPassword(password))) {
    throw new Error('Invalid email, password, or role');
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { token, user };
};


const forgotUserPassword = async (email, newPassword, role) => {
  const user = await users.findOne({ where: { email, role } });

  if (!user) return null;

  user.password_hash = newPassword; // You should hash this in real scenarios

  await user.save();
  return user;
};


export const isValidUser = async ({ id }) => {
    if (!id) return null;

    const user = await users.findOne({
        where: { id },
        attributes: { exclude: ['password'] }, // optional: don’t return password
    });

    return user;
};

export {
    createUser,
    loginUser,
    forgotUserPassword
};