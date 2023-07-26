const bcrypt = require("bcryptjs");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const { pool } = require("../../utils/dbTables");
const factory = require("../handlerFactory");

exports.getAllUsers = factory.getAll("users");
exports.getUser = factory.getOne("users", ["resumes"]);
exports.createUser = factory.create("users");
exports.updateUser = factory.edit("users");
exports.updateUsersPassword = catchAsync(async (req, res, next) => {
  const { password, newPassword } = req.body;
  if (!password || !newPassword)
    return next(new AppError("Invalid Credentials", 400));

  const user = await pool.query(
    `SELECT id, password FROM users WHERE uuid = $1 AND is_deleted = false`,
    [req.params.uuid]
  );
  if (user.rowCount < 1) return next(new AppError("Not found", 404));

  if (!(await bcrypt.compare(password, user.rows[0].password)))
    return next(new AppError("Password is wrong", 401));

  const update = `UPDATE users SET password = $1 WHERE id = ${user.rows[0].id}`;
  await pool.query(update, [await bcrypt.hash(newPassword, 12)]);

  return res.status(200).json({ msg: "Successfully Updated" });
});

exports.uploadUserPhoto = factory.uploadImage("users");
exports.deleteUserPhoto = factory.deleteImage("users");
