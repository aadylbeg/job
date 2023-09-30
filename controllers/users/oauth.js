const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { pool } = require("./../../utils/dbTables");
const { v4 } = require("uuid");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `/google/callback`,
      // passReqToCallBack: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const user = await pool.query(
        "SELECT * from users WHERE email = $1 AND is_deleted = false",
        [profile._json.email]
      );
      if (user.rowCount > 0) return done(null, profile, req.user);
      else {
        var ins = `INSERT INTO users (uuid, username, email) VALUES ($1, $2, $3)`;
        await pool.query(ins, [v4(), profile._json.name, profile._json.email]);
        return done(null, profile);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
