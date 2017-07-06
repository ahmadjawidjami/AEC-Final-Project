angular.module("Blockstarter.controllers", [])

.controller('AppCtrl', function($scope, Api, $rootScope, $http, CONFIG, $window, AuthService) {

    console.log("AppCtrl");
    console.log(AuthService.isAuthenticated());

    let logout = () => {
        AuthService.logout();
        $window.location.href = "/#/login";
    }

    if (!AuthService.isAuthenticated()) {
        logout();
    }

    $scope.logout = logout;

    if (AuthService.getUser()) {
        $scope.address = AuthService.getUser().address;
    }
})

.controller('ProjectsCtrl', function($scope, Api, $window, $rootScope, AuthService) {
    console.log("ProjectsCtrl");
    const user = AuthService.getUser();
    console.log(user);

    Api
        .getAllProjects()
        .then(response => {
            console.log(response);
            $scope.projectList = response;
        })
        .catch(error => console.log(error));

    $scope.openProject = (project) => {
        console.log(`called index: ${project}`)
        $window.location.href = `/#/projects/view/${project.address}`;
    }

    $scope.createProject = (project, token) => {
        project.creator = token.creator = user.address;
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

.controller('ProjectCtrl', function($scope, Api, $window, $rootScope, $routeParams, AuthService) {
    console.log("Single Project Ctrl");
    const user = AuthService.getUser();
    console.log(user);

    Api
        .getProject($routeParams.project)
        .then(response => {
            console.log(response);
            $scope.project = response;
        })
        .catch(error => console.log(error));

    $scope.fundProject = (project, amount) => {
        const req = {
            project,
            amount,
            backer: user.address
        }
        console.log(req);
        Api
            .backProject(req)
            .then(response => {
                console.log(response);
                //window.location.reload();
            })
            .catch(error => console.error(error));
    }

    $scope.withdrawProject = (project, amount) => {
        const req = {
            project,
            amount,
            creator: AuthService.getUser().address
        };

        Api
            .withdrawProject(req)
            .then(response => console.log('Withdraw', response))
            .catch(error => console.error(error));
    }

    $scope.claimShares = (project, token) => {
        const req = {
            token,
            project,
            backer: AuthService.getUser().address
        }

        Api
            .claimShares(req)
            .then(response => console.log('Claim Shares', response))
            .catch(error => console.error(errors));
    }

})

.controller('CreatorsCtrl', function($scope, Api, $window, $rootScope, AuthService) {
    console.log("CreatorsCtrl");

    Api
        .getCreatedProjects(AuthService.getUser().address)
        .then(response => {
            console.log(response);
            $scope.projectList = response;
        })
        .catch(error => console.log(error));

    $scope.openProject = (index) => {
        console.log(`called index: ${index}`)
    }
})

.controller('BackersCtrl', function($scope, Api, $window, $rootScope, AuthService) {
    console.log("BackersCtrl");

    Api
        .getBackedProjects(AuthService.getUser().address)
        .then(response => {
            console.log(response);
            $scope.projectList = response;
        })
        .catch(error => console.error(error));
})

.controller('LoginCtrl', function($scope, Api, $window, $rootScope, AuthService, $http, CONFIG, AUTH_EVENTS) {
    console.log("LoginCtrl");

    // check if the user is already authenticated, if so, redirect home
    if (AuthService.isAuthenticated()) {
        console.info("Auth");
        $window.location.href = "/#/projects/view";
    }

    // login
    $scope.login = user => {
        AuthService
            .login(user)
            .then(msg => { $window.location.reload(); })
            .catch(errMsg => { $scope.error = errMsg; });
    };

    // blocks the user on the page until it isn't logged
    $scope.$on('$locationChangeStart', (event) => {
        if (!AuthService.isAuthenticated()) {
            event.preventDefault();
            $window.location.href = "/#/login";
        }
    });
})

.controller('UserCtrl', function($scope, Api, $rootScope, $http, CONFIG, $window, AuthService, AUTH_EVENTS) {

    console.log("UserCtrl");
});