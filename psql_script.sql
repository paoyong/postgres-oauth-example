drop database if exists oauth_test;

create database oauth_test;

\connect oauth_test;

drop table if exists users;

create table if not exists users (
    username varchar(100),
    password varchar(100),
    primary key (username)
);
