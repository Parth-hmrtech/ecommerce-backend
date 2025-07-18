import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const JWT_SECRET = process.env.JWT_SECRET;

const userAuthMiddleware = (req, res, next) => {
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Use Bearer token in Authorization header.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();

  } catch (err) {

    return res.status(401).json({
      success: false,
      message:
        err.name === 'TokenExpiredError'
          ? 'Token expired. Please log in again.'
          : 'Invalid token. Authentication failed.',
    });

  }
};

export { userAuthMiddleware };
