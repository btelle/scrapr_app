// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform, scraprFactory) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        
        scraprFactory.base_url = 'http://gtrack.org/flickr/';
        scraprFactory.api_key = localStorage.getItem("api_key");
    });
})

.factory('scraprFactory', function($http) {
    var scraprFactory = {};
    
    scraprFactory.api_key = null;
    scraprFactory.counts = {};
    scraprFactory.base_url = '';
    
    scraprFactory._do_api_request = function(type, endpoint, data) {
        data.api_key = this.api_key;
        data.mode = endpoint;
        
        url_data = {
            method: type,
            url: this.base_url+'ajax.php',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        };
        
        if(type == 'get') {
            url_data.params = data;
        } else {
            url_data.data = data;
        }
        
        return $http(url_data);
    };
    
    scraprFactory.login = function(username, password) {
        return this._do_api_request('post', 'login', {username: username, password: password});
    };
    
    scraprFactory.verify_api_key = function() {
        return this._do_api_request('get', 'confirm_key', {});
    }
    
    scraprFactory.get_photos = function(type, start_id, last_id) {
        return this._do_api_request('get', type+'_photos', {start_id: start_id, last_id: last_id});
    };
	
	scraprFactory.get_profiles = function() {
		return this._do_api_request('get', 'all_profiles', {});
	};
    
    scraprFactory.save_profile = function(profile) {
        return this._do_api_request('post', 'profile', profile);
    };
    
    scraprFactory.delete_profile = function(profile) {
        return this._do_api_request('post', 'delete_profile', profile);
    }
	
    return scraprFactory;
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })
    
    .state('app.logout', {
        url: "/logout",
        views: {
            'menuContent': {
                templateUrl: "templates/logout.html",
                controller: 'LogoutCtrl'
            }
        }
    })

    .state('app.photos', {
        url: "/photos/:type",
        views: {
            'menuContent': {
                templateUrl: "templates/photos.html",
                controller: 'PhotosCtrl'
            }
        }
    })

    .state('app.main', {
        url: "/main",
        views: {
            'menuContent': {
                templateUrl: "templates/main.html"
            }
        }
    })
    
    .state('app.follows', {
        url: "/follows",
        views: {
            'menuContent': {
                templateUrl: "templates/admin/follows.html",
                controller: 'FollowsCtrl'
            }
        }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');
});
