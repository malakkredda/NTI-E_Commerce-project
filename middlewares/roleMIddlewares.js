const role = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: ${req.user.role} role not allowed`
      });
    }
    next();
  };
};

module.exports = role;
