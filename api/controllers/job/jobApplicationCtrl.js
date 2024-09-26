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


module.exports={createJobApplication}