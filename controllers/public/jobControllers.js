const factory = require("../handlerFactory");

exports.getAllJobs = factory.getAll("jobs");
exports.getJob = factory.getOne("jobs");
