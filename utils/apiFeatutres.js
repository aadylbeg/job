const { fieldsAll } = require("./fields");
const { filters } = require("./filter");

class APIFeatures {
  constructor(Model, queryString, admin) {
    this.where = `FROM ${Model}`;
    this.fields = "SELECT *";
    this.order = "";
    this.limit = "";
    this.Model = Model;
    this.admin = admin;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const exclude = ["schedule", "type", "education", "resume_id", "user_id"];
    for (let key in queryObj) if (!exclude.includes(key)) delete queryObj[key];

    this.where = filters(this.queryString, queryObj, this.Model, this.admin);
    return this;
  }

  sort() {
    if (this.queryString.sort_by && this.queryString.as) {
      this.order = `ORDER BY ${this.queryString.sort_by} ${this.queryString.as}`;
    } else this.order = `ORDER BY id DESC`;

    return this;
  }

  limitFields() {
    if (!this.admin) this.fields = `SELECT ${fieldsAll[this.Model]}`;
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;

    this.limit = `OFFSET ${skip} LIMIT ${limit}`;
    return this;
  }
}

module.exports = APIFeatures;
