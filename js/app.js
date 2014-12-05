var url = "http://128.199.190.218";
var app = angular.module('indexApp', [
  "sdfilters",
  "cart",
  "search",
  "ionic",
  "ui.bootstrap.datetimepicker"
]);

app.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('login', {
					url : '/login',
					templateUrl : 'login.html',
					controller : 'loginCtrl'
	}).state('home', { 	url : '/',
						templateUrl : 'home.html',
						controller : 'homeCtrl'
	}).state('map-search', { 
						url : '/map-search',
						templateUrl : 'map-search.html',
						controller : 'mapsCtrl'
	}).state('search', { 
						url : '/search',
						templateUrl : 'search.html',
						controller : 'searchCtrl'
	}).state('restaurant', { 
						url : '/restaurant/:outlet_id',
						templateUrl : 'restaurant.html',
						controller : 'restoCtrl'
	}).state('order', { 
						url : '/order/:outlet_id/:brand_id',
						templateUrl : 'order.html',
						controller : 'orderCtrl'
	}).state('cart', { 
						url : '/cart/:outlet_id/:brand_id',
						templateUrl : 'cart.html',
						controller : 'cartCtrl'
	}).state('checkout', { 
						url : '/checkout/:outlet_id/:brand_id',
						templateUrl : 'checkout.html',
						controller : 'checkoutCtrl'
	});	
}]);

app.config(function($urlRouterProvider){ 
    $urlRouterProvider.when('', '/');
});

app.run(function($rootScope,$ionicSideMenuDelegate){
	$rootScope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		if(toState.name == 'home')
			$rootScope.onHome = true;
		else
			$rootScope.onHome = false;
	});
});

app.directive('backButton', function(){
    return {
      restrict: 'A',

      link: function(scope, element, attrs) {
        element.bind('click', goBack);

        function goBack() {
          history.back();
          scope.$apply();
        }
      }
    }
});

app.controller('panelCtrl',function($scope,$location){
	
});

app.controller('loginCtrl',function($scope,$http,$location){
	$scope.url = url;
	$scope.login_front = true;
	$scope.login_login = false;
	$scope.login_signup = false;
	$scope.login = {};
	$scope.signup = {};
	$scope.doLogin = function () {
		$scope.login_front = false;
		$scope.login_login = true;
    };
	$scope.doSignin = function(customer) {
		var urlLogin = url + "/login.php?callback=JSON_CALLBACK";
		$http.jsonp(urlLogin)
			.success(function(data) {
				if(data.one == 1) {
				
					$location.path('/home/');
				}
		});
	};
    $scope.doSignUp = function () {
		
    };
});

app.controller('homeCtrl',function($scope,$location,$ionicSideMenuDelegate){
	$scope.onHome = true;
    $scope.toMap = function(){
		$location.path('/map-search');
    };
});

app.controller('restoCtrl',function($scope,$stateParams,$http){
	$scope.outlet_id = $stateParams.outlet_id;
	var urlLogin = url + "/outletInfo.php?outlet_id="+$scope.outlet_id+"&callback=JSON_CALLBACK";
	$http.jsonp(urlLogin)
	    .success(function(data) {
		$scope.outletInfo = data.outlet;	
		urlLogin = url + "/outletMenuCategory.php?brand_id="+$scope.outletInfo.brand_id+"&callback=JSON_CALLBACK";
			//console.log(urlLogin);
		$http.jsonp(urlLogin).success(function(data){
				$scope.menuCategories = data.category;
		});
	    });
	
	
}).directive('restaurant',function() {
	return {
		restrict : 'E',
		templateUrl: 'restaurant-template.html'
	};
});

app.controller('searchCtrl',function($scope,$stateParams,$http,Search){
	var urlLogin = url + "/search.php?outlet_id="+Search.getAll().replace("[","").replace("]","")+"&callback=JSON_CALLBACK";
	$http.jsonp(urlLogin)
		.success(function(data) {
			$scope.outlets = data.outlet;
		});
});

