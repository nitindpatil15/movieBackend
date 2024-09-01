export const authorizeAdmins = (req, res, next) => {
  // Check if the user has either the SuperAdmin or Admin role
  if (req.user.role === "SuperAdmin" || req.user.role === "Admin") {
    console.log("Authorized Admin or SuperAdmin");
    return next();
  }

  // If the role is neither SuperAdmin nor Admin, deny access
  return res.status(403).json({ error: "Access denied, Admin or SuperAdmin only" });
};

export const authorizeSuperAdmin = (req, res, next) => {
  // Check if the user has either the SuperAdmin or Admin role
  if (req.user.role === "SuperAdmin") {
    console.log("Authorized Admin or SuperAdmin");
    return next();
  }

  // If the role is neither SuperAdmin nor Admin, deny access
  return res.status(403).json({ error: "Access denied, Admin or SuperAdmin only" });
};
