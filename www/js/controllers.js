angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $state, scraprFactory) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.login();
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        scraprFactory.login($scope.loginData.username, $scope.loginData.password)
            .success(function(data) {
                scraprFactory.api_key = data.api_key;
                $rootScope.counts = {
                    follow: data.new_follow_count, 
                    search: data.new_search_count,
                    saved: data.new_saved_count
                };
                
                $scope.closeLogin();
                $state.go('app.photos', {type: 'follow'});
            })
            .error(function(e) {
                console.log(e);
            });
    };
})

.controller('PhotosCtrl', function($scope, $stateParams, scraprFactory) {
    console.log('Running photos', $stateParams);
    
    $scope.photos = [];
    $scope.start_id = 0;
    $scope.last_id = 0;
    
    scraprFactory.get_photos($stateParams.type)
        .success(function(data) {
            $scope.photos = data.photos;
            console.log(data);
            $scope.start_id = data.photos[0].id;
            $scope.last_id = data.photos[data.photos.length-1].id;
        })
        .error(function(e) {
            console.log('Photo error', e);
        });
})

.controller('FollowsCtrl', function($scope, $stateParams, scraprFactory) {
    console.log('Running Follows');
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
