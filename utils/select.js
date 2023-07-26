const bcrypt = require("bcryptjs");
const { v4 } = require("uuid");
const { fieldsOne, fieldsAll } = require("./fields");
const { pool } = require("./dbTables");
const AppError = require("./appError");

exports.isAdmin = (Model, admin) => {
  var select = `SELECT ${
    fieldsOne[`${Model}`]
  } FROM ${Model} WHERE uuid = $1 AND is_deleted = false`;

  if (admin) {
    select = `SELECT ${
      fieldsOne.admin[`${Model}`]
    } FROM ${Model} WHERE uuid = $1`;
  }

  return select;
};

exports.inIsAdmin = (model, owner, id, admin) => {
  var select = `SELECT ${
    fieldsAll[`${model}`]
  } FROM ${model} WHERE ${owner} = ${id} AND is_deleted = false`;
  if (admin)
    select = `SELECT ${
      fieldsAll.admin[`${model}`]
    } FROM ${model} WHERE ${owner} = ${id}`;

  return select;
};

exports.eduIsAdmin = (owner, id, admin) => {
  var select = `SELECT ${fieldsAll.edu} FROM eduandexper WHERE ${owner} = ${id} AND is_deleted = false`;
  if (admin)
    select = `SELECT ${fieldsAll.admin.edu} FROM eduandexper WHERE ${owner} = ${id}`;

  return select;
};

exports.imgAdmin = (Model, admin) => {
  var select = `SELECT ${
    fieldsOne.admin[`${Model}`]
  } FROM ${Model} WHERE uuid = $1`;

  if (!admin) {
    select = `SELECT ${
      fieldsOne[`${Model}`]
    } FROM ${Model} WHERE uuid = $1 AND is_deleted = false AND user_id = $2`;
  }

  return select;
};

exports.insert = async (Model, b, user) => {
  if (Model == "jobs") {
    const cat = await pool.query(this.isAdmin("categories"), [b.category_uuid]);
    return {
      ins: `(uuid, type, name, location, price, schedule, experience, education, phone_number, note, user_id, category_id)`,
      val: `($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      arr: [
        v4(),
        b.type,
        b.name,
        b.location,
        b.price,
        b.schedule,
        b.experience,
        b.education,
        b.phone_number,
        b.note,
        b.user_id || user.id,
        cat.rows[0].id,
      ],
    };
  } else if (Model == "categories") {
    return { ins: `(uuid, name)`, val: `($1, $2)`, arr: [v4(), b.name] };
  } else if (Model == "resumes") {
    const cat = await pool.query(this.isAdmin("categories"), [b.category_uuid]);
    return {
      ins: `(uuid, first_name, second_name, location, birth_date, phone_number, email, job_title, price, schedule,
      experience, education, note, user_id, category_id)`,
      val: `($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      arr: [
        v4(),
        b.first_name,
        b.second_name,
        b.location,
        b.birth_date,
        b.phone_number,
        b.email,
        b.job_title,
        b.price,
        b.schedule,
        b.experience,
        b.education,
        b.note,
        b.user_id || user.id,
        cat.rows[0].id,
      ],
    };
  } else if (Model == "users") {
    var password = await bcrypt.hash(b.password, 12);
    return {
      ins: `(uuid, username, password, phone_number, email)`,
      val: `($1, $2, $3, $4, $5)`,
      arr: [v4(), b.username, password, b.phone_number, b.email],
    };
  }
};

exports.update = async (Model, b, data, user) => {
  if (b.category_uuid) {
    var cat = await pool.query(this.isAdmin("categories"), [b.category_uuid]);
    b.category_id = cat.rows[0].id;
  }

  if (Model == "jobs") {
    return {
      ins: "type=$1, name=$2, price=$3, schedule=$4, experience=$5, education=$6, phone_number=$7, note=$8, location=$9, category_id=$10, is_deleted=$11",
      arr: [
        b.type || data.type,
        b.name || data.name,
        b.price || data.price,
        b.schedule || data.schedule,
        b.experience || data.experience,
        b.education || data.education,
        b.phone_number || data.phone_number,
        b.note || data.note,
        b.location || data.location,
        b.category_id || data.category_id,
        b.is_deleted || b.is_deleted == false ? b.is_deleted : data.is_deleted,
      ],
    };
  } else if (Model == "categories") {
    return {
      ins: "name = $1, is_deleted = $2",
      arr: [
        b.name || data.name,
        b.is_deleted || b.is_deleted == false ? b.is_deleted : data.is_deleted,
      ],
    };
  } else if (Model == "resumes") {
    return {
      ins: `first_name=$1, second_name=$2, location=$3, birth_date=$4, phone_number=$5, email=$6, job_title=$7, price=$8, schedule=$9, experience=$10, education=$11, note=$12, category_id=$13, is_deleted=$14`,
      arr: [
        b.first_name || data.first_name,
        b.second_name || data.second_name,
        b.location || data.location,
        b.birth_date || data.birth_date,
        b.phone_number || data.phone_number,
        b.email || data.email,
        b.job_title || data.job_title,
        b.price || data.price,
        b.schedule || data.schedule,
        b.experience || data.experience,
        b.education || data.education,
        b.note || data.note,
        b.category_id || data.category_id,
        b.is_deleted || b.is_deleted == false ? b.is_deleted : data.is_deleted,
      ],
    };
  } else if (Model == "users") {
    return {
      ins: "username = $1, phone_number = $2, email = $3, is_deleted = $4",
      arr: [
        b.username || data.username,
        b.phone_number || data.phone_number,
        b.email || data.email,
        b.is_deleted || b.is_deleted == false ? b.is_deleted : data.is_deleted,
      ],
    };
  }
};
