export const restrictAdminAccess = (req, res, next) => {
    if (req.user.role === "admin") {
      return res.status(403).json({ error: "Admins cannot access this resource" });
    }
    next();
  };
