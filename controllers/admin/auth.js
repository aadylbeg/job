const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createSendToken } = require("../../utils/createSendToken");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const { pool } = require("../../utils/dbTables");
const { v4 } = require("uuid");

exports.protect = catchAsync(async (req, res, next) => {
  let token,
    auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer")) token = auth.split(" ")[1];
  if (!token) return next(new AppError("You are not logged in", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_ADMIN);

  const admin = await pool.query(
    `SELECT id, uuid, username, created_at FROM admins WHERE uuid = $1`,
    [decoded.id]
  );
  req.admin = admin.rows[0];
  next();
});

exports.signup = catchAsync(async (req, res, next) => {
  var { username, password } = req.body;

  var ins = "INSERT INTO admins (uuid, username, password) VALUES ($1, $2, $3)";

  password = await bcrypt.hash(password, 12);
  await pool.query(ins, [v4(), username, password]);

  const newSelect = "SELECT id, username from admins where username = $1";
  const newAdmin = await pool.query(newSelect, [username]);

  createSendToken("admin", newAdmin.rows[0], 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const select = "SELECT * from admins where username = $1";
  const user = await pool.query(select, [username]);

  if (
    !password ||
    user.rowCount < 1 ||
    !(await bcrypt.compare(password, user.rows[0].password))
  )
    return next(new AppError("Incorrect username or password", 401));

  createSendToken("admin", user.rows[0], 200, res);
});
