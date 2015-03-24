var express = require('express'),
    passport = require('passport'),
    Model = require('./model'),
    router = require('./routes/router.js'),
    app = express(),
    path = require('path'),
    PORT = process.env.PORT || 1337;

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
