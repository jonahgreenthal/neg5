'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _match = require('./../../models/sql-models/match');

var _match2 = _interopRequireDefault(_match);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {

    app.route('/api/t/:tid/games').get(function (req, res) {
        _match2.default.findByTournament(req.parms.tid).then(function (matches) {
            return res.json(matches);
        }).catch(function (error) {
            return res.status(500).send(error);
        });
    }).post(function (req, res) {});
};