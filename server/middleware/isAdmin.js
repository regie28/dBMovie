export const isAdmin = (req, res, next) => {
    if (req.user.role !== '1') {
      return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
  };