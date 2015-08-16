var config        = require('./config'),
    express       = require('express'),
    Model         = require('./model'),
    router        = require('./routes/router.js'),
    auth          = require('./routes/auth.js'),
    path          = require('path'),
    bcrypt        = require('bcrypt-nodejs'),
    passport      = require('passport'),
    session       = require('express-session'),
    bodyParser    = require('body-parser'),
    app           = express(),
    PORT          = process.env.PORT || config.port;

require('./passport.js')(passport);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({ 
    resave: true,
    saveUninitialized: true,
    secret: 'hamster kitten fight' 
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', router);
app.use('/auth', auth);

app.listen(PORT);
