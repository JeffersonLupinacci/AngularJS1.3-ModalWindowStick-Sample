(function () {

    var Application = angular.module('Application', ['Window']);

    Application.directive('clock', ['$timeout', function($timeout){
        return{
            restrict: 'E', // Element
            templateUrl: "./assets/ui/clock.html",
            link: function(scope, element){

                // Portuguese Calendar
                var Days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
                var Months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

                var updateTime = function(){
                    var now = new Date();
                    scope.clockDay = now.getDate();
                    scope.clockMonth = Months[now.getMonth()];
                    scope.clockTimer = now.toLocaleTimeString();//(navigator.language, {hour: '2-digit', minute:'2-digit', seconds:'2-digit'});
                    $timeout(updateTime, now % 1000);
                };
                updateTime();
            }
        }
    }]);

})();