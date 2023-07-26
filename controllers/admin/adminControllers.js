const bcrypt = require("bcryptjs");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const { pool } = require("../../utils/dbTables");

exports.getMe = catchAsync(async (req, res, next) => {
  const admin = await pool.query(`SELECT * FROM admins WHERE uuid = $1`, [
    req.admin.uuid,
  ]);
  if (admin.rowCount < 1) return next(new AppError("Not Found", 404));
  return res.status(200).json(req.admin);
});

exports.createAdmin = catchAsync(async (req, res, next) => {
  var { username, password } = req.body;
  var ins = "INSERT INTO admins (username, password) VALUES ($1, $2)";

  password = await bcrypt.hash(password, 12);
  await pool.query(ins, [username, password]);

  const newSelect = "SELECT id, username from admins where username = $1";
  const newAdmin = await pool.query(newSelect, [username]);

  return res.status(200).send(newAdmin.rows[0]);
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const { username } = req.body;
  const admin = await pool.query(`SELECT * FROM admins WHERE uuid = $1`, [
    req.admin.uuid,
  ]);
  if (admin.rowCount < 1) return next(new AppError("Not Found", 404));

  const update = `UPDATE admins SET username = $1 WHERE id = ${req.admin.id}`;
  await pool.query(update, [username ? username : req.admin.username]);

  const updatedAdmin = await pool.query(
    `SELECT username FROM admins WHERE id = ${req.admin.id}`
  );
  return res.status(200).send(updatedAdmin.rows[0]);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const { password, newPassword } = req.body;
  if (!password || !newPassword)
    return next(new AppError("Invalid Credentials", 400));

  const admin = await pool.query(`SELECT * FROM admins WHERE uuid = $1`, [
    req.admin.uuid,
  ]);
  if (admin.rowCount < 1) return next(new AppError("Not found", 404));

  if (!(await bcrypt.compare(password, admin.rows[0].password)))
    return next(new AppError("Password is wrong", 401));

  const update = `UPDATE admins SET password = $1 WHERE id = ${req.admin.id}`;
  await pool.query(update, [await bcrypt.hash(newPassword, 12)]);

  return res.status(200).json({ msg: "Successfully Updated" });
});
