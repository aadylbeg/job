const express = require("express");
const resumes = require("../../../controllers/admin/resumeControllers");
const { uploadPhoto } = require("./../../../controllers/handlerFactory");
const router = express.Router();

router.get("/", resumes.getAllResumes);
router.get("/:uuid", resumes.getResume);
router.post("/", resumes.addResume);
router.put("/:uuid", resumes.editResume);
router.delete("/:uuid", resumes.deleteResume);
router.put("/image/:uuid", uploadPhoto, resumes.uploadResumeImage);
router.delete("/image/:uuid", resumes.deleteResumePhoto);

module.exports = router;
