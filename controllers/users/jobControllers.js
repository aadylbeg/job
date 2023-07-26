const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const { pool } = require("../../utils/dbTables");
const factory = require("../handlerFactory");

exports.addJob = factory.create("jobs");
exports.editJob = factory.edit("jobs");
exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = await pool.query(
    `SELECT * FROM jobs WHERE id = ${req.params.uuid} AND user_id = ${req.user.id} AND is_deleted = false`
  );
  if (job.rowCount < 1) return next(new AppError("Not Found", 404));

  await pool.query(
    `UPDATE jobs SET is_deleted = true WHERE id = ${req.params.uuid} AND user_id = ${req.user.id}`
  );
  return res.status(204).send();
});

exports.uploadJobImage = factory.uploadImage("jobs");
exports.deleteJobPhoto = factory.deleteImage("jobs");
