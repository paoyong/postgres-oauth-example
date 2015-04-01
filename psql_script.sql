drop database if exists oauth_test;

create database oauth_test;

\connect oauth_test;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS facebook;
DROP TABLE IF EXISTS twitter;
DROP TABLE IF EXISTS google;

CREATE TABLE IF NOT EXISTS users (
    id              SERIAL,
    username        VARCHAR(100),
    password        VARCHAR(100),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS facebook (
    id              SERIAL,
    token           TEXT NOT NULL,
    facebook_id     VARCHAR(100) UNIQUE,
    email           VARCHAR(100),
    name            VARCHAR(100),
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES users
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS twitter (
    id              SERIAL,
    token           VARCHAR(100) NOT NULL,
    twitter_id      VARCHAR(100) UNIQUE,
    display_name    VARCHAR(100),
    username        VARCHAR(100),
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES users
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS google (
    id              SERIAL,
    token           VARCHAR(100) NOT NULL,
    google_id       VARCHAR(100) UNIQUE,
    email           VARCHAR(100),
    name            VARCHAR(100),
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES users
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
