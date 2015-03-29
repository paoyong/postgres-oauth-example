#Postgres Oauth example
A demonstration of postgres oauth in node. Heavily follows [this guide](https://scotch.io/tutorials/easy-node-authentication-setup-and-local) from scotch.io, except I use postgres in place of Mongo for the database, and Jade in place of EJS for the html views.

## Server-side Setup
This app requires a basic postgres setup. It also requires a lot of private Oauth application setup from Facebook, Twitter, and Google involving developer access to their Oauth services. This involves filling in `config.js`.

1. Git clone
2. Make sure you have postgres set up with user 'postgres' with password 'postgres'. So create the user with that password. To user another user, change the knex connection config in the code.
4. `postgres` user should have createdb priviledges. To do so: `ALTER USER postgres createdb` in psql. 
5. Run the `psql_script.sql` script into postgres. Try using
    `psql -U postgres -a -f psql_script.sql`.
6. Rename `sample_config.js` to `config.js`.
7. Fill in `config.js` file with appropriate dev API access tokens. scotch.io has some [great guides](https://scotch.io/tutorials/easy-node-authentication-facebook) on how to do this.
