"use strict";

const PORT = process.env.PORT || 3000;

var assert = require('assert'),
    express = require('express'),
    useragent = require('express-useragent'),
    accepts = require('accepts'),
    jsonBeautifier = function (req, res, next) {
    console.log(req.query.pretty);
    if (req.query.pretty !== undefined) req.app.set('json spaces', 4);
    next();
},
    app = express().use(useragent.express()).use(jsonBeautifier).get('/', function (req, res) {
    res.send('<a href="/api/whoami">/api/whoami</a>');
}).get('/api/heroku', function (req, res) {
    res.json({
        params: req.params,
        query: req.query,
        headers: req.headers
    });
}).get('/api/whoami', function (req, res) {
    let os = req.useragent.os,
        locale = accepts(req).languages().shift(),
        realIp = function (req) {
        if (req.headers['x-forwarded-for']) {
            return req.headers['x-forwarded-for'];
        }
        return req.ip;
    };

    res.json({
        ipaddress: realIp(req),
        language: locale,
        software: os
    });
}).use(function (req, res) {
    res.sendStatus(404);
}),
    server = app.listen(PORT, function () {
    let port = server.address().port;
    console.log('Up an runnin');
});