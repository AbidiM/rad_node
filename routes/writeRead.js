'use strict';
const express = require('express');
const crRoute = express.Router();

const connection = require('../db');


crRoute.post('/signup', function (req, res, next) {

    console.log(req.params.name + " + " + req.params.email + " + " + req.params.password);

    connection.execute(`INSERT INTO users 
    (username, email, password) 
    VALUES (?, ?, ?);`,
        [req.params.name, req.params.email, req.params.password])
        .then(() => {
            console.log('ok');
        }).catch((err) => {
            console.log(err);
        });
    res.end();
});

crRoute.get('/login', function (req, res, next) {

    console.log(req.params.email + " + " + req.params.password);
    connection.execute('SELECT * FROM users WHERE email = ? AND password = ?;', [req.params.email, req.params.password])
        .then((result) => {
            var rawData = result[0];
            console.log(rawData);
            res.send(JSON.stringify(rawData));
        }).catch((err) => {
            console.log(err);
            res.end();
        });
});
crRoute.post('/check', function (req, res, next) {


    console.log(req.query.email);
    console.log(req.body);
    console.log(req.body.email);
    console.log(req.params);
    console.log(req.params.email);


    connection.execute('SELECT * FROM users WHERE email=?;',
        [req.query.email])
        .then((result) => {
            var data = result[0];
            console.log(res);
            if (data.length === 0) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        }).catch((err) => {
            console.log(err);
            res.sendStatus(404);
        });
});

crRoute.use('/', function (req, res, next) {
    res.sendStatus(404);
})
module.exports = crRoute;