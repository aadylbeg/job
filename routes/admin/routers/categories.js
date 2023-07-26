const express = require("express");
const categories = require("./../../../controllers/admin/categoryControllers");
const { uploadPhoto } = require("./../../../controllers/handlerFactory");
const router = express.Router();

router.get("/", categories.getAllCategories);
router.get("/:uuid", categories.getCategory);
router.post("/", categories.createCategory);
router.put("/:uuid", categories.editCategory);
router.delete("/:uuid", categories.deleteCategory);
router.put("/image/:uuid", uploadPhoto, categories.uploadCategoryImage);
router.delete("/image/:uuid", categories.deleteCategoryPhoto);

module.exports = router;
