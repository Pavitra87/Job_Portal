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
  const userId = req.user.id; // Get user ID from authenticated user
  const roleName = req.user.role.name; // Get role from user object

  console.log("Updating profile for user:", userId, "with role:", roleName); // Log the role

  try {
    let updatedProfile;

    if (roleName === "Job Provider") {
      // Logic for Job Providers
      const { email, username, location, description } = req.body;
      updatedProfile = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          email,
          username,
          profile: {
            update: {
              location,
              description,
            },
          },
        },
        include: {
          profile: true,
        },
      });
    } else if (roleName === "Job Seeker") {
      // Logic for Job Seekers
      const { email, username, profileData } = req.body;
      updatedProfile = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          email,
          username,
          profile: {
            update: {
              location: profileData.location,
              description: profileData.description,
              skills: profileData.skills,
              education: profileData.education,
              phone_number: profileData.phone_number,
              experience: profileData.experience,
            },
          },
        },
        include: {
          profile: true,
        },
      });
    } else {
      return res
        .status(403)
        .json({
          error: "Unauthorized role for profile update",
          role: roleName,
        });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteProfile = async (req, res) => {
  const { id } = req.params; // Extract user ID from request parameters

  try {
    // Delete the job seeker profile
    const deletedJobSeeker = await prisma.user.delete({
      where: { id: Number(id) }, // Use the user ID to find the correct profile
    });

    res
      .status(200)
      .json({ message: "Profile deleted successfully", deletedJobSeeker });
  } catch (error) {
    console.error("Error deleting job seeker profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllJobSeekerProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
};
