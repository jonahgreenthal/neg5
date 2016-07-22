'use strict';

(() => {

    angular.module('HomeApp', ['ngCookies'])

    angular.module('HomeApp')
        .controller('HomeController', ['$cookies', '$scope', '$http', function($cookies, $scope, $http) {

            let vm = this;

            vm.tournaments = [];

            vm.getTournaments = () => {
                const jwt = $cookies.get('nfToken');
                $http.get('/api/t?token=' + jwt)
                    .then(({data}) => {
                        vm.tournaments = data.data;
                    })
                    .catch(error => console.log(error));
            }

            vm.getTournaments();

        }])

})();
