const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Get token from cookies (or headers if you prefer)
  const token = req.cookies.token || req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = authenticateToken;
