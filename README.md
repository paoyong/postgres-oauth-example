#Postgres Oauth example
A demonstration of postgres oauth in node

## Installation
1. Git clone
2. Make sure you have postgres set up with user 'postgres' with password 'postgres'. So create the user with that password. To user another user, change the knex connection config in the code.
4. `postgres` user should have createdb priviledges. To do so: `ALTER USER postgres createdb` in psql. 
4. Run the .sql script into postgres. Usually by using
    postgres -U postgres -a -f psql_script.sql
