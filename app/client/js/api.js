angular.module('Blockstarter.api', ['Blockstarter.config'])

.factory('Api', function($http, CONFIG, $window, $timeout, $q) {

    this.getAllProjects = () => {
        return $http
            .get(CONFIG.endpoint + '/projects')
            .then(response => { return response.data; })
            .catch(error => { return error; });
    };

    this.addProject = function(project) {
        return $http
            .post(CONFIG.endpoint + '/projects', project)
            .then(response => { return response.data; })
            .catch(error => { return error; });
    }

    // self.getUsers = function() {
    //     return $http.get(CONFIG.endpoint + CONFIG.users).then(
    //         function(response) {
    //             return response.data;
    //         },
    //         function(error) {
    //             return error;
    //         });
    // };

    // self.getCurrentUser = function() {
    //     return $http.get(CONFIG.endpoint + CONFIG.user).then(function(result) {
    //         return result.data;
    //     }, function(error) {
    //         return error;
    //     });
    // };

    return this;
});