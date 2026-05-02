const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  return jwt.sign(
    // ✅ FIX 5: Added name to token payload — was missing so req.user.name
    // would be undefined in all authenticated routes
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};