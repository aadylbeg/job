const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const { pool } = require("../../utils/dbTables");
const factory = require("../handlerFactory");

exports.addResume = factory.create("resumes");
exports.editResume = factory.edit("resumes");
exports.deleteResume = catchAsync(async (req, res, next) => {
  const resume = await pool.query(
    `SELECT * FROM resumes WHERE uuid = $1 AND user_id = ${req.user.id} AND is_deleted = false`,
    [req.params.uuid]
  );
  if (resume.rowCount < 1) return next(new AppError("Not Found", 404));

  await pool.query(
    `UPDATE resume SET is_deleted = true WHERE id = ${req.params.uuid} AND user_id = ${req.user.id} AND is_deleted = false`
  );
  return res.status(204).send();
});

exports.uploadResumeImage = factory.uploadImage("resumes");
exports.deleteResumePhoto = factory.deleteImage("resumes");
