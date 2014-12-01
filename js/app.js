var url = "http://128.199.190.218";
var app = angular.module('indexApp', [
  "sdfilters",
  "cart",
  "ionic"
]);

app.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('login', {
					url : '/login',
					templateUrl : 'login.html',
					controller : 'loginCtrl'
	}).state('home', { 	url : '/',
						templateUrl : 'home.html',
						controller : 'homeCtrl'
	}).state('addAddress', { 
						url : '/addAddress',
						templateUrl : 'address.html',
						controller : 'mapsCtrl'
	}).state('search', { 
						url : '/search/:addr_id',
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
	});	
}]);

app.config(function($urlRouterProvider){
    // when there is an empty route, redirect to /index   
    $urlRouterProvider.when('', '/');
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

app.controller('homeCtrl',function($scope,$location){
    $scope.toMap = function(){
	$location.path('/addAddress');
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

app.controller('searchCtrl',function($scope,$stateParams,$http){
	$scope.addr_id = $stateParams.addr_id;
	var urlLogin = url + "/search.php?addr_id="+$scope.addr_id+"&callback=JSON_CALLBACK";
	$http.jsonp(urlLogin)
		.success(function(data) {
			$scope.outlets = data.outlet;
		});
});

app.controller('orderCtrl',function($scope,$stateParams,$ionicModal,$http,Cart,$ionicLoading){
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

  	Cart.init();
  	$scope.items = Cart.getTotalItems();
  	$scope.prices = Cart.getTotalPrice();
}).directive('cartcontents',function() {
	return {
		restrict : 'E',
		templateUrl: 'cartcontents-template.html'
	};
});

app.controller('mapsCtrl',function($scope) {
	$scope.txt = "asdasD";
	
	$scope.map = new google.maps.Map(document.getElementById('map-canvas'), {
		center : new google.maps.LatLng(-6.219260,106.812410),
		zoom : 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		scrollwheel: false,
		streetViewControl: false
	});

	var infowindow = new google.maps.InfoWindow({
		maxWidth : 300
	});

	var marker = new google.maps.Marker({
		map : $scope.map,
		anchorPoint: new google.maps.Point(0,-29),
		draggable :true,
	  });

	var input = document.getElementById('addr_input');
	var autooption = {
		componentRestrictions : { country: 'id' }
	};

	var autocomplete = new google.maps.places.Autocomplete(input,autooption);

	google.maps.event.addListener(autocomplete,'place_changed',function(){
		
	});
});