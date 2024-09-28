const express = require("express");
const {
  createJobCategory,
  updateJobCategory,
  deleteCategory,
  getCategories,
} = require("../controllers/job/jobCategoryCtrl");
const router = express.Router();

router.post("/create", createJobCategory);
router.put("./:id", updateJobCategory);
router.delete("/:id", deleteCategory);
router.get("/", getCategories);


module.exports=router;
