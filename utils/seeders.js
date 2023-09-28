const { v4 } = require("uuid");
const { Pool } = require("pg");
require("dotenv").config({ path: ".env" });
const bcrypt = require("bcryptjs");

(async () => {
  try {
    const pool = new Pool({
      user: process.env.USER,
      host: process.env.HOST,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
    });

    password = await bcrypt.hash("admin", 12);
    await pool.query(
      "INSERT INTO admins (uuid, username, password) VALUES ($1, $2, $3)",
      [v4(), "admin", password]
    );
  } catch (err) {
    console.log(err);
    console.log(err.detail);
  }
  console.log("DB seeded");
  process.exit(1);
})();
