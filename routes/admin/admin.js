const express = require("express");
const { signup, login, protect } = require("../../controllers/admin/auth");
const admin = require("./../../controllers/admin/adminControllers");
const router = express.Router();

router.post("/sign-up", signup);
router.post("/login", login);

router.use(protect);
router.get("/get-me", admin.getMe);
router.post("/create-admin", admin.createAdmin);
router.put("/update-me", admin.updateMe);
router.put("/update-my-password", admin.updateMyPassword);

router.use("/categories", require("./routers/categories"));
router.use("/jobs", require("./routers/jobs"));
router.use("/resumes", require("./routers/resumes"));
router.use("/users", require("./routers/users"));

module.exports = router;
