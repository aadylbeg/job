require("dotenv").config({ path: ".env" });

const server = require("./app").listen(process.env.PORT, async () => {
  console.log(`Connected and listening on port ${process.env.PORT}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
