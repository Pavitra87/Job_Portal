const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//register
const Register = async (req, res) => {
  const { email, username,roleName, password, profile_picture_url } = req.body;
  
  try {
    // Check if the email already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).send("Email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const role = await prisma.role.findUnique({
      where: { name: roleName },
  });
  if (!role) {
    // If role doesn't exist, create it
    const role = await prisma.role.create({
      data: {
        name: roleName
      }
    });
    res.status(200).send(role)
  }
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password_hash: hashedPassword,
        profile_picture_url,
        role: {
          connect: { id: role.id }
        }
      },
    });
    res
      .status(201)
      .json({ id: user.id, email: user.email, username: user.username,role:role.name });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: "Internal server error" });
  }
};

//login
const Login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  try {
    const accesstoken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_TOKEN,
      { expiresIn: "30d" }
    );
    res
      .status(200)
      .json({
        message: "Login succesfully",
        accesstoken,
        user: { id: user.id, email: user.id },
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { Register, Login };
