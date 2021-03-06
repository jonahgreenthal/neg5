'use strict';

(function () {

    angular.module('tournamentApp').factory('Game', ['$http', '$q', 'Cookies', function ($http, $q, Cookies) {

        var service = this;

        var games = [];

        service.gameFactory = {
            games: games,
            postGame: postGame,
            getGames: getGames,
            deleteGame: deleteGame,
            getTeamPlayers: getTeamPlayers,
            getGameById: getGameById,
            editGame: editGame
        };

        function postGame(tournamentId, game) {
            var formattedGame = formatGame(game);
            return $q(function (resolve, reject) {
                var body = {
                    token: Cookies.get('nfToken'),
                    game: formattedGame
                };
                $http.post('/api/t/' + tournamentId + '/matches', body).then(function (_ref) {
                    var data = _ref.data;

                    resolve(data.result);
                }).catch(function (error) {
                    return reject(error);
                });
            });
        }

        function getGames(tournamentId) {
            var token = Cookies.get('nfToken');
            $http.get('/api/t/' + tournamentId + '/matches?token=' + token).then(function (_ref2) {
                var data = _ref2.data;

                var formattedGames = data.matches.map(function (_ref3) {
                    var id = _ref3.match_id;
                    var tuh = _ref3.tossups_heard;
                    var round = _ref3.round;
                    var team_1_id = _ref3.team_1_id;
                    var team_1_score = _ref3.team_1_score;
                    var team_2_id = _ref3.team_2_id;
                    var team_2_score = _ref3.team_2_score;
                    var team_1_name = _ref3.team_1_name;
                    var team_2_name = _ref3.team_2_name;
                    var phases = _ref3.phases;

                    return {
                        id: id,
                        tuh: tuh,
                        round: round,
                        teams: {
                            one: {
                                score: team_1_score,
                                id: team_1_id,
                                name: team_1_name
                            },
                            two: {
                                score: team_2_score,
                                id: team_2_id,
                                name: team_2_name
                            }
                        },
                        phases: phases.reduce(function (obj, current) {
                            obj[current.phase_id] = true;
                            return obj;
                        }, {})
                    };
                });
                angular.copy(formattedGames, service.gameFactory.games);
            });
        }

        function getTeamPlayers(tournamentId, teamId) {
            return $q(function (resolve, reject) {
                var token = Cookies.get('nfToken');
                $http.get('/api/t/' + tournamentId + '/teams/' + teamId + '?token=' + token).then(function (_ref4) {
                    var data = _ref4.data;

                    var formattedPlayers = data.result.players.map(function (_ref5) {
                        var name = _ref5.player_name;
                        var id = _ref5.player_id;

                        return {
                            id: id,
                            name: name
                        };
                    });
                    resolve(formattedPlayers);
                }).catch(function (error) {
                    reject(error);
                });
            });
        }

        function getGameById(tournamentId, gameId) {
            return $q(function (resolve, reject) {
                var token = Cookies.get('nfToken');
                $http.get('/api/t/' + tournamentId + '/matches/' + gameId + '?token=' + token).then(function (_ref6) {
                    var data = _ref6.data;

                    var game = data.result;
                    var formattedGame = {
                        addedBy: game.added_by,
                        id: game.match_id,
                        tuh: game.tossups_heard,
                        moderator: game.moderator,
                        notes: game.notes,
                        packet: game.packet,
                        room: game.room,
                        round: game.round,
                        teams: game.teams.map(function (team) {
                            return {
                                id: team.team_id,
                                name: team.team_name,
                                overtime: team.overtime_tossups,
                                bouncebacks: team.bounceback_points,
                                score: team.score,
                                players: team.players.map(function (player) {
                                    return {
                                        id: player.player_id,
                                        name: player.player_name,
                                        tuh: player.tossups_heard,
                                        points: player.tossup_values.reduce(function (aggr, current) {
                                            aggr[current.value] = current.number;
                                            return aggr;
                                        }, {})
                                    };
                                })
                            };
                        }),
                        phases: game.phases.map(function (phase) {
                            return {
                                id: phase.phase_id,
                                name: phase.phase_name
                            };
                        })
                    };
                    resolve(formattedGame);
                }).catch(function (error) {
                    return reject(error);
                });
            });
        }

        function editGame(tournamentId, gameId, gameInformation) {
            return $q(function (resolve, reject) {
                var body = {
                    token: Cookies.get('nfToken'),
                    game: formatGame(gameInformation)
                };
                $http.put('/api/t/' + tournamentId + '/matches/' + gameId, body).then(function (_ref7) {
                    var data = _ref7.data;

                    var game = data.result;
                    resolve(game);
                }).catch(function (error) {
                    return reject(error);
                });
            });
        }

        function deleteGame(tournamentId, matchId) {
            return $q(function (resolve, reject) {
                var token = Cookies.get('nfToken');
                $http.delete('/api/t/' + tournamentId + '/matches/' + matchId + '?token=' + token).then(function (_ref8) {
                    var data = _ref8.data;

                    var matchId = data.result.id;
                    removeMatchFromArray(matchId);

                    resolve();
                }).catch(function (error) {
                    return reject(error);
                });
            });
        }

        function formatGame(game) {
            var gameCopy = {};
            angular.copy(game, gameCopy);
            gameCopy.phases = gameCopy.phases.map(function (phase) {
                return phase.id;
            });
            gameCopy.teams = gameCopy.teams.map(function (team) {
                return {
                    id: team.teamInfo.id,
                    score: team.score,
                    bouncebacks: team.bouncebacks,
                    overtime: team.overtime,
                    players: team.players.map(function (player) {
                        return {
                            id: player.id,
                            tuh: player.tuh || 0,
                            points: Object.keys(player.points).map(Number).map(function (pv) {
                                return {
                                    value: pv,
                                    number: player.points[pv] || 0
                                };
                            })
                        };
                    })
                };
            });

            return gameCopy;
        }

        function removeMatchFromArray(matchId) {
            var index = service.gameFactory.games.findIndex(function (game) {
                return game.id === matchId;
            });
            if (index !== -1) {
                service.gameFactory.games.splice(index, 1);
            }
        }

        return service.gameFactory;
    }]);
})();