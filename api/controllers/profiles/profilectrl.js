const prisma = require("../../prismaClient");

// Get All Job Seeker Profiles
const getAllJobSeekerProfiles = async (req, res) => {
  try {
    const jobSeekers = await prisma.user.findMany({
      where: {
        role: {
          name: "Job Seeker",
        },
      },
      include: {
        profile: true, // Include the profile details
        role: true, // Include role details if needed
      },
    });

    res.status(200).json(jobSeekers);
  } catch (error) {
    console.error("Error fetching job seeker profiles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  const userId = req.user.id; // Assuming you're using middleware to authenticate and attach user info to the request

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true, // Include the profile relation
        role: true, // Include the role relation if needed
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      profile: user.profile,
      role: user.role.name,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const {
    description,
    location,
    skills,
    education,
    phone_number,
    jobtitle,
    experience,
    jobtype,
    resume,
  } = req.body;

  try {
    // Parse userId as integer and validate
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: parsedUserId },
      data: {
        description: description || null,
        location: location || null,
        skills: skills ? JSON.parse(skills) : null, // Parse JSON if skills are provided
        education: education || null,
        phone_number: phone_number || null,
        jobtitle: jobtitle || null,
        experience: experience || null,
        jobtype: jobtype || null,
        resume: resume || null,
      },
    });

    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const deleteProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    // Delete the user (the profile will be deleted automatically)
    const deletedUser = await prisma.user.delete({
      where: { id: Number(userId) },
    });

    res.status(200).json({
      message: "User and profile deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user and profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllJobSeekerProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
};
