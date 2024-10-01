const router = require('express').Router();
const {createJobCategory,updateJobCategory,deleteCategory, getCategories} = require("../controllers/job/jobCategoryCtrl");


router.post("/create", createJobCategory);

router.put("./:id", updateJobCategory);

router.delete("/:id", deleteCategory);

router.get("/", getCategories);


module.exports=router;
