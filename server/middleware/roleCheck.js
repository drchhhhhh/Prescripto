// Check if user has required role
exports.hasRole = (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(403).json({ message: 'No user found' });
      }
      
      if (roles.includes(req.user.role)) {
        next();
      } else {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }
    };
  };