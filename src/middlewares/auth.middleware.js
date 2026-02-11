import { jwttoken } from '#utils/jwt.js';
import logger from '#config/logger.js';

export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = jwttoken.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Authentication failed: ${error.message}`);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
