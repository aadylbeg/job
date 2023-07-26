const express = require("express");
const jobs = require("../../controllers/public/jobControllers");
const resumes = require("../../controllers/public/resumeControllers");
const users = require("../../controllers/public/userControllers");
const categories = require("../../controllers/public/categoryControllers");
const router = express.Router();

router.get("/categories", categories.getAllCategories);
router.get("/categories/:uuid", categories.getCategory);
router.get("/jobs", jobs.getAllJobs);
router.get("/jobs/:uuid", jobs.getJob);
router.get("/resumes", resumes.getAllResumes);
router.get("/resumes/:uuid", resumes.getResume);
router.get("/users", users.getAllUsers);
router.get("/users/:uuid", users.getUser);

module.exports = router;
