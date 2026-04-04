import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

async function requireAdminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token) {
      console.warn('Access denied: missing access token', req.originalUrl);
      return res.status(401).json({ message: 'Access token is required' });
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const admin = await Admin.findById(payload.adminId).select('-password -refreshToken');

    if (!admin) {
      console.warn('Access denied: admin not found for token', payload.adminId);
      return res.status(401).json({ message: 'Invalid access token' });
    }

    req.admin = admin;
    return next();
  } catch (error) {
    console.warn('Access denied: token verification failed', error.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

export { requireAdminAuth };
