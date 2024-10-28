const prisma = require("../../prismaClient");

//search job list
const serchlisting = async (req, res) => {
  const { title, location, salaryRange,preferredskills } = req.query;
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
          array_contains: preferredskills ? preferredskills.split(",") : [],  // Match skills within the requirements array
        },
      },
      include: true
      
    });
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching job listings" });
  }
};

//search job seeker
const searchCandidate = async (req, res) => {
  const { skills, experience, education, location, preferredJobTypes } =
    req.query;

  try {
    const jobs = await prisma.jobListing.findMany({
      where: {
        requirements: {
          array_contains: skills ? skills.split(",") : [],  // Match skills within the requirements array
        },
        location: {
          contains: location || "",
          mode: "insensitive",
        },
       
        education:{
          contains: education || "",
          mode: "insensitive",
        },

        requirements: {
          array_contains: experience ? experience.split(",") : [],  // Match skills within the requirements array
        },
        requirements: {
          array_contains: preferredJobTypes ? preferredJobTypes.split(",") : [],  // Match skills within the requirements array
        },
      },
      include: true
      
    });
    
    
    res.status(200).json(candidates);
  } catch (error) {
    console.error("Error searching candidates:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { serchlisting, searchCandidate };
