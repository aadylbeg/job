const factory = require("../handlerFactory");

exports.getAllResumes = factory.getAll("resumes");
exports.getResume = factory.getOne("resumes", ["eduandexper"]);
