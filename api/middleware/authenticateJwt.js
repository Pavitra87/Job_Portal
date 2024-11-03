const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Token is required" });

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_TOKEN);

    console.log("Decoded User:", decodedUser);

    const user = await prisma.user.findUnique({
      where: { id: decodedUser.id },
      include: { role: true },
    });
    if (!user) return res.status(403).json({ error: "Invalid token" });

    req.user = {
      id: user.id,
      role: user.role.name,
      user,
    };
    next();
  } catch (err) {
    console.error(err); // Log the error for more details
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied: Insufficient permissions" });
    }
    next();
  };
};

module.exports = { authenticateToken, authorize };
