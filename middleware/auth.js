import jwt from "jsonwebtoken";  

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
} 

export const verifyAdmin = (req, res, next) => {
  if (req.user.role === "Admin") {
    next(); // User is admin, proceed
  } else {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
};