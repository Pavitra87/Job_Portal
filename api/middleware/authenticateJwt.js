const jwt = require("jsonwebtoken");

//Authentication Middleware to Check User Token( Authentication Middleware (JWT))
const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).send("Token is required");
  }

  jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }
    req.user = user;
    next();
  });
};



//Authorization Middleware to Check User Role(Authorization Middleware to Check Roles)
const autherizationRoles = async (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).send("Access denied");
    }
    next();
  };
};

module.exports={authenticateToken,autherizationRoles}
