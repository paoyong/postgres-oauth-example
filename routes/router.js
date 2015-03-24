var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/signin', function(req, res, next) {
    res.render('signin');
});

router.post('/signin', function(req, res, next) {
});

module.exports = router;
