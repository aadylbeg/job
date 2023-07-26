const express = require("express");
const { signup, login, protect } = require("../../controllers/users/auth");
const user = require("../../controllers/users/userControllers");
const { uploadPhoto } = require("./../../controllers/handlerFactory");
const router = express.Router();

// router.post("/sign-up", signup);
// router.post("/login", login);

router.use(protect);
router.get("/get-me", user.getMe);
router.put("/update-me", user.updateMe);
router.put("/update-my-password", user.updateMyPassword);
router.put("/upload-my-image", uploadPhoto, user.uploadUserPhoto);
router.delete("/delete-my-image", user.deleteUserPhoto);
router.delete("/delete-me", user.deleteMe);

router.use("/jobs", require("./routers/jobs"));
router.use("/resumes", require("./routers/resumes"));

module.exports = router;
