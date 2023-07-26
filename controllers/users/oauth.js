const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AppError = require("../../utils/appError");
const { pool } = require("./../../utils/dbTables");
const { v4 } = require("uuid");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "91391899648-10c2eons4ihg16a2oe6jn5u33ejd21s8.apps.googleusercontent.com",
      clientSecret: "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",
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