app.controller('orderCtrl',function($scope,$stateParams,$ionicModal,$http,Cart,$ionicLoading,$location){
	$scope.outlet_id = $stateParams.outlet_id;
	$scope.brand_id = $stateParams.brand_id;
	$scope.tab = 0;
	$scope.menuz = [];
	$scope.menu = {};
	var arrayLoaded = [];

	$scope.show = function() {
	    $ionicLoading.show({
	      template: 'Loading...'
	    });
	};
	$scope.hide = function(){
	    $ionicLoading.hide();
	};

	var urlLogin = url + "/outletMenuCategory.php?brand_id="+$scope.brand_id+"&callback=JSON_CALLBACK";
		$http.jsonp(urlLogin).success(function(data){
				$scope.menuCategories = data.category;
	});
	$scope.loadMenu = function(a) {
		$scope.tab = a;
		if(arrayLoaded.indexOf(a) == -1 ) {
			urlLogin = url + "/outletMenu.php?category_id="+a+"&callback=JSON_CALLBACK";
			$http.jsonp(urlLogin).success(function(data){
				$scope.show();
				$scope.menuz[a] =data.menu;
				arrayLoaded.push(a);
				$scope.menus = $scope.menuz[a];
				$scope.hide();
			});
		} else {
			$scope.menus = $scope.menuz[a];
		}
	}

	$scope.openModal = function (data){
		$scope.menu_id = data;
		$scope.menu = {};
		var urlLogin = url + "/menuInformation.php?menu_id="+$scope.menu_id+"&callback=JSON_CALLBACK";
		$http.jsonp(urlLogin).success(function(data){
			$scope.menu = data.menu;
			$scope.menu.qty = 1;
			if(data.menu.size.length>0) {
				$scope.menu.size_id = $scope.menu.size[0]; 
			}
			$scope.modal.show();
		});
		
  	};
  	$scope.closeModal = function() {
    	$scope.modal.hide();
  	};

  	$scope.addToCart = function (inputs) {
		delete inputs['size'];
		delete inputs['menu_description'];
		var temp = [];
		angular.forEach(inputs.attr,function(value,key){
			if(value.selected == true) {
				temp.push(value);
			}
		});
		if(temp.length == 0)
			delete inputs['attr'];
		else
			inputs.attr = temp;
		Cart.addItem(inputs);
	    $scope.modal.hide();
	    $scope.items = Cart.getTotalItems();
		$scope.prices = Cart.getTotalPrice();
	};

	$ionicModal.fromTemplateUrl('myModalContent.html', {
	  	scope: $scope,
	  	animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;	
	});

	$scope.$on('$destroy', function () {
	  $scope.modal.remove();
	});

	$scope.$watch('menu',function(){
	    var price_ea = $scope.menu.menu_price;
	    if(typeof $scope.menu.size_id != "undefined")
			price_ea = $scope.menu.size_id.size_price;
	    var price_attr = 0;
	    angular.forEach($scope.menu.attr,function(value,key){
			if(value.selected == true) {
			    price_attr += value.attribute_price;
			}
	    });
	    $scope.total = $scope.menu.qty * (price_ea + price_attr);
	},true);

  	Cart.init($scope.outlet_id);
  	$scope.items = Cart.getTotalItems();
  	$scope.prices = Cart.getTotalPrice();
}).directive('cartcontents',function() {
	return {
		restrict : 'E',
		templateUrl: 'cartcontents-template.html'
	};
});

app.controller('mapsCtrl',function($scope,$http,$ionicLoading,Search,$location) {
	var areaJson = {};
	$scope.searchInput = false;
	Search.init();
	$scope.areaCoverage = 0;
	$scope.latitude = -6.219260;
	$scope.longitude = 106.812410;

	$scope.show = function() {
	    $ionicLoading.show({
	      template: 'Loading...'
	    });
	};
	$scope.hide = function(){
	    $ionicLoading.hide();
	};

	$scope.show();
	var mapOptions = {	center: new google.maps.LatLng($scope.latitude,$scope.longitude),
					 	zoom : 15,
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						streetViewControl: false
					 };

	$scope.map =  new google.maps.Map(document.getElementById('map'), mapOptions);
	var myLocation = new google.maps.Marker({
		            position: new google.maps.LatLng($scope.latitude,$scope.longitude),
		            map: $scope.map,
					draggable: true,
		            title: "My Location"
				});
	var input = document.getElementById('addr_input');
	var autooption = {
		componentRestrictions : { country: 'id' }
	};
	var autocomplete = new google.maps.places.Autocomplete(input,autooption);

	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		myLocation.setVisible(false);
		var place = autocomplete.getPlace();
		var latlng = place.geometry.location;
		$scope.map.setCenter(latlng);
		myLocation.setPosition(latlng);
		myLocation.setVisible(true);
	});
	
	google.maps.event.addListener(myLocation,'dragend',function(){
		var latlng = myLocation.getPosition();
		$scope.latitude = latlng.lat();
		$scope.longitude = latlng.lng();
		$scope.map.setCenter(latlng);	
		var httpz = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+$scope.latitude+","+$scope.longitude+"&key=AIzaSyDwb8lxMiMVIVM4ZQ98RssfumMr8Olepzw";
		$http.get(httpz).success(function(data){
		   	$scope.full_address = data.results[0].formatted_address;
		});
		var log = 0;
		Search.remove();
		angular.forEach(areaJson, function(value,key){
			angular.forEach(value.outlet,function(value1,key1){
				var pathArray = google.maps.geometry.encoding.decodePath(value1.area);
				var pathPoly = new google.maps.Polygon({
					path: pathArray
				});
				if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng($scope.latitude,$scope.longitude),pathPoly)) {
				    log++;
				    Search.addOutlet(value1.id);
				}				
			});
		});
		$scope.areaCoverage = log;
	});
	
	$http.get("http://backoffice.satudelivery.com/protected/ordering/area.json").success(function(data){
        areaJson = data; 
        if(navigator.geolocation) {
			myLocation.setVisible(false);
	    	navigator.geolocation.getCurrentPosition(function(position) {
				$scope.latitude = position.coords.latitude;
		        $scope.longitude = position.coords.longitude;
		        $scope.accuracy = position.coords.accuracy;
		        $scope.$apply();
				
				var latlng = new google.maps.LatLng($scope.latitude,$scope.longitude);
				myLocation.setPosition(latlng);
				myLocation.setVisible(true);
		        $scope.map.setCenter(latlng);
		        
		        var httpz = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+$scope.latitude+","+$scope.longitude+"&key=AIzaSyDwb8lxMiMVIVM4ZQ98RssfumMr8Olepzw";
		        $http.get(httpz).success(function(data){
		        	$scope.full_address = data.results[0].formatted_address;
		        	
		        });
		        var log = 0;
		        Search.remove();
				angular.forEach(areaJson, function(value,key){
					angular.forEach(value.outlet,function(value1,key1){
						var pathArray = google.maps.geometry.encoding.decodePath(value1.area);
						var pathPoly = new google.maps.Polygon({
							path: pathArray
						});
						if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng($scope.latitude,$scope.longitude),pathPoly)) {
						    log++;
						    Search.addOutlet(value1.id);
						}				
					});
				});
				$scope.areaCoverage = log;
				$scope.hide();
			});
		}
		else {
			$scope.hide();
		}
	});

	$scope.searchAddress = function() {
		$scope.searchInput = true;
	};
});


