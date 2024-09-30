const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



//search job listing
const serchlisting = async (req, res) => {
    const { title, location, salaryRange,  preferredskills } =
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
          
          requirements: {
            array_contains: preferredskills
              ? JSON.stringify(preferredskills.split(","))
              : "",
          },
        },
        include: true,
      });
      console.log(jobs)
      res.status(200).json(jobs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching job listings" });
    }
  };

  module.exports={serchlisting}