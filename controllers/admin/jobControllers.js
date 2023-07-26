const factory = require("../handlerFactory");

exports.getAllJobs = factory.getAll("jobs");
exports.getJob = factory.getOne("jobs");
exports.addJob = factory.create("jobs");
exports.editJob = factory.edit("jobs");
exports.deleteJob = factory.deleteOne("jobs");
exports.uploadJobImage = factory.uploadImage("jobs");
exports.deleteJobPhoto = factory.deleteImage("jobs");