app.controller('cartCtrl',function($scope,$http,$stateParams,$ionicPopup,$ionicLoading,Cart,$location) {
	$scope.outlet_id = $stateParams.outlet_id;
	$scope.brand_id = $stateParams.brand_id;
	$scope.data = {};
	$scope.data.datetimetype = 1;
	$scope.data.datetime = new Date();
	Cart.init($scope.outlet_id);
	$scope.items = Cart.getAll();
	var totalItems = Cart.getTotalItems();
	if(totalItems == 0)
		$location.path("/order/"+$scope.outlet_id+"/"+$scope.brand_id);
	
	var totalPrice = 0;
	angular.forEach($scope.items,function(value,key){
		var price_ea = parseInt(value.menu_price);
		if(value.size_id) {
			price_ea = parseInt(value.size_id.size_price);
		}
		totalPrice += parseInt(value.qty) * price_ea;
		if(value.attr) {
			angular.forEach(value.attr,function(value1,key1) {
				totalPrice += parseInt(value1.attribute_price) * parseInt(value.qty);
			});
		}
	});

	$scope.totalPrice = totalPrice;
	$scope.totalItems = totalItems;

	var urlz = url + "/getFees.php?outlet_id="+$scope.outlet_id+"&brand_id="+$scope.brand_id+"&callback=JSON_CALLBACK";
	$http.jsonp(urlz).success(function(data){
		$scope.tax_service_charge = data.charge.tax_service_charge;
		$scope.delivery_fee = data.charge.delivery_fee;
		Cart.updatePrice($scope.tax_service_charge,$scope.delivery_fee);
		$scope.grandtotal = ($scope.totalPrice*$scope.tax_service_charge/100) + $scope.totalPrice + $scope.delivery_fee;
	});

	$scope.editItem = function(index) {

	};

	$scope.deleteItem = function(index) {
		Cart.removeItem(index);
		$scope.items = Cart.getAll();
		var totalItems = Cart.getTotalItems;
		if(totalItems == 0)
			$location.path("/order/"+$scope.outlet_id+"/"+$scope.brand_id);
	};


	$scope.showPopup = function() {
		
		
		var myPopup = $ionicPopup.show({
		    templateUrl: 'datetime-template.html',
		    title: 'Please Select Date and Time',
		    scope: $scope,
		    buttons: [
		    	{ text: 'Immediate',
		    	  onTap: function(e) {
		    		$scope.data.datetimetype = 1;
		    	  	$scope.data.datetime = new Date();
		    	  }
		  		},
		      	{ text: '<b>Save</b>',
		        	type: 'button-positive',
		        	onTap: function(e) {
		        		$scope.data.datetimetype = 2;
		        		return $scope.data.datetime;
		        	}
		        },
		    ]
		});
 	};
});

app.controller('checkoutCtrl',function($scope,$http,$stateParams,$ionicPopup,$ionicLoading,Cart,$location) {
	$scope.outlet_id = $stateParams.outlet_id;
	$scope.brand_id = $stateParams.brand_id;
	Cart.init($scope.outlet_id);
});