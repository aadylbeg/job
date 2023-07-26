const express = require("express");
const jobs = require("../../../controllers/admin/jobControllers");
const { uploadPhoto } = require("./../../../controllers/handlerFactory");
const router = express.Router();

router.get("/", jobs.getAllJobs);
router.get("/:uuid", jobs.getJob);
router.post("/", jobs.addJob);
router.put("/:uuid", jobs.editJob);
router.delete("/:uuid", jobs.deleteJob);
router.put("/image/:uuid", uploadPhoto, jobs.uploadJobImage);
router.delete("/image/:uuid", jobs.deleteJobPhoto);

module.exports = router;
