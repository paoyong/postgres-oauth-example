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
        res.render('index');
    }
});

router.get('/signin', function(req, res, next) {
    res.render('signin', { title: 'Sign In' });
});

// Add user to database.
router.post('/signin', function(req, res, next) {
    console.log('Signing in user!');

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
    console.log('Signup route');
    console.log(req.body);
    var user = req.body;
});

module.exports = router;
