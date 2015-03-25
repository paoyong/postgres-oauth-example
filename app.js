var express = require('express'),
    Model = require('./model'),
    router = require('./routes/router.js'),
    app = express(),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    PORT = process.env.PORT || 1337;

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

var usernamePromise = new Model.User({username: 'keithy'}).fetch();

usernamePromise.then(function(model) {
    if (model) {
        console.log(model);
    } else {
        console.log('Username not found.');
    }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', router);

app.listen(PORT);
