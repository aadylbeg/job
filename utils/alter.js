const { Pool } = require("pg");
require("dotenv").config();

(async () => {
  const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
  });
  const alterTableSql = "ALTER TABLE eduandexper DROP COLUMN IF EXISTS image";
  // DROP COLUMN IF EXISTS
  // ADD image VARCHAR
  pool.query(alterTableSql, (err, result) => {
    if (err) return console.error("Error acquiring client", err);
    else console.log("Table altered successfully!");
    process.exit();
  });
})();
