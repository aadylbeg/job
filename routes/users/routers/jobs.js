const express = require("express");
const jobs = require("../../../controllers/users/jobControllers");
const { uploadPhoto } = require("./../../../controllers/handlerFactory");
const router = express.Router();

router.post("/", jobs.addJob);
router.put("/:uuid", jobs.editJob);
router.delete("/:uuid", jobs.deleteJob);
router.put("/image/:uuid", uploadPhoto, jobs.uploadJobImage);
router.delete("/image/:uuid", jobs.deleteJobPhoto);

module.exports = router;
