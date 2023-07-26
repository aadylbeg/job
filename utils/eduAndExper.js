const { v4 } = require("uuid");
const { pool } = require("./dbTables");
const { isAdmin } = require("./select");

exports.createEduAndExper = async (body, resume) => {
  var all = [];
  for (b of body) {
    const ins = `INSERT INTO eduandexper (uuid, type, name_organizations, location, period, resume_id) VALUES($1, $2, $3, $4, $5, $6)`;
    const val = [v4(), b.type, b.organization, b.location, b.period, resume.id];
    await pool.query(ins, val);

    const select = isAdmin("eduandexper", null);
    const data = await pool.query(select, [val[0]]);
    all.push(data.rows[0]);
  }

  return all;
};

exports.ediEduAndExper = async (body, resume) => {
  for (b of body) {
    if (b.delete) deleteEdu(b.delete);
    if (b.edit) editEdu(b.edit);
    if (b.new) newEdu(b.new, resume);
  }
};

async function deleteEdu(body) {
  for (uuid of body) {
    await pool.query(
      `UPDATE eduandexper SET is_deleted = true WHERE uuid = $1`,
      [uuid]
    );
  }
}

async function editEdu(body) {
  for (var all of body) {
    const select = isAdmin("eduandexper", null);
    const data = await pool.query(select, [all.uuid]);
    await pool.query(
      `UPDATE eduandexper SET name_organizations = $1, location = $2, period = $3 WHERE uuid = $4`,
      [
        all.organization || data.rows[0].name_organizations,
        all.location || data.rows[0].location,
        all.period || data.rows[0].period,
        all.uuid,
      ]
    );
  }
}

async function newEdu(body, resume) {
  for (b of body) {
    const ins = `INSERT INTO eduandexper (uuid, type, name_organizations, location, period, resume_id) VALUES($1, $2, $3, $4, $5, $6)`;
    const val = [v4(), b.type, b.organization, b.location, b.period, resume.id];
    await pool.query(ins, val);
  }
}
