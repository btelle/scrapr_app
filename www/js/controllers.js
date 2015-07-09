angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $state, scraprFactory) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
        console.log(scraprFactory.api_key);
        
        if(scraprFactory.api_key == null) {
            $scope.login();
        } else {
            $scope.verifyKey();
        }
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
                localStorage.setItem("api_key", data.api_key); 
                $rootScope.counts = {
                    follow: data.new_follow_count, 
                    search: data.new_search_count,
                    saved: data.new_saved_count
                };
                
                $scope.closeLogin();
            })
            .error(function(e) {
                console.log(e);
            });
    };
    
    $scope.verifyKey = function() {
        scraprFactory.verify_api_key()
            .success(function(data) {
                $rootScope.counts = {
                    follow: data.new_follow_count, 
                    search: data.new_search_count,
                    saved: data.new_saved_count
                };
            })
            .error(function(e) {
                $scope.login();
            });
    };
})

.controller('LogoutCtrl', function($scope, $state, scraprFactory) {
    $scope.$on('$ionicView.enter', function() {
		console.log('Logging out');
    
        scraprFactory.api_key = null;
        localStorage.removeItem('api_key');
        
        $scope.loginData = {};
        $scope.login();
        $state.go('app.main');
	});
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

.controller('FollowsCtrl', function($scope, $stateParams, $ionicModal, $ionicPopup, $ionicActionSheet, scraprFactory) {
    console.log('Running Follows');
	
    $scope.profiles = [];
    
    $scope.load_profiles = function() {
        scraprFactory.get_profiles().success(function(data) {
			$scope.profiles = data.profiles;
		});
    }
    
	$scope.$on('$ionicView.enter', function() {
		$scope.load_profiles();
	});
	
	$scope.open_follow = function(follow) {
		$scope.profile = follow;
		$scope.follow_modal.show();
	};
    
    $scope.close_follow = function() {
        $scope.follow_modal.hide();
    }
    
    $scope.save_follow = function(profile) {
        scraprFactory.save_profile(profile)
            .success(function(data) {
                $scope.close_follow();
                $scope.load_profiles();
                
                $ionicPopup.alert({
                    title: 'Saved profile'
                });
            })
            .error(function(e) {
            
            });
    };
    
    $scope.delete_follow = function(profile) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete profile',
            template: 'Are you sure you want to delete this profile. This will also delete any photos associated with their account.'
        });
        confirmPopup.then(function(res) {
            if(res) {
                scraprFactory.delete_profile(profile).success(function(data) {
                    $ionicPopup.alert({
                        title: 'Deleted profile'
                    });
                    
                    $scope.load_profiles();
                });
            } else {
                console.log('You are not sure');
            }
        });
    };
    
    $scope.show_follow_actionsheet = function(profile) {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Edit' }
            ],
            destructiveText: 'Delete',
            cancelText: 'Cancel',
            buttonClicked: function(index) {
                if(index == 0) {
                    $scope.open_follow(profile);
                }
            }, 
            destructiveButtonClicked: function() {
                $scope.delete_follow(profile);
                return true;
            }
        });
    };
	
	$ionicModal.fromTemplateUrl('templates/admin/follow_edit.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.follow_modal = modal;
    });
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
