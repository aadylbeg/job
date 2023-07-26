const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createSendToken } = require("../../utils/createSendToken");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const { pool } = require("../../utils/dbTables");
const factory = require("../handlerFactory");

exports.protect = catchAsync(async (req, res, next) => {
  let token,
    auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer")) token = auth.split(" ")[1];
  if (!token) return next(new AppError("You are not logged in", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await pool.query(
    `SELECT id, uuid, username, email, phone_number, image, created_at FROM users WHERE uuid = $1 AND is_deleted = false`,
    [decoded.id]
  );
  if (user.rowCount < 1) return next(new AppError("Do not have token", 404));

  req.user = user.rows[0];
  next();
});

exports.signup = factory.create("users");

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const select =
    "SELECT * FROM users WHERE username = $1 AND is_deleted = false";
  const user = await pool.query(select, [username]);

  if (
    !password ||
    user.rowCount < 1 ||
    !(await bcrypt.compare(password, user.rows[0].password))
  )
    return next(new AppError("Incorrect username or password", 401));

  createSendToken("user", user.rows[0], 200, res);
});

exports.giveToken = catchAsync(async (req, res, next) => {
  const select = "SELECT * FROM users WHERE email = $1 AND is_deleted = false";
  const user = await pool.query(select, [req.user._json.email]);
  createSendToken("user", user.rows[0], 200, res);
});
