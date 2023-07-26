const fs = require("fs");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const { pool } = require("../../utils/dbTables");
const { v4 } = require("uuid");

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await pool.query(`SELECT * FROM users WHERE uuid = $1`, [
    req.user.uuid,
  ]);
  if (user.rowCount < 1) return next(new AppError("Not Found", 404));
  return res.status(200).json(req.user);
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const { email, username, phone_number } = req.body;
  const user = await pool.query(`SELECT * FROM users WHERE uuid = $1`, [
    req.user.uuid,
  ]);
  if (user.rowCount < 1) return next(new AppError("Not Found", 404));

  const check = `SELECT * FROM users WHERE username = $1 OR phone_number = $2 OR email = $3 AND id != ${req.user.id} AND is_deleted = false`;
  const checerUser = await pool.query(check, [username, phone_number, email]);
  if (checerUser.rowCount > 0)
    return next(new AppError("Username, email or phone is already taken", 400));

  const update = `UPDATE users SET username = $1, phone_number = $2, email = $3 WHERE id = ${req.user.id}`;
  await pool.query(update, [
    username ? username : req.user.username,
    phone_number ? phone_number : req.user.phone_number,
    email ? email : req.user.email,
  ]);

  const updatedUser = await pool.query(
    `SELECT username, email, phone_number FROM users WHERE id = ${req.user.id}`
  );
  return res.status(200).send(updatedUser.rows[0]);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const { password, newPassword } = req.body;
  if (!password || !newPassword)
    return next(new AppError("Invalid Credentials", 400));

  const user = await pool.query(`SELECT * FROM users WHERE uuid = $1`, [
    req.user.uuid,
  ]);
  if (user.rowCount < 1) return next(new AppError("Not found", 404));

  if (!(await bcrypt.compare(password, user.rows[0].password)))
    return next(new AppError("Password is wrong", 401));

  const update = `UPDATE users SET password = $1 WHERE id = ${req.user.id}`;
  await pool.query(update, [await bcrypt.hash(newPassword, 12)]);

  return res.status(200).json({ msg: "Successfully Updated" });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await pool.query(
    `SELECT * FROM users WHERE uuid = $1 AND is_deleted = false`,
    [req.user.uuid]
  );
  if (user.rowCount < 1) return next(new AppError("Not Found", 404));

  await pool.query(
    `UPDATE users SET is_deleted = true WHERE id = ${req.user.id}`
  );

  return res.status(204).send();
});

exports.uploadUserPhoto = catchAsync(async (req, res, next) => {
  const user = await pool.query(
    `SELECT * FROM users WHERE uuid = $1 AND is_deleted = false`,
    [req.user.uuid]
  );
  if (user.rowCount < 1) return next(new AppError("Not found ", 404));
  if (!req.file) return next(new AppError("Please provide Image", 404));
  const fileName = v4();

  await sharp(req.file.buffer)
    .toFormat("webp")
    .webp({ quality: 80 })
    .toFile(`./public/users/${fileName}.webp`);

  await pool.query(`UPDATE users SET image = $1 WHERE id = ${req.user.id}`, [
    fileName,
  ]);

  const userImage = await pool.query(
    `SELECT username, email, phone_number, image FROM users WHERE id = ${req.user.id} AND is_deleted = false`
  );

  return res.status(200).send(userImage.rows[0]);
});

exports.deleteUserPhoto = catchAsync(async (req, res, next) => {
  const user = await pool.query(
    `SELECT image FROM users WHERE uuid = $1 AND is_deleted = false`,
    [req.user.uuid]
  );
  if (user.rowCount < 1) return next(new AppError("Not found ", 404));

  await pool.query(`UPDATE users SET image = null WHERE id = ${req.user.id}`);
  fs.unlink(`./public/users/${user.rows[0].image}.webp`, (err) => {
    if (err) return next(new AppError("Not found photo", 404));
  });

  return res.status(204).send();
});
