const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../prismaClient");

//register
const Register = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);
  const { email, username, password, roleName } = req.body;
  const profile_picture_url = req.file
    ? `/uploads/profile_picture_url/${req.file.filename}`
    : null;
  if (!email || !username || !password || !roleName) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

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

    let role = await prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      role = await prisma.role.create({
        data: {
          name: roleName,
        },
      });
    }
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password_hash: hashedPassword,
        profile_picture_url: profile_picture_url,
        role: {
          connect: { id: role.id },
        },
      },
    });
    res.status(201).json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: role.name,
      profile_picture_url,
    });
    console.log(user);
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
    include: { role: true },
  });

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  try {
    const userRole = user.role ? user.role.name : "Guest";
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        profile_picture_url: user.profile_picture_url,
        role: userRole,
      },
      process.env.JWT_TOKEN, // Ensure this is correctly set
      { expiresIn: "30d" } // Token expiration time
    );

    res.status(200).json({
      message: "Login successfully",

      user: {
        id: user.id,
        name: user.username, // Adjust if you use a different field for name
        email: user.email,
        profile_picture_url: user.profile_picture_url,
        role: userRole,
      },
      token,
      // role: user.role.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { Register, Login };
