const express = require("express");
const session = require("express-session");
const passport = require("passport");
const AppError = require("./utils/appError");
const cors = require("cors");
const { giveToken } = require("./controllers/users/auth");
require("./controllers/users/oauth");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

require("./utils/dbTables").createtables();
app.use("/api/admins", require("./routes/admin/admin"));
app.use("/api/public", require("./routes/public/publicRouters"));
app.use("/api/users", require("./routes/users/users"));

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/getToken",
    failureRedirect: "/auth/failure",
  })
);

app.get("/getToken", giveToken);

app.use("/auth/failure", (req, res) => {
  res.send("Sth went wrong...");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(require("./controllers/errController"));

module.exports = app;

// sequelize-auto -h 127.0.0.1 -d scrapytmcars -u adilbek -x 123456 --dialect postgres
