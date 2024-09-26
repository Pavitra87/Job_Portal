const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//create
const createJobList = async (req, res) => {
  //provider
  const {
    title,
    description,
    requirements,
    preferred_skills,
    location,
    salary_range,
    expires_at,
    categoryIds,
  } = req.body;

  try {
    const jobListing = await prisma.jobListing.create({
      data: {
        provider_id: req.user.id,
        title,
        description,
        requirements,
        preferred_skills,
        location,
        salary_range,
        expires_at,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
    });

    res.status(201).json(jobListing);
  } catch (error) {
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
    preferred_skills,
    location,
    salary_range,
    expires_at,
  } = req.body;

  try {
    const updatejoblist = await prisma.jobListing.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        requirements,
        preferred_skills,
        location,
        salary_range,
        expires_at,
      },
    });
    res.status(201).json(updatejoblist);
  } catch (error) {
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
    const getjoblists = await prisma.jobListing.findMany({});
    res.status(201).json(getjoblists);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

//search job listing
const serchlisting = async (req, res) => {
  const { title, location, salaryRange, categories, preferredskills } =
    req.query;
  try {
    const jobs = await prisma.jobListing.findMany({
      where: {
        title: {
          contains: title || "",
          mode: "insensitive",
        },
        location: {
          contains: location || "",
          mode: "insensitive",
        },
        salary_range: {
          contains: salaryRange || "",
          mode: "insensitive",
        },
        categories: {
          some: {
            name: {
              in: categories ? categories.split(",") : [],
            },
          },
        },
        requirements: {
          contains: preferredskills
            ? JSON.stringify(preferredskills.split(","))
            : "",
        },
      },
      include: true,
    });
    res.status(200).json({ jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching job listings" });
  }
};
module.exports = {
  createJobList,
  updateJoblist,
  deleteJoblist,
  getJoblist,
  getJoblists,
  serchlisting
};
