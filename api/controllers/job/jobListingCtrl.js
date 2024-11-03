const prisma = require("../../prismaClient");
const { emitJobPosted } = require("../notification/socket");

//create
const createJobList = async (req, res) => {
  const {
    title,
    description,
    requirements,
    preferredSkills,
    location,
    salary_range,
    posted_at,
    expires_at,
  } = req.body;
  const providerId = req.user?.id;

  try {
    if (req.user.role !== "Job Provider") {
      return res.status(403).json({
        error: "Access denied. Only Job Providers can create job listings.",
      });
    }

    let profileId = req.profile?.id;
    if (!profileId) {
      const profile = await prisma.profile.findUnique({
        where: { userId: providerId },
      });
      if (!profile) {
        return res
          .status(404)
          .json({ error: "Profile not found for the user" });
      }
      profileId = profile.id;
    }

    const jobListing = await prisma.jobListing.create({
      data: {
        title,
        description,
        requirements,
        preferredSkills,
        location,
        salary_range,

        posted_at: new Date(posted_at),
        expires_at: new Date(expires_at),
        provider: {
          connect: { id: providerId },
        },
        profile: {
          connect: { id: profileId },
        },
      },
    });

    io.emit("newJobPosted", {
      message: `A new job has been posted: ${jobListing.title}`,
      jobListing, // Optionally send job listing data
    });

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
    applications_count,
    providerId,
    posted_at,
    expires_at,
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
        applications_count,
        providerId,
        posted_at,
        expires_at,
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

module.exports = {
  createJobList,
  updateJoblist,
  deleteJoblist,
  getJoblist,
  getJoblists,
};
