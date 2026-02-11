import jwt from 'jsonwebtoken';
import config from '#config/index.js';
import logger from '#config/logger.js';

export const jwttoken = {
  generateToken: payload => {
    try {
      return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      });
    } catch (error) {
      logger.error('Error generating token', error);
      throw new Error('Error generating token', { cause: error });
    }
  },
  verifyToken: token => {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      logger.error('Error verifying token', error);
      throw new Error('Error verifying token', { cause: error });
    }
  },
};
