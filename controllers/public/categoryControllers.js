const factory = require("../handlerFactory");

exports.getAllCategories = factory.getAll("categories");
exports.getCategory = factory.getOne("categories");
