const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);  // Log header value

  if (!authHeader) {
    console.log('No Authorization header provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('Invalid Authorization header format');
    return res.status(401).json({ message: 'Invalid token format' });
  }

  const token = parts[1];
  console.log('Token extracted:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log('Token verification error:', err.message);
    res.status(401).json({ message: 'Token is not valid or expired' });
  }
};

module.exports = isAuth;
