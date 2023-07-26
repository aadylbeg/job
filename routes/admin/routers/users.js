const express = require("express");
const users = require("../../../controllers/admin/userControllers");
const { uploadPhoto } = require("./../../../controllers/handlerFactory");
const router = express.Router();

router.get("/", users.getAllUsers);
router.get("/:uuid", users.getUser);
router.post("/", users.createUser);
router.put("/:uuid", users.updateUser);
router.patch("/:uuid", users.updateUsersPassword);
router.put("/image/:uuid", uploadPhoto, users.uploadUserPhoto);
router.delete("/image/:uuid", users.deleteUserPhoto);

module.exports = router;
