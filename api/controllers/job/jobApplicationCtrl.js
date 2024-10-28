const prisma = require("../../prismaClient");
const {emitJobApplied} = require("../notification/socket");

//create
const createJobApplication = async (req, res) => {
  const { jobId, seekerId, cover_letter_url, portfolio_url, applied_at } =
    req.body;
  try {
    const applications = await prisma.jobApplication.create({
      data: {
        jobId,
        seekerId,
        cover_letter_url,
        portfolio_url,
        applied_at,
      },
    });
    emitJobApplied(applications);
    res.status(200).send(applications);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

//getjobapplication job seeker only
const getJobApplication = async (req, res) => {
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

//update
const updateApllication = async (req, res) => {
  const { cover_letter_url, portfolio_url, applied_at } = req.body;
  const { id } = req.params;

  try {
    const updateapplication = await prisma.jobApplication.update({
      where: { id: Number(id) },
      data: {
        cover_letter_url,
        portfolio_url,
        applied_at,
      },
    });
    res.status(200).json(updateapplication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete
const deleteApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteapplication = await prisma.jobApplication.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(deleteapplication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {createJobApplication,getJobApplication, getJobApplications,updateApllication,deleteApplication};
