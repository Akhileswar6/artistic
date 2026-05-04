const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Support both "Bearer <token>" and raw "<token>"
  const token = authHeader.startsWith("Bearer ") 
    ? authHeader.split(" ")[1] 
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
  });
};

module.exports = { verifyToken, verifyAdmin };
