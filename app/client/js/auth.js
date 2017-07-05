/*
 * Authorization module
 * Contains services useful for the authorization
 */
angular.module('Blockstarter.authServices', ['Blockstarter.config'])

/**
 * LOCAL STORAGE easy way to use
 **/
.factory('$localStorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        remove: function(key) {
            return $window.localStorage.removeItem(key);
        }
    }
}])

/**
 * AUTHENTICATION SERVICES using JWT + LOCALSTORAGE
 **/
.service('AuthService', function($q, $http, CONFIG, AUTH_EVENTS, $localStorage) {
    var LOCAL_TOKEN_KEY = 'GeofencingProjectToken';
    var isAuthenticated = false;
    var authToken;

    function loadUserCredentials() {
        var token = $localStorage.get(LOCAL_TOKEN_KEY);
        if (token) {
            useCredentials(token);
        }
    }

    function storeUserCredentials(token) {
        $localStorage.set(LOCAL_TOKEN_KEY, token);
        useCredentials(token);
    }

    function useCredentials(token) {
        isAuthenticated = true;
        authToken = token;
        // We set the token as header for our requests
        $http.defaults.headers.common.Authorization = authToken;
    }

    function destroyUserCredentials() {
        authToken = undefined;
        isAuthenticated = false;
        $http.defaults.headers.common.Authorization = undefined;
        $localStorage.remove(LOCAL_TOKEN_KEY);
    }

    var register = function(user) {
        return $q(function(resolve, reject) {
            $http.post(CONFIG.endpoint + CONFIG.register, user).then(function(result) {
                if (result.data.success) {
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    var login = function(user) {
        return $q(function(resolve, reject) {
            $http.post(CONFIG.endpoint + CONFIG.login, user).then(function(result) {
                if (result.data.success) {
                    storeUserCredentials(result.data.token);
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    var logout = function() {
        destroyUserCredentials();
    };

    loadUserCredentials();

    return {
        login: login,
        register: register,
        logout: logout,
        isAuthenticated: function() { return isAuthenticated; },
    };
})

.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
    return {
        responseError: function(response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized
            }[response.status], response);
            return $q.reject(response);
        }
    };
})

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});