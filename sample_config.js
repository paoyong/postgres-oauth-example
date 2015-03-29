var port = 1337;

module.exports = {
    'port' : port,
    'facebookAuth' : {
        'clientID'      : '',
        'clientSecret'  : '',
        'callbackURL'   : 'http://localhost:' + port + '/auth/facebook/callback'
    },
    'twitterAuth' : {
        'consumerKey'   : '',
        'consumerSecret': '',
        'callbackURL'   : 'http://localhost:' + port + '/auth/twitter/callback'
    },
    'googleAuth' : {
        'clientID'      : '',
        'clientSecret'  : '',
        'callbackURL'   : 'http://localhost:' + port + '/auth/google/callback'
    }
};
