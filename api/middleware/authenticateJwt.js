const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access token is required" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Received Token:", token);

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_TOKEN);
    console.log("Decoded User:", decodedUser);

    const user = await prisma.user.findUnique({
      where: { id: decodedUser.id },
      include: { role: true },
    });

    if (!user) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = {
      id: user.id,
      role: user.role ? user.role.name : null,
      user,
    };

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ error: "Access denied. Role information missing." });
    }

    // Check if user role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
    }

    next();
  };
};

// const authorize = (role) => {
//   return (req, res, next) => {
//     // Assuming user role is stored in the user object after authentication
//     if (!req.userId) {
//       return res
//         .status(403)
//         .json({ error: "Access denied: User not authenticated" });
//     }

//     // Check if the user has the required role
//     if (req.user.role !== role) {
//       return res
//         .status(403)
//         .json({ error: `Access denied: User is not a ${role}` });
//     }

//     next();
//   };
// };

module.exports = { authenticateToken, authorize };
