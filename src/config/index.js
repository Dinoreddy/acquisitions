const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'enter_jwt_secret_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
};

export default config;
