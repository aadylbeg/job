const factory = require("../handlerFactory");

exports.getAllResumes = factory.getAll("resumes");
exports.getResume = factory.getOne("resumes");
exports.addResume = factory.create("resumes");
exports.editResume = factory.edit("resumes");
exports.deleteResume = factory.deleteOne("resumes");
exports.uploadResumeImage = factory.uploadImage("resumes");
exports.deleteResumePhoto = factory.deleteImage("resumes");
