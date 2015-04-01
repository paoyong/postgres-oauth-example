var config           = require('./config.js'),
    LocalStrategy    = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy  = require('passport-twitter').Strategy,
    GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy,
    Model            = require('./model.js'),
    bcrypt           = require('bcrypt-nodejs'),
    User             = Model.User;

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
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
        console.log(profile);
        process.nextTick(function() {
            new Model.Facebook({ facebook_id: profile.id }).fetch().then(function(fbUser) {
                if (fbUser) {
                    // TODO: Handle case where there IS user, but no facebook user
                    return done(null, fbUser);
                } else {
                    // If there is no user found, then create one
                    new User().save().then(function(user) {
                        var newUserId = user.toJSON().id;

                        var newFBUser = {
                            id          : newUserId,
                            token       : token,
                            facebook_id : profile.id,
                            email       : profile.emails[0].value,
                            name        : profile.name.givenName + ' ' + profile.name.familyName
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

    passport.use(new TwitterStrategy({
        consumerKey    : config.twitterAuth.consumerKey,
        consumerSecret : config.twitterAuth.consumerSecret,
        callbackURL    : config.twitterAuth.callbackURL
    }, function(token, tokenSecret, profile, done) {
        process.nextTick(function() {
            new Model.Twitter({twitter_id: profile.id}).fetch().then(function(twUser) {
                if (twUser) {
                    return done(null, twUser);
                } else {
                    // Twitter user not found. Create a new one.
                    new User().save().then(function(user) {
                        var newUserId = user.toJSON().id;

                        var newTWUser = {
                            id           : newUserId,
                            token        : token,
                            twitter_id   : profile.id,
                            username     : profile.username,
                            display_name : profile.displayName
                        };

                        // Create new Facebook user with token.
                        new Model.Twitter(newTWUser).save({}, { method: 'insert' }).then(function(newlyMadeTWUser) {
                            return done(null, newTWUser);
                        });
                    });
                }
            });
        });
    }));

    passport.use(new GoogleStrategy({
        clientID     : config.googleAuth.clientID,
        clientSecret : config.googleAuth.clientSecret,
        callbackURL  : config.googleAuth.callbackURL
    }, function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            new Model.Google({google_id: profile.id}).fetch().then(function(goUser) {
                if (goUser) {
                    return done(null, goUser);
                } else {
                    Model.createNewUser(function(newUserId) {
                        var newGOUser = {
                            id           : newUserId,
                            token        : token,
                            google_id    : profile.id,
                            email        : profile.emails[0].value,
                            display_name : profile.displayName
                        };

                        new Model.Google(newGOUser).save({}, { method: 'insert' }).then(function(newlyMadeGOUser) {
                            return done(null, newGOUser);
                        });
                    });
                }
            });
        });
    }));
}
