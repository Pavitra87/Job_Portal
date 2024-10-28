const prisma = require("../../prismaClient");

//create profile
const createProfile = async (req, res) => {
  const {
    first_name,
    last_name,
    phone_number,
    resume_url,
    skills,
    experience,
    education,
    location,
    preferredJobTypes,
  } = req.body;
  const userId = req.user.userId;
  try {
    const newCreateProfile = await prisma.jobSeekerProfile.create({
      data: {
        userId,
        first_name,
        last_name,
        phone_number,
        resume_url,
        skills,
        experience,
        education,
        location,
        preferredJobTypes,
      },
    });
    res.status(200).json(newCreateProfile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//get all
const getProfiles = async (req, res) => {
  try {
    const profiles = await prisma.jobSeekerProfile.findMany();
    res.status(201).json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get one
const getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const profile = await prisma.jobSeekerProfile.findUnique({
      where: { id: Number(id) },
    });
    if (!profile) return res.status(404).json({ error: "profile not found" });
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update
const updateProfile = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    phone_number,
    resume_url,
    skills,
    experience,
    education,
    location,
  } = req.body;
  try {
    const updatedprofile = await prisma.jobSeekerProfile.update({
      where: { id: Number(id) },
      data: {
        first_name,
        last_name,
        phone_number,
        resume_url,
        skills,
        experience,
        education,
        location,
      },
    });
    res.status(201).json(updatedprofile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete
const deleteProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProfile = await prisma.jobSeekerProfile.delete({
      where: { id: Number(id) },
    });
    res.status(204).send(deletedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createProfile,getProfile,getProfiles,updateProfile,deleteProfile};
