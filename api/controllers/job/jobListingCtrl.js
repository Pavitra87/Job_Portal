const prisma = require("../../prismaClient");
const {emitJobPosted} = require("../notification/socket");

//create
const createJobList = async (req, res) => {
  const {
    title,
    description,
    requirements,
    preferredSkills,
    location,
    salary_range,
    applications_count,
    categoryId,
    providerId,
    expires_at,
  } = req.body;
  

  try {
    // const providerExists = await prisma.jobProviderProfile.findUnique({
    //   where: { id: providerId },
    // });

    // if (!providerExists) {
    //   return res.status(400).json({ error: "Job provider does not exist" });
    // }
    const jobListing = await prisma.jobListing.create({
      data: {
        providerId,
        categoryId,
        title,
        description,
        requirements,
        preferredSkills,
        location,
        salary_range,
        applications_count,
        expires_at: new Date(expires_at),
      },
    });
    emitJobPosted(jobListing);
    res.status(201).json(jobListing);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

//update
const updateJoblist = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    requirements,
    preferredSkills,
    location,
    salary_range,
  } = req.body;

  try {
    const updatejoblist = await prisma.jobListing.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        requirements,
        preferredSkills,
        location,
        salary_range,
      },
    });
    res.status(201).json(updatejoblist);
  } catch (error) {
    console.log(error);

    res.status(401).json({ error: error.message });
  }
};

//delete
const deleteJoblist = async (req, res) => {
  const { id } = req.params;
  try {
    const deletejoblist = await prisma.jobListing.delete({
      where: { id: Number(id) },
    });
    res.status(201).json(deletejoblist);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

//get one
const getJoblist = async (req, res) => {
  const { id } = req.params;
  try {
    const getjoblist = await prisma.jobListing.findUnique({
      where: { id: Number(id) },
    });
    res.status(201).json(getjoblist);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

//get all
const getJoblists = async (req, res) => {
  try {
    const getjoblists = await prisma.jobListing.findMany();
    res.status(201).json(getjoblists);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = {createJobList,updateJoblist,deleteJoblist,getJoblist,getJoblists};
