const prisma = require("../../prismaClient");
const { emitJobPosted } = require("../notification/socket");

//create
const createJobList = async (req, res) => {
  const {
    title,
    description,
    requirements,
    preferredSkills,
    address,
    education,
    experience,
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
        address,
        education,
        experience,
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

    res.status(201).json(jobListing);
  } catch (error) {
    console.log(error);
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

//update
const updateJoblist = async (req, res) => {
  const { jobId } = req.params; // Job ID from URL parameters
  const {
    title,
    description,
    requirements,
    preferredSkills,
    address,
    education,
    experience,
    salary_range,
    posted_at,
    expires_at,
  } = req.body;

  const providerId = req.user?.id;

  try {
    if (req.user.role !== "Job Provider") {
      return res.status(403).json({
        error: "Access denied. Only Job Providers can update job listings.",
      });
    }

    const jobListing = await prisma.jobListing.findUnique({
      where: { id: Number(jobId) },
    });

    if (!jobListing) {
      return res.status(404).json({ error: "Job listing not found." });
    }

    if (jobListing.providerId !== providerId) {
      return res.status(403).json({
        error: "You are not authorized to update this job listing.",
      });
    }

    const updatedJobListing = await prisma.jobListing.update({
      where: { id: Number(jobId) },
      data: {
        title,
        description,
        requirements,
        preferredSkills,
        address,
        education,
        experience,
        salary_range,
        posted_at: new Date(posted_at),
        expires_at: new Date(expires_at),
      },
    });

    res.status(200).json(updatedJobListing);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//delete
const deleteJoblist = async (req, res) => {
  const { jobId } = req.params; // Job ID from URL parameters
  const providerId = req.user?.id;

  try {
    if (req.user.role !== "Job Provider") {
      return res.status(403).json({
        error: "Access denied. Only Job Providers can delete job listings.",
      });
    }

    const jobListing = await prisma.jobListing.findUnique({
      where: { id: Number(jobId) },
    });

    if (!jobListing) {
      return res.status(404).json({ error: "Job listing not found." });
    }

    if (jobListing.providerId !== providerId) {
      return res.status(403).json({
        error: "You are not authorized to delete this job listing.",
      });
    }

    await prisma.jobListing.delete({
      where: { id: Number(jobId) },
    });

    res.status(200).json({ message: "Job listing deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//get one
const getJobPost = async (req, res) => {
  try {
    const providerId = req.user.id;

    const jobPosts = await prisma.jobListing.findMany({
      where: {
        providerId: providerId,
      },
      select: {
        title: true,
        description: true,
        requirements: true,
        preferredSkills: true,
        address: true,
        education: true,
        experience: true,
        salary_range: true,
        posted_at: true,
        expires_at: true,
      },
    });

    res.json({ profile: req.user.profile, jobPosts });
  } catch (error) {
    console.error("Error retrieving job posts:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching job posts" });
  }
};

//job provider view  applicants their job posts
const getapplyjobpostsapplicants = async (req, res) => {
  const { jobId } = req.params;
  try {
    const applicants = await prisma.jobApplication.findMany({
      where: { jobId: parseInt(jobId) },
      include: { seeker: true },
    });
    res.status(200).json({ applicants });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ error: "Failed to fetch applicants" });
  }
};

module.exports = {
  createJobList,
  updateJoblist,
  deleteJoblist,
  getJobPost,
  getJoblists,
  getapplyjobpostsapplicants,
};
