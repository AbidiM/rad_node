'use strict';
const express = require('express');
const crRoute = express.Router();
const connection = require('../db');
crRoute.post('/signup', function (req, res, next) {


    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    console.log(name + " + " + email + " + " + password);

    connection.execute(`INSERT INTO users 
    (username, email, password) 
    VALUES (?, ?, ?);`,
        [name, email, password])
        .then(() => {
            console.log('ok');
        }).catch((err) => {
            
            console.log('error asba');
            console.log(err);
        });
    res.end();
});
crRoute.get('/login', function (req, res, next) {
    connection.execute('SELECT * FROM users WHERE email = ? AND password = ?;', [email, password])
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
    connection.execute('SELECT * FROM users WHERE email=?;',
        [req.body.email])
        .then((result) => {
            var data = result[0];
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