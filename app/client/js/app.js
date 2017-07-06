angular.module("Blockstarter", ['ngRoute', 'ngSanitize', 'mgcrea.ngStrap', 'Blockstarter.config', 'Blockstarter.controllers', 'Blockstarter.api', 'Blockstarter.authServices'])
    .run(function($rootScope, $window) {
        console.info("Blockstarter 4.0 Project");

        // handling navbar in different controllers (to hide or show the header navbar)
        $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
            if (current.$$route.controller === "RegisterCtrl" || current.$$route.controller === "LoginCtrl") {
                $rootScope.navbar = false;
                $rootScope.footerbar = false;
            } else {
                $rootScope.navbar = true;
                $rootScope.footerbar = true;
            }
        });

        // event handler fired when the transition begins
        $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
            if (!AuthService.isAuthenticated()) {
                event.preventDefault();
                window.location.href = "/#/login";
            }
        });
    })

.config(function($routeProvider, $httpProvider) {

    $routeProvider
        .when('/projects/view', {
            templateUrl: 'templates/projects.html',
            controller: 'ProjectsCtrl'
        })
        .when('/projects/add', {
            templateUrl: 'templates/add-project.html',
            controller: 'ProjectsCtrl'
        })
        .when('/creator/:creator', {
            templateUrl: 'templates/creators.html',
            controller: 'CreatorsCtrl'
        })
        .when('/backer/:backer', {
            templateUrl: 'templates/backers.html',
            controller: 'BackersCtrl'
        })
<<<<<<< HEAD
        .when('/myprojects', {
            templateUrl: 'templates/my-projects.html',
            controller: 'MyProjectsCtrl'
=======
        .when('/login', {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
>>>>>>> 2f54e1d20e70015c77ab53521e1e58b201c113bb
        })
        .otherwise({
            redirectTo: '/projects/view'
        });

    $httpProvider.interceptors.push('AuthInterceptor');
});