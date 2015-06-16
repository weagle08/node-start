/**
 * Created by Ben on 6/13/2015.
 */
var ngapp = angular.module('ngapp', ['ngRoute', 'logging']);

ngapp.config(function($routeProvider){
    $routeProvider.when('/logs', {
        templateUrl: 'html/logs.html',
        controller: 'logsController'
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
});