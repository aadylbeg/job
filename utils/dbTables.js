const { Pool } = require("pg");

exports.pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
});

exports.createtables = async () => {
  const admins = {
    name: "admins",
    sin: `
    CREATE TABLE IF NOT EXISTS "admins" (
        "id" SERIAL,
        "uuid" UUID,
        "username" VARCHAR NOT NULL UNIQUE,
        "password" VARCHAR NOT NULL,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
    );`,
  };

  const users = {
    name: "users",
    sin: `
    CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL,
        "uuid" UUID,
        "username" VARCHAR NOT NULL,
        "password" VARCHAR,
        "email" VARCHAR NOT NULL,
        "phone_number" VARCHAR,
        "image" VARCHAR,
        "is_deleted" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
    );`,
  };

  const categories = {
    name: "categories",
    sin: `
    CREATE TABLE IF NOT EXISTS "categories" (
        "id" SERIAL,
        "uuid" UUID,
        "name" VARCHAR NOT NULL,
        "image" VARCHAR,
        "is_deleted" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
    );`,
  };

  const eduandexper = {
    name: "eduandexper",
    sin: `
    CREATE TABLE IF NOT EXISTS "eduandexper" (
        "id" SERIAL,
        "uuid" UUID,
        "type" VARCHAR,
        "name_organizations" VARCHAR NOT NULL,
        "location" VARCHAR NOT NULL,
        "period" JSONB NOT NULL,
        "resume_id" INTEGER,
        "is_deleted" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id"),
        FOREIGN KEY (resume_id) REFERENCES resumes(id),
        CONSTRAINT "valid_type" CHECK ("type" IN ('education', 'experience'))
    );`,
  };

  const jobs = {
    name: "jobs",
    sin: `
    CREATE TABLE IF NOT EXISTS "jobs" (
        "id" SERIAL,
        "uuid" UUID,
        "type" VARCHAR NOT NULL,
        "name" VARCHAR NOT NULL,
        "location" VARCHAR NOT NULL,
        "price" INTEGER,
        "schedule" VARCHAR NOT NULL,
        "experience" FLOAT,
        "education" VARCHAR,
        "phone_number" VARCHAR NOT NULL,
        "note" TEXT,
        "image" VARCHAR,
        "is_deleted" BOOLEAN DEFAULT false,
        "user_id" INTEGER NOT NULL,
        "category_id" INTEGER NOT NULL,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id"),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (category_id) REFERENCES categories(id),
        CONSTRAINT "valid_type" CHECK ("type" IN ('ish', 'ishchi'))
    );`,
  };

  const resumes = {
    name: "resumes",
    sin: `
    CREATE TABLE IF NOT EXISTS "resumes" (
        "id" SERIAL,
        "uuid" UUID,
        "first_name" VARCHAR NOT NULL,
        "second_name" VARCHAR NOT NULL,
        "location" VARCHAR NOT NULL,
        "birth_date" VARCHAR NOT NULL,
        "image" VARCHAR,
        "phone_number" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL,
        "job_title" VARCHAR NOT NULL,
        "price" INTEGER,
        "schedule" VARCHAR,
        "experience" FLOAT,
        "education" VARCHAR,
        "note" TEXT,
        "is_deleted" BOOLEAN DEFAULT false,
        "category_id" INTEGER,
        "user_id" INTEGER,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id"),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (category_id) REFERENCES categories(id)
    );`,
  };

  for (i of [admins, users, categories, jobs, resumes, eduandexper]) {
    await this.pool.query(i.sin).catch((error) => {
      console.error(i.name, error.stack);
    });
  }
};
