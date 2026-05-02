const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  // Get Authorization header
  const authHeader = req.headers.authorization;

  // Check if header exists
  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized: No token provided"
    });
  }

  // Check if header format is Bearer TOKEN
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      message: "Unauthorized: Token format must be Bearer TOKEN"
    });
  }

  // Extract token
  const token = parts[1];

  try {

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = decoded;

    // Continue to next middleware
    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or Expired Token"
    });

  }

};       