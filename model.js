var DB = require('./db').DB;

var User = DB.Model.extend({
    tableName: 'users',
    idAttribute: 'id',
    Facebook: function() {
        return this.hasOne(Facebook, 'id');
    },
    Twitter: function() {
        return this.hasOne(Twitter, 'id');
    },
    Google: function() {
        return this.hasOne(Google, 'id');
    }
});

var Facebook = DB.Model.extend({
    tableName: 'facebook',
    idAttribute: 'id',
    User: function() {
        return this.belongsTo(User, 'id');
    }
});

var Twitter = DB.Model.extend({
    tableName: 'twitter',
    idAttribute: 'id',
    User: function() {
        return this.belongsTo(User, 'id');
    }
});

var Google = DB.Model.extend({
    tableName: 'google',
    idAttribute: 'id',
    User: function() {
        return this.belongsTo(User, 'id');
    }
});

module.exports = {
    User: User,
    Facebook: Facebook,
    Twitter: Twitter,
    Google: Google
};
