'use strict';

var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/examination", {
            templateUrl : "examination/examination.html"
        })
        .when("/users", {
            templateUrl : "users/users.html"
        })
        .when("/informatics", {
            templateUrl : "informatics/informatics.html"
        })

});