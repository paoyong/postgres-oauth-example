var config           = require('./config.js'),
    LocalStrategy    = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    Model            = require('./model.js'),
    bcrypt           = require('bcrypt-nodejs'),
    User             = Model.User;

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
        new Model.User({username: username}).fetch().then(function(user) {
            done(null, user);
        });
    });

    passport.use(new LocalStrategy(function(username, password, done) {
        new Model.User({username: username}).fetch().then(function(data) {
            var user = data;
            if (user === null) {
                return done(null, false, { message: 'Invalid username or password' });
            } else {
                user = data.toJSON();

                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, { message: 'Invalid username or password' });
                } else {
                    return done(null, user);
                }
            }
        });
    }));

    passport.use(new FacebookStrategy({
        clientID        : config.facebookAuth.clientID,
        clientSecret    : config.facebookAuth.clientSecret,
        callbackURL     : config.facebookAuth.callbackURL
    }, function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            new Model.Facebook({ facebook_id: profile.id }).fetch().then(function(user) {
                if (user) {
                    return done(null, user);
                } else {
                    // If there is no user found, then create one
                    new User().save().then(function(user) {
                        console.log(user.toJSON());
                    });
                }
            });
        });
    }));
}
