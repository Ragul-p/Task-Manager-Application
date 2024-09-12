const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("../models/User.model");

const passportConfig = (passport) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "https://task-manager-application-68f8.onrender.com/auth/google/callback"
            },
            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value
                }

                try {
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        done(null, user);
                    } else {
                        user = await User.create(newUser);
                        done(null, user);
                    }

                } catch (error) {
                    console.error(error);
                }
            }
        )
    );

    

    passport.use(
        new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {

            const user = await User.findOne({ email: email });
            if (!user) { return done(null, false, { message: 'That email is not registered' }) }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) { return done(null, user); }
                else { return done(null, false, { message: 'Password incorrect' }) }
            });
        })
    );
    

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        try {
            const user = await User.findById(id).exec();
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
}



module.exports = passportConfig;