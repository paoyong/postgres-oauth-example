var DB = require('./db').DB,
    knex = DB.knex;

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


// -----------------------------------
// grabUserCredentials
// -----------------------------------
// Returns a JSON list of a single user like this:
// {
//     local: {
//          username: 'sampleun'
//          password: 'samplepw'
//     },
//     facebook: {
//          ...
//     },
//     twitter: {
//          ...
//     },
//     google: {
//          ...
//     },
// }
function grabUserCredentials(userId, callback) {
    console.log('calling grabUserCredentials on user ' + userId);

    // Skeleton JSON
    var loginUser = {
        local: {
            username: null,
            password: null,
        },
        facebook: {
            id: userId,
            token: null,
            email: null,
            name: null,
        },
        twitter: {
            id: userId, 
            token: null,
            displayName: null,
            username: null,
        },
        google: {
            id: userId,
            token: null,
            email: null,
            name: null,
        }
    };

    // SQL joins to get all credentials/tokens of a single user
    // to fill in loginUser JSON.
    knex.select('users.id', 'users.username', 'users.password',
                'facebook.token as fb_token', 'facebook.email as fb_email', 'facebook.name as fb_name',
                'twitter.token as tw_token', 'twitter.display_name as tw_disp_name', 'twitter.username as tw_username',
                'google.token as g_token', 'google.email as g_email', 'google.name as g_name')
                .from('users')
                .leftOuterJoin('facebook', 'facebook.id', '=', 'users.id')
                .leftOuterJoin('twitter', 'twitter.id', '=', 'facebook.id')
                .leftOuterJoin('google', 'google.id', '=', 'twitter.id')
                .where('users.id', '=', userId).then(function(row) {
        row = row[0];

        if (!row) {
            callback('Could not find user with that ID', null);
        } else {
            // We only want the first result of the query.
            
            // Fill in loginUser JSON
            loginUser.local.username = row.username;
            loginUser.local.password = row.password;
            loginUser.facebook.token = row.fb_token;
            loginUser.facebook.email = row.fb_email;
            loginUser.facebook.name = row.fb_name;
            loginUser.twitter.token = row.tw_token;
            loginUser.twitter.displayName = row.tw_disp_name;
            loginUser.twitter.username = row.tw_username;
            loginUser.google.token = row.g_token;
            loginUser.google.email = row.g_email;
            loginUser.google.name = row.g_name;

            console.log('Successful grabUserCredentials');
            callback(null, loginUser);
        }
    });
};

module.exports = {
    grabUserCredentials: grabUserCredentials,
    User: User,
    Facebook: Facebook,
    Twitter: Twitter,
    Google: Google
};
