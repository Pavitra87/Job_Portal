const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

const createJobProviderProfile = async (req, res) => {
  try {
    const { description, location, phone_number } = req.body;

    const profile = await prisma.profile.create({
      data: {
        userId: req.user.id,
        phone_number,
        description,
        location,
      },
    });

    res.json({ message: "Job Seeker Profile created successfully", profile });
  } catch (error) {
    console.error("Error creating job seeker profile:", error);
    res.status(500).json({ message: "Error creating job seeker profile" });
  }
};

const createJobSeekerProfile = async (req, res) => {
  try {
    console.log("User in request:", req.user);
    console.log("Request body:", req.body);

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "User not authenticated or ID missing" });
    }

    const {
      jobtype,
      jobtitle,
      skills,

      experience,
      location,
      education,
      phone_number,
    } = req.body;

    const userId = req.user?.id;

    // Check if profile already exists for the user
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });
    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "A profile already exists for this user." });
    }

    const profile = await prisma.profile.create({
      data: {
        user: {
          connect: { id: userId },
        },
        location,
        skills,
        jobtitle,
        experience,
        jobtype,

        education,
        phone_number,
      },
    });

    res.json({ message: "Job Seeker Profile created successfully", profile });
  } catch (error) {
    console.error("Error creating job seeker profile:", error);
    res.status(500).json({ message: "Error creating job seeker profile" });
  }
};

// const createJobSeekerProfile = async (req, res) => {
//   try {
//     const {
//       jobtype,
//       jobtitle,
//       skills,
//       resume,
//       experience,
//       location,
//       education,
//       phone_number,
//     } = req.body;

//     const profile = await prisma.profile.create({
//       data: {
//         userId: req.user.id,
//         location,
//         skills: typeof skills === "string" ? JSON.parse(skills) : skills, // Parse if `skills` is sent as JSON string
//         jobtitle,
//         experience,
//         jobtype,
//         resume,
//         education,
//         phone_number,
//       },
//     });

//     res.json({ message: "Job Seeker Profile created successfully", profile });
//   } catch (error) {
//     console.error("Error creating job seeker profile:", error);
//     res.status(500).json({ message: "Error creating job seeker profile" });
//   }
// };

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
  const userId = req.user.id; // Assuming authenticated user's ID is available on req.user
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
  } = req.body; // Expecting these fields from the request body

  try {
    // Check if the user has an existing profile
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Update the profile with provided fields
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        description: description || existingProfile.description,
        location: location || existingProfile.location,
        skills: skills || existingProfile.skills,
        education: education || existingProfile.education,
        phone_number: phone_number || existingProfile.phone_number,
        jobtitle: jobtitle || existingProfile.jobtitle,
        experience: experience || existingProfile.experience,
        jobtype: jobtype || existingProfile.jobtype,
        resume: resume || existingProfile.resume,
      },
      include: {
        user: true, // Include user data if needed in response
      },
    });

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ error: "Internal server error" });
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
  createJobProviderProfile,
  createJobSeekerProfile,
};
