const prisma = require("../../prismaClient");

//create profile
const createProfile = async (req, res) => {
  const { company_name, company_description, email, phone, location, website } =
    req.body;
  const userId = req.user.userId;

  try {
    const newCreateProfile = await prisma.jobProviderProfile.create({
      data: {
        userId,
        company_name,
        company_description,
        email,
        phone,
        website,
        location,
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
    const profiles = await prisma.jobProviderProfile.findMany();
    res.status(201).json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get one
const getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const profile = await prisma.jobProviderProfile.findUnique({
      where: { id: Number(id) },
    });
    if (!profile) return res.status(404).json({ error: "profile not found" });
    res.status(201).send(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//update
const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { company_name, company_description, email, phone, location, website } =
    req.body;
  try {
    const updatedprofile = await prisma.jobProviderProfile.update({
      where: { id: Number(id) },
      data: {
        company_name,
        company_description,
        email,
        phone,
        location,
        website,
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
    const deletedProfile = await prisma.jobProviderProfile.delete({
      where: { id: Number(id) },
    });
    res.status(204).send(deletedProfile);
  } catch (error) {}
};

module.exports = {createProfile,getProfile,getProfiles,updateProfile,deleteProfile};
