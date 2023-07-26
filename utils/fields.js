exports.fieldsAll = {
  admin: {
    edu: "id, uuid, type, name_organizations, location, period, is_deleted, created_at",
    categories: "id, uuid, name, image, is_deleted",
    jobs: "id, uuid, name, price, location, image, created_at, is_deleted",
    resumes:
      "id, uuid, first_name, second_name, image, job_title, location, is_deleted",
    users: "id, uuid, username, image, is_deleted",
    eduandexper:
      "id, uuid, uuid,  type,  name_organizations,  location,  period,  resume_id,  created_at",
  },
  edu: "id, uuid, type, name_organizations, location, period, created_at",
  categories: "id, uuid, name, image",
  jobs: "id, uuid, name, price, location, image, created_at",
  resumes: "id, uuid, first_name, second_name, image, job_title, location",
  users: "id, uuid, username, image",
  eduandexper:
    "id, uuid, uuid,  type,  name_organizations,  location,  period,  resume_id,  created_at",
};

exports.fieldsOne = {
  admin: {
    users:
      "id, uuid, username, email, phone_number, image, is_deleted, created_at",
    categories: "id, uuid, name, image, is_deleted, created_at",
    jobs: "id, uuid, type, name, location, price, schedule, experience, education, phone_number, note, image, category_id, user_id, is_deleted, created_at",
    resumes:
      "id, uuid, first_name, second_name, image, birth_date, phone_number, email, price, schedule, experience, education, note, job_title, location, is_deleted, user_id, created_at",
  },
  categories: "id, uuid, name, image, created_at",
  jobs: "id, uuid, type, name, location, price, schedule, experience, education, phone_number, note, image, category_id, user_id, created_at",
  resumes:
    "id, uuid, first_name, second_name, image, birth_date, phone_number, email, price, schedule, experience, education, note, job_title, location, user_id, created_at",
  users: "id, uuid, username, email, phone_number, image, created_at",
  eduandexper:
    "id, uuid, uuid,  type,  name_organizations,  location,  period,  resume_id,  created_at",
};
