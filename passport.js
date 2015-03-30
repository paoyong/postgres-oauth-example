var config           = require('./config.js'),
    LocalStrategy    = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    Model            = require('./model.js'),
    bcrypt           = require('bcrypt-nodejs'),
    User             = Model.User;

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        console.log('Serializing user ' + user.id);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        console.log('Deserializing user ' + id);

        Model.grabUserCredentials(id, function(err, user) {
            done(err, user);
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
                    return done(null, false, { message: 'Invalid password' });
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
            new Model.Facebook({ facebook_id: profile.id }).fetch().then(function(fbUser) {
                if (fbUser) {
                    // TODO: Handle case where there IS user, but no facebook user
                    console.log(fbUser);
                    return done(null, fbUser);
                } else {
                    // If there is no user found, then create one
                    new User().save().then(function(user) {
                        var newUserId = user.toJSON().id;

                        var newFBUser = {
                            id: newUserId,
                            token: token,
                            facebook_id: profile.id,
                            email: profile.emails[0].value,
                            name: profile.name.givenName + ' ' + profile.name.familyName
                        };

                        // Create new Facebook user with token.
                        new Model.Facebook(newFBUser).save({}, { method: 'insert' }).then(function(facebook) {
                            return done(null, newFBUser);
                        });
                    });
                }
            });
        });
    }));
}
