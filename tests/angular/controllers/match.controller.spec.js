describe('Controller: Match', () => {

    let $controller;
    let $scope;
    let $rootScope;
    let MatchController;

    beforeEach(module('tournamentApp'));

    beforeEach(inject(function($rootScope, $controller) {
        $rootScope = $rootScope;
        $controller = $controller;
        $scope = $rootScope.$new();
    }));

    beforeEach(inject(function($controller) {
        MatchController = $controller('GameCtrl', {$scope: $scope});
    }));

    describe('Controller should be initialized properly', () => {
        it('and it should be defined', () => {
            expect(MatchController).toBeDefined();
        })  

        it('and its properties should be initialized properly', () => {
            expect(MatchController.currentGame).toBeDefined();
            expect(MatchController.currentGame.teams.length).toEqual(2);
            expect(MatchController.teams).toBeDefined();
            expect(MatchController.games).toBeDefined();
            expect(MatchController.phases).toBeDefined();
            expect(MatchController.pointScheme).toBeDefined();
        })
    })

    describe('Individual player point values should be summed correctly', () => {
        let playerPoint;

        beforeEach(() => {
            playerPoint = {};
        })

        it('and it should return 0 if parameter is undefined or null', () => {
            playerPoint = null;
            expect(MatchController.pointSum(playerPoint)).toEqual(0);
            playerPoint = undefined;
            expect(MatchController.pointSum(playerPoint)).toEqual(0);
        })

        it('and it should be 0 when the player has no points available', () => {
            let sum = MatchController.pointSum(playerPoint);
            expect(sum).toEqual(0);
        }) 

        it('and it should sum normally when the player has all positive point values', () => {
            playerPoint = {10: 2, 15: 4};
            expect(MatchController.pointSum(playerPoint)).toEqual(80);
        })

        it('and non-numeric values should be ignored in summation', () => {
            playerPoint = {10: null, 15: 4};
            expect(MatchController.pointSum(playerPoint)).toEqual(60);

            playerPoint = {10: 5, 15 : NaN};
            expect(MatchController.pointSum(playerPoint)).toEqual(50);

            playerPoint = {10: undefined, 15: undefined};
            expect(MatchController.pointSum(playerPoint)).toEqual(0);
        })
    })

    describe('A team\'s bonus points should be calculated correctly', () => {
        let team;

        beforeEach(() => {
            team = {
                players: [
                    {
                        points: {
                            10: 2,
                            15: 4
                        }
                    },
                    {
                        points: {
                            10: 0,
                            15: 1
                        }
                    }
                ],
                score: 400,
                bouncebacks: 0
            }
        })

        it('and should correctly calculate bonus points when a team has no bounceback points', () => {
            expect(MatchController.teamBonusPoints(team)).toEqual(305);
            team.bouncebacks = null;
            expect(MatchController.teamBonusPoints(team)).toEqual(305);
        })

        it('and should correctly calculate bonus points when a team has bouncebacks', () => {
            team.bouncebacks = 50;
            expect(MatchController.teamBonusPoints(team)).toEqual(255);
        })
    })

    describe('A team\'s PPB should be calculated correctly', () => {
        let team;

        beforeEach(() => {
            team = {
                players: [
                    {
                        points: {
                            10: 2,
                            15: 4
                        }
                    },
                    {
                        points: {
                            10: 0,
                            15: 1
                        }
                    }
                ],
                score: 400,
                bouncebacks: 0
            }
        })

        it('and should return 0 PPB when a team has no players', () => {
            team.players = [];
            expect(MatchController.teamPPB(team)).toEqual(0);
        });

        it(' and it should return Infinity if a team has no non-overtime tossups', () => {
            team.players = [{points: {}}]
            expect(MatchController.teamPPB(team)).toEqual(Infinity);
        });

        it('and should correctly calculate PPB when a team has no bounceback points', () => {
            expect(MatchController.teamPPB(team).toFixed(2)).toEqual('43.57');
        });

        it('and should correctly calculate PPB when a team has bounceback points', () => {
            team.bouncebacks = 50;
            expect(MatchController.teamPPB(team).toFixed(2)).toEqual('36.43');
        });

        it('and should not include overtime tossups when calculating PPB', () => {
            team.overtime = 1;
            expect(MatchController.teamPPB(team).toFixed(2)).toEqual('50.83');

            team.overtime = null;
            expect(MatchController.teamPPB(team).toFixed(2)).toEqual('43.57');
        });

    })
    
})