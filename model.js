var DB = require('./db').DB;

var User = DB.Model.extend({
    tableName: 'users',
    idAttribute: 'id'
});

var Facebook = DB.Model.extend({
    tableName: 'facebook',
    idAttribute: 'id'
});

var Twitter = DB.Model.extend({
    tableName: 'twitter',
    idAttribute: 'id'
});

var Google = DB.Model.extend({
    tableName: 'google',
    idAttribute: 'id'
});

module.exports = {
    User: User,
    Facebook: Facebook,
    Twitter: Twitter,
    Google: Google
};
