var express = require('express');
var router = express.Router();
var passport = require('passport');

// Used to encrypt user password before adding it to db.
var bcrypt = require('bcrypt-nodejs');

// Bookshelf postgres db ORM object. Basically it makes 
// it simple and less error port to insert/query the db.
var Model = require('../model.js');

router.get('/', function(req, res, next) {

    // If user is not authenticated, redirect them
    // to the signin page.
    if (!req.isAuthenticated()) {
        res.redirect('/signin');
    } else {
        var user = req.user;

        if (user !== undefined) {
            user = user.toJSON();
            console.log(user);
        }

        res.render('index', {title: 'Oauth Test', user: user});
    }
});

router.get('/signin', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('signin', { title: 'Sign In' });
    }
});

// Add user to database.
router.post('/signin', function(req, res, next) {
    passport.authenticate('local', {
                         successRedirect: '/',
                         failureRedirect: '/signin'
    }, function(err, user, info) {
        if (err) {
            return res.render('signin', { title: 'Sign In', errorMessage: err.message });
        }

        if (!user) {
            return res.render('signin', { title: 'Sign In', errorMessage: info.message });
        }

        return req.logIn(user, function(err) {
            if (err) {
                return res.render('signin', { title: 'Sign In', errorMessage: err.message });
            } else {
                return res.redirect('/');
            }
        });
    })(req, res, next);
});

router.get('/signup', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('signup', { title: 'Sign Up' });
    }
});

router.post('/signup', function(req, res, next) {
    // Here, req.body is { username, password }
    var user = req.body;

    // Before making the account, try and fetch a username to see if it already exists.
    var usernamePromise = new Model.User({ username: user.username }).fetch();

    return usernamePromise.then(function(model) {
        if (model) {
            res.render('signup', { title: 'signup', errorMessage: 'username already exists' });
        } else {
            var password = user.password;
            var hash = bcrypt.hashSync(password);

            // Make a new postgres db row of the account
            var signUpUser = new Model.User({ username: user.username, password: hash });
            console.log(signUpUser);

            signUpUser.save({}, {method: 'insert'}).then(function(model) {
                // Sign in the newly registered uesr
                res.redirect(307, '/signin');
            });
        }
    });
});

router.get('/signout', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/', { errorMessage: 'You are not logged in' });
    } else {
        req.logout();
        res.redirect('/signin');
    }
});

module.exports = router;
