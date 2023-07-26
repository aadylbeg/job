const fs = require("fs");
const sharp = require("sharp");
const factory = require("../handlerFactory");

exports.getAllCategories = factory.getAll("categories");
exports.getCategory = factory.getOne("categories");
exports.createCategory = factory.create("categories");
exports.editCategory = factory.edit("categories");
exports.deleteCategory = factory.deleteOne("categories");
exports.uploadCategoryImage = factory.uploadImage("categories");
exports.deleteCategoryPhoto = factory.deleteImage("categories");
