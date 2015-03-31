var express = require('express'),
    router = express.Router(),
    passport = require('passport');

router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })
);

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })
);

module.exports = router;
