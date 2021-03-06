'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isValidToken = exports.hasToken = undefined;

var _jwt = require('./../../helpers/jwt');

var hasToken = exports.hasToken = function hasToken(req, res, next) {
    var jwt = req.body.token || req.query.token || req.cookies.nfToken;
    if (jwt) {
        try {
            req.currentUser = (0, _jwt.decode)(jwt);
            next();
        } catch (error) {
            return res.status(403).send({ message: 'Invalid token: ' + jwt, success: false });
        }
    } else {
        return res.status(403).send({ message: 'This route requires authorization.', success: false });
    }
};

var isValidToken = exports.isValidToken = function isValidToken(req, res, next) {};