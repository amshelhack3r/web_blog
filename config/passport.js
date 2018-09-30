const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
        User.findOne({
                email
            })
            .then(user => {
                if (!user) {
                    return done(null, false, {
                        message: 'Email not found.'
                    });
                }
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, {
                            message: "Incorrect password"
                        })
                    }
                })
            })
            .catch(err => {
                return done(err);
            })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

}