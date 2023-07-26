const APIFeatures = require("../utils/apiFeatutres");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const { v4 } = require("uuid");
const { pool } = require("../utils/dbTables");
const q = require("../utils/select");
const { createSendToken } = require("../utils/createSendToken");
const { createEduAndExper, ediEduAndExper } = require("../utils/eduAndExper");

exports.getAll = (Model, models) =>
  catchAsync(async (req, res, next) => {
    const owner = `${Model.slice(0, -1)}_id`;
    const query = new APIFeatures(Model, req.query, req.admin || null)
      .filter()
      .sort()
      .paginate()
      .limitFields();

    select = `${query.fields} ${query.where} ${query.order} ${query.limit}`;
    const datas = await pool.query(select);

    if (models) {
      for (var data of datas.rows) {
        for (var model of models) {
          const selectIn = q.inIsAdmin(model, owner, data.id, req.admin);
          const dataIn = await pool.query(selectIn);
          data[`${model}`] = dataIn.rows;
        }
      }
    }

    return res.status(200).send({ table: Model, datas: datas.rows });
  });

exports.getOne = (Model, models) =>
  catchAsync(async (req, res, next) => {
    const owner = `${Model.slice(0, -1)}_id`;

    var select = q.isAdmin(Model, req.admin);
    const data = await pool.query(select, [req.params.uuid]);
    if (data.rowCount < 1) return next(new AppError("Not Found", 404));

    if (models) {
      for (var model of models) {
        const selectIn = q.inIsAdmin(model, owner, data.rows[0].id, req.admin);
        const dataIn = await pool.query(selectIn);
        if (model == "resumes")
          for (var edu of dataIn.rows) {
            const ownerIn = `${model.slice(0, -1)}_id`;
            const selectEdu = q.eduIsAdmin(ownerIn, edu.id, req.admin);
            const dataEdu = await pool.query(selectEdu);
            edu["eduandexpers"] = dataEdu.rows;
          }
        data.rows[0][`${model}`] = dataIn.rows;
      }
    }
    return res.status(200).send(data.rows[0]);
  });

exports.create = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.body.category_uuid) {
      const select = q.isAdmin("categories", req.admin);
      const category = await pool.query(select, [req.body.category_uuid]);
      if (category.rowCount < 1) return next(new AppError("Not Found", 404));
    }
    if (Model == "users") {
      const user = await pool.query(
        "SELECT * from users WHERE username = $1 OR email = $2 AND is_deleted = false",
        [req.body.username, req.body.email]
      );
      if (user.rowCount > 0)
        return next(new AppError("Username, email or phone exists", 401));
    }

    const all = await q.insert(Model, req.body, req.user);
    var ins = `INSERT INTO ${Model} ${all.ins} VALUES ${all.val}`;
    await pool.query(ins, all.arr);

    const select = q.isAdmin(Model, req.admin);
    const data = await pool.query(select, [all.arr[0]]);
    var userId = req.user != null ? req.user.id : req.body.user_id;

    if (
      Model == "resumes" &&
      req.body.eduandexper &&
      data.rows[0].user_id == userId
    ) {
      data.rows[0].eduandexper = await createEduAndExper(
        req.body.eduandexper,
        data.rows[0]
      );
    }

    if (Model == "users" && !req.admin)
      createSendToken("user", data.rows[0], 200, res);
    else return res.status(200).send(data.rows[0]);
  });

exports.edit = (Model) => async (req, res, next) => {
  const select = q.isAdmin(Model, req.admin);
  const data = await pool.query(select, [req.params.uuid]);
  if (data.rowCount < 1) return next(new AppError("Not Found", 404));

  if (req.user) {
    const selectIn = `SELECT * FROM ${Model} WHERE uuid = $1 AND user_id = ${req.user.id} AND is_deleted = false`;
    const dataIn = await pool.query(selectIn, [req.params.uuid]);
    if (dataIn.rowCount < 1) return next(new AppError("Not Found", 404));
    req.body.is_deleted = false;
  }

  const all = await q.update(Model, req.body, data.rows[0], req.user);
  const set = `UPDATE ${Model} SET ${all.ins} WHERE id = ${data.rows[0].id}`;
  await pool.query(set, all.arr);

  var userId = req.user != null ? req.user.id : req.body.user_id;
  if (
    Model == "resumes" &&
    req.body.eduandexper &&
    data.rows[0].user_id == userId
  ) {
    await ediEduAndExper(req.body.eduandexper, data.rows[0], req.user);
  }

  const newData = await pool.query(select, [req.params.uuid]);
  return res.status(200).send(newData.rows[0]);
};

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const select = `SELECT * FROM ${Model} WHERE uuid = $1 AND is_deleted = false`;
    const update = `UPDATE ${Model} SET is_deleted = true WHERE uuid = $1`;

    const data = await pool.query(select, [req.params.uuid]);
    if (data.rowCount < 1) return next(new AppError("Not Found", 404));

    await pool.query(update, [req.params.uuid]);
    return res.status(204).send();
  });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadPhoto = upload.single("photo");

exports.uploadImage = (Model) =>
  catchAsync(async (req, res, next) => {
    const select = q.imgAdmin(Model, req.admin);
    var data = "";
    if (req.admin) data = await pool.query(select, [req.params.uuid]);
    else data = await pool.query(select, [req.params.uuid, req.user.id]);

    if (data.rowCount < 1) return next(new AppError("Not found ", 404));
    if (!req.file) return next(new AppError("Please provide Image", 404));

    if (data.rows[0].image != null)
      fs.unlink(`./public/${Model}/${data.rows[0].image}.webp`, (err) => {});

    const fileName = v4();
    await sharp(req.file.buffer)
      .toFormat("webp")
      .webp({ quality: 80 })
      .toFile(`./public/${Model}/${fileName}.webp`);

    await pool.query(
      `UPDATE ${Model} SET image = $1 WHERE id = ${data.rows[0].id}`,
      [fileName]
    );

    var newData = "";
    if (req.admin) newData = await pool.query(select, [req.params.uuid]);
    else newData = await pool.query(select, [req.params.uuid, req.user.id]);

    return res.status(200).send(newData.rows[0]);
  });

exports.deleteImage = (Model) =>
  catchAsync(async (req, res, next) => {
    const select = q.imgAdmin(Model, req.admin);
    var data = "";
    if (req.admin) data = await pool.query(select, [req.params.uuid]);
    else data = await pool.query(select, [req.params.uuid, req.user.id]);

    if (data.rowCount < 1) return next(new AppError("Not found ", 404));
    if (data.rows[0].image == null) return next(new AppError("No Image ", 400));

    await pool.query(`UPDATE ${Model} SET image = null WHERE uuid = $1`, [
      req.params.uuid,
    ]);

    fs.unlink(`./public/${Model}/${data.rows[0].image}.webp`, (err) => {
      if (err) return next(new AppError("Not found photo", 404));
    });

    return res.status(204).send();
  });
