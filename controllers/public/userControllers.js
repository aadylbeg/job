const factory = require("../handlerFactory");

exports.getAllUsers = factory.getAll("users");
exports.getUser = factory.getOne("users", ["resumes"]);
