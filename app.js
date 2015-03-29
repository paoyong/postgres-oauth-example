var config        = require('./config'),
    express       = require('express'),
    Model         = require('./model'),
    router        = require('./routes/router.js'),
    path          = require('path'),
    bcrypt        = require('bcrypt-nodejs'),
    passport      = require('passport'),
    session       = require('express-session'),
    bodyParser    = require('body-parser'),
    LocalStrategy = require('passport-local').Strategy,
    app           = express(),
    PORT          = process.env.PORT || config.port;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.use(session({ secret: 'hamster kitten fight' }))

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

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', router);

app.listen(PORT);
