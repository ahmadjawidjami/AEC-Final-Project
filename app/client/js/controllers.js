angular.module("Blockstarter.controllers", [])

.controller('AppCtrl', function($scope, Api, $rootScope, $http, CONFIG, $window) {

    // GLOBAL function to get the logged user informations
    // $rootScope.getAllProjects = () => {
    //     Api
    //         .getAllProjects()
    //         .then(response => console.log(response))
    //         .catch(error => console.log(error));
    // };
    // // calling the base function
    // $rootScope.getAllProjects();
    // if user isn't authenticated yet, then logout and redirect to login page
    // $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    //     AuthService.logout();
    //     $window.location.href = "/#/login";
    //     var alertPopup = "Session Lost.\nSorry you have to login again.";
    // });

    // // Logout service
    // $scope.logout = function() {
    //     AuthService.logout();
    //     // Redirect to login page
    //     $window.location.href = "/#/login";
    // };

})

.controller('ProjectsCtrl', function($scope, Api, $window, $rootScope) {
    console.log("ProjectsCtrl");

    Api
        .getAllProjects()
        .then(response => {
            console.log(response);
            $scope.projectList = response;
        })
        .catch(error => console.log(error));

    $scope.openProject = (index) => {
        console.log(`called index: ${index}`)
    }

    $scope.createProject = (project, token) => {
        let request = { project, token };
        console.log(request);

        Api
            .addProject(request)
            .then(response => {
                console.log(response);
                $window.location.href = '/#/projects'
            })
            .catch(error => console.log(error));
    }
})

.controller('CreatorsCtrl', function($scope, Api, $window, $rootScope) {
    console.log("CreatorsCtrl");
})

.controller('BackersCtrl', function($scope, Api, $window, $rootScope) {
    console.log("BackersCtrl");
})

.controller('UserCtrl', function($scope, Api, $rootScope, $http, CONFIG, $window, AuthService, AUTH_EVENTS) {

    console.log("UserCtrl");
});