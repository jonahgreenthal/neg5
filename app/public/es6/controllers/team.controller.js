(() => {
        
    angular.module('tournamentApp')
        .controller('TeamCtrl', ['$scope', '$http', 'Team', 'Phase', 'Division', TeamCtrl]);
    
    function TeamCtrl($scope, $http, Team, Phase, Division) {
        
        let vm = this;

        vm.teams = Team.teams;
        vm.phases = Phase.phases;
        vm.divisions = Division.divisions;

        vm.newTeam = {
            name: '',
            players: [
                {name: ''},
                {name: ''},
                {name: ''},
                {name: ''}   
            ],
            divisions: {}
        }

        vm.currentTeam = {};
        
        vm.teamSortType = 'name'
        vm.teamSortReverse = false;
        vm.teamQuery = '';
        
        vm.getTournamentTeams = () => {
            Team.getTeams($scope.tournamentId);
        }
        
        vm.addPlayer = () => vm.newTeam.players.push({name: ''})
        vm.removePlayerSlot = (index) => vm.newTeam.players.splice(index, 1);
        
        
        vm.addTeam = () => {
            if (vm.newTeamForm.$valid) {
                let toastConfig = {
                    message: 'Adding team.'
                }
                $scope.toast(toastConfig);
                Team.postTeam($scope.tournamentId, vm.newTeam)
                    .then((teamName) => {
                        resetNewTeam();
                        toastConfig.message = 'Added team: ' + teamName;
                        toastConfig.success = true;
                    })
                    .catch(() => {
                        toastConfig.message = 'Could not add team.';
                        toastConfig.success = false;
                    })
                    .finally(() => {
                        toastConfig.hideAfter = true;
                        $scope.toast(toastConfig);
                    })
            }
        }
        
        vm.findTeam = (team) => {
            if (team.id !== vm.currentTeam.id) {
                let toastConfig = {
                    message: 'Loading Team: ' + team.name
                }
                $scope.toast(toastConfig);
                Team.getTeamById($scope.tournamentId, team.id)
                    .then(gottenTeam => {
                        angular.copy(gottenTeam, vm.currentTeam);
                        toastConfig.success = true;
                        toastConfig.message = 'Loaded team: ' + gottenTeam.name
                    })
                    .catch(error => {
                        toastConfig.success = false;
                        toastConfig.message = 'Could not load team: ' + team.name
                    })
                    .finally(() => {
                        toastConfig.hideAfter = true;
                        $scope.toast(toastConfig);
                    })
            }
            
        }

        vm.removeTeam = (id) => Team.deleteTeam(id);  
        
        vm.getDivisionNameInPhase = (divisionId) => {
            if (!divisionId) return '';
            let division = vm.divisions.find(division => division.id === divisionId);
            if (!division) return ''; // To catch error where teams are loaded before divisions b/c of asynchronicity
            return division.name;
        }

        function resetNewTeam() {
            vm.newTeam = {
                name: '',
                players: [
                    {name: ''},
                    {name: ''},
                    {name: ''},
                    {name: ''}   
                ],
                divisions: {}
            }
        }

        vm.getTournamentTeams();

    }
    
})();