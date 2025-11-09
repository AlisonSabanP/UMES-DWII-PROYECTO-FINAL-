import jwt from 'jsonwebtoken';

function getJWTSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno.');
  }
  return secret;
}

function getJWTExpiresIn() {
  return process.env.JWT_EXPIRES_IN || '7d';
}

export const generateToken = (userId) => {
  return jwt.sign({ userId }, getJWTSecret(), { expiresIn: getJWTExpiresIn() });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, getJWTSecret());
  } catch (error) {
    console.warn('Error de verificación de JWT:', error.message);
    return null;
  }
};

export const getUserIdFromToken = (token) => {
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
};