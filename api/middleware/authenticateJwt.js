const jwt = require("jsonwebtoken");

//Authentication Middleware to Check User Token( Authentication Middleware (JWT))
const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).send("Token is required");
  }

  const decodetoken = jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }
    req.user = user;
    next();
  });
  // console.log(decodetoken);
};

//Authorization Middleware to Check User Role(Authorization Middleware to Check Roles)

const autherizationRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const userRole = req.user.role;
    console.log(userRole);

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ error: "Access denied: Insufficient permissions" });
    }

    next();
  };
};
module.exports = { authenticateToken, autherizationRoles };
