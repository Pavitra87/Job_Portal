const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken')

//register
const Register = async (req, res) => {
  const { email, username, password, profile_picture_url } = req.body;
  const hashedPassword = bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password_hash: hashedPassword,
        profile_picture_url,
      },
    });
    res
      .status(201)
      .json({ id: user.id, email: user.email, username: user.username });
  } catch (error) {
    res.status(400).json({ error: "Email already exists" });
  }
};

//login
const Login=async(req,res)=>{
    const {email,password}=req.body;
     const user=await prisma.user.findUnique({
        where:{email}
     })

     if(!user){
        return res.status(400).json({ error: 'User not found' });
     }

     const isMatch=await bcrypt.compare(password,user.password_hash)
     if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    try {
        const token=jwt.sign({userId:user.id,email:user.email},process.env.JWT_TOKEN,{expiresIn:"30d"})
        res.status(200).json({message:"Login succesfully",token,user:{id:user.id,email:user.id}})
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports = { Register ,Login};
