var DB = require('./db').DB;

var User = DB.Model.extend({
    tableName: 'users',
    idAttribute: 'username'
});

console.log(User);

module.exports = {
    User: User
};
