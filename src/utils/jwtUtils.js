import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  // Define the payload of the token
  const payload = {
    _id: userId,
  };

  // Sign the token with a secret key and set an expiration time
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '12h', // Token expires in 1 hour
  });

  return token;
};
