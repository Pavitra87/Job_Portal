const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createJobApplication = async (req, res) => {
  const { cover_letter_url, portfolio_url } = req.body;
  const { jobId } = req.params;

  try {
    const applications = await prisma.jobApplication.create({
      data: {
        job_id: jobId,
        seeker_id: req.user.id,
        cover_letter_url,
        portfolio_url,
      },
    });
    res.status(200).send(applications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//getjobapplication job seeker only
const getJobApplication = async (req, res) => {
  //job seeker only
  const { id } = req.params;

  try {
    const getjobapplication = await prisma.jobApplication.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json({ getjobapplication });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get allgobapplication for job providers
const getJobApplications = async (req, res) => {
  try {
    const getjobapplications = await prisma.jobApplication.findMany();
    res.status(200).json({ getjobapplications });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createJobApplication,
  getJobApplication,
  getJobApplications,
};
