const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createJobProviderProfile = async (req, res) => {
  const { description, location, phone_number } = req.body;

  if (!description || !location || !phone_number) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const userId = req.user.id;

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role.name !== "Job Provider") {
      return res
        .status(403)
        .json({ error: "Access denied: User is not a JobProvider" });
    }

    // Create a new profile associated with the user
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        description,
        phone_number,

        location,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return res
      .status(201)
      .json({ message: "Profile created successfully", profile });
  } catch (error) {
    console.error("Error creating profile:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the profile" });
  }
};

const createJobSeekerProfile = async (req, res) => {
  const {
    location,
    skills,
    education,
    phone_number,
    jobtitle,
    experience,
    jobtype,
  } = req.body;

  const resume = req.file ? req.file.path : null;

  if (
    !skills ||
    !location ||
    !phone_number ||
    !education ||
    !jobtitle ||
    !experience ||
    !jobtype
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const userId = req.user.id;

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role.name !== "Job Seeker") {
      return res
        .status(403)
        .json({ error: "Access denied: User is not a JobProvider" });
    }

    // Create a new profile associated with the user
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        location,
        skills,
        education,
        phone_number,
        jobtitle,
        experience,
        jobtype,
        resume,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return res
      .status(201)
      .json({ message: "Profile created successfully", profile });
  } catch (error) {
    console.error("Error creating profile:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the profile" });
  }
};

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
      profile_picture_url: user.profile_picture_url,
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
        user: true,
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
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const deleteUser = await prisma.profile.delete({
      where: { userId },
      include: {
        user: true,
      },
    });
    res.status(200).json({
      message: "Profile deleted successfully",
      profile: deleteUser,
    });
  } catch (error) {
    console.error("Error deleting user and profile:", error);
    return res.status(500).json({ message: "Error deleting profile" });
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
