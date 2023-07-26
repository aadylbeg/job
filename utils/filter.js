exports.filters = (query, queryObj, Model, admin) => {
  var where = `FROM ${Model}`,
    compare = "";
  if (query.price) compare = compare + numFilter(query.price, "price");
  if (query.experience)
    compare = compare + numFilter(query.experience, "experience");

  if (query.keyword) {
    if (compare.length < 1) compare = searchFilter(query.keyword, Model);
    else compare = compare + " AND " + searchFilter(query.keyword, Model);
  }

  if (admin) {
    if (query.is_deleted || query.is_deleted == false)
      queryObj.is_deleted = query.is_deleted;
  } else queryObj.is_deleted = false;

  const conditions = Object.entries(queryObj)
    .map(([key, value]) => {
      return `${key} = '${value}'`;
    })
    .join()
    .split(",")
    .join(" AND ");

  if (conditions.length > 1 && compare.length > 1)
    where = `${where} WHERE ${conditions} AND ${compare}`;
  else if (conditions.length > 1 && compare.length < 1)
    where = `${where} WHERE ${conditions}`;
  else if (conditions.length < 1 && compare.length > 1)
    where = `${where} WHERE ${compare}`;

  return where;
};

function numFilter(queries, name) {
  var arr = [];

  for (var i of queries) {
    var operator = "=";

    if (i.includes("<")) {
      operator = "<";
      i = i.replace("<", "");
    } else if (i.includes(">")) {
      operator = ">";
      i = i.replace(">", "");
    }
    arr.push(`${name} ${operator} ${i}`);
  }

  return arr.join(" AND ");
}

function searchFilter(keyword, model) {
  if (model == "users")
    return `username LIKE '%${keyword}%' OR email LIKE '%${keyword}%'`;
  if (model == "categories") return `name LIKE '%${keyword}%'`;
  if (model == "jobs")
    return `name LIKE '%${keyword}%' OR note LIKE '%${keyword}%'`;
  if (model == "resumes")
    return `first_name LIKE '%${keyword}%' OR second_name LIKE '%${keyword}%' OR job_title LIKE '%${keyword}%' OR note LIKE '%${keyword}%' OR email LIKE '%${keyword}%'`;
}
