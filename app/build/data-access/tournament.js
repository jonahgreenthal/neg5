'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _db = require('../database/db');

var _sql = require('../database/sql');

var _sql2 = _interopRequireDefault(_sql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tournament = _sql2.default.tournament;

exports.default = {

    saveTournament: function saveTournament(tournamentInfo) {

        return new Promise(function (resolve, reject) {
            var id = tournamentInfo.id;
            var name = tournamentInfo.name;
            var date = tournamentInfo.date;
            var questionSet = tournamentInfo.questionSet;
            var comments = tournamentInfo.comments;
            var location = tournamentInfo.location;
            var tossupScheme = tournamentInfo.tossupScheme;
            var username = tournamentInfo.username;


            var tournamentParams = [id, name, date, questionSet, comments, location, username];

            var _buildTournamentPoint = buildTournamentPointSchemeInsertQuery(tossupScheme, id);

            var tournamentIds = _buildTournamentPoint.tournamentIds;
            var values = _buildTournamentPoint.values;
            var types = _buildTournamentPoint.types;


            tournamentParams.push(tournamentIds, values, types);

            (0, _db.query)(tournament.add, tournamentParams, _db.queryTypeMap.many).then(function (result) {
                return resolve(result);
            }).catch(function (error) {
                return reject(error);
            });
        });
    },

    findTournamentsByUser: function findTournamentsByUser(username) {

        return new Promise(function (resolve, reject) {

            var params = [username];

            (0, _db.query)(tournament.findByUser, params, _db.queryTypeMap.any).then(function (tournaments) {
                return resolve(tournaments);
            }).catch(function (error) {
                reject(error);
            });
        });
    },

    findTournamentById: function findTournamentById(id) {

        return new Promise(function (resolve, reject) {
            var params = [id];

            (0, _db.query)(tournament.findById, params, _db.queryTypeMap.one).then(function (tournament) {
                resolve(tournament);
            }).catch(function (error) {
                reject(error);
            });
        });
    },

    updateTournament: function updateTournament(id, newInfo) {
        return new Promise(function (resolve, reject) {
            var name = newInfo.name;
            var _newInfo$location = newInfo.location;
            var location = _newInfo$location === undefined ? null : _newInfo$location;
            var _newInfo$date = newInfo.date;
            var date = _newInfo$date === undefined ? null : _newInfo$date;
            var _newInfo$questionSet = newInfo.questionSet;
            var questionSet = _newInfo$questionSet === undefined ? null : _newInfo$questionSet;
            var _newInfo$comments = newInfo.comments;
            var comments = _newInfo$comments === undefined ? null : _newInfo$comments;
            var _newInfo$hidden = newInfo.hidden;
            var hidden = _newInfo$hidden === undefined ? false : _newInfo$hidden;

            var params = [id, name, location, date, questionSet, comments, hidden];

            (0, _db.query)(tournament.update, params, _db.queryTypeMap.one).then(function (updatedInfo) {
                return resolve(updatedInfo);
            }).catch(function (error) {
                reject(error);
            });
        });
    },

    addTossupPointValue: function addTossupPointValue(id, _ref) {
        var type = _ref.type;
        var value = _ref.value;

        return new Promise(function (resolve, reject) {
            var params = [id, type, value];

            (0, _db.query)(tournament.addPointValue, params, _db.queryTypeMap.one).then(function (newTossupValue) {
                return resolve(newTossupValue);
            }).catch(function (error) {
                reject(error);
            });
        });
    },

    updateTossupPointValues: function updateTossupPointValues(id, tossupPointValues, bonusPointValue, partsPerBonus) {
        return new Promise(function (resolve, reject) {
            var params = [id];

            var _buildTournamentPoint2 = buildTournamentPointSchemeInsertQuery(tossupPointValues, id);

            var tournamentIds = _buildTournamentPoint2.tournamentIds;
            var values = _buildTournamentPoint2.values;
            var types = _buildTournamentPoint2.types;


            params.push(tournamentIds, values, types, bonusPointValue, partsPerBonus);

            (0, _db.query)(tournament.updatePointValues, params, _db.queryTypeMap.any).then(function (newValues) {
                var result = {
                    bonusPointValue: newValues[0].bonus_point_value,
                    partsPerBonus: newValues[0].parts_per_bonus,
                    tossupValues: newValues.splice(1)
                };
                resolve(result);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

};


function buildTournamentPointSchemeInsertQuery(rows, tournamentId) {

    var tournamentIds = rows.map(function (row) {
        return tournamentId;
    });
    var values = rows.map(function (row) {
        return row.value;
    });
    var types = rows.map(function (row) {
        return row.type;
    });

    return {
        tournamentIds: tournamentIds,
        values: values,
        types: types
    };
}