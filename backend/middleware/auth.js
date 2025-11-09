import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/index.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
  }

  const token = authHeader.replace('Bearer ', '');

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }

  try {
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(401).json({ error: 'Token inválido.' });
    }
    console.error('Error de autenticación en la base de datos:', error);
    return res.status(500).json({ error: 'Error del servidor durante la autenticación.' });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Acceso denegado. Usuario no autenticado.' });
    }

    if (!Array.isArray(roles) || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado. Permisos insuficientes.' });
    }

    next();
  };
};