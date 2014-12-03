angular.module('cart',[]).factory('Cart',function(){
	var cart = {
		items : '',
		init: function(){
			localStorage.setItem("cart",JSON.stringify([]));
		},
		getAll: function(){
			return JSON.parse(localStorage.getItem("cart"));
		},
		getTotalItems: function(){
			var items = JSON.parse(localStorage.getItem("cart"));
			var total = 0;
			for(var i = 0; i < items.length;i++){
				total = total + parseInt(items[i].qty);
			}
			return total;
		},
		getTotalPrice: function(){
			var items = JSON.parse(localStorage.getItem("cart"));
			var total = 0;
			for(var i = 0; i < items.length;i++){
				if(items[i].size == undefined) {
					total = total + (parseInt(items[i].qty) * parseInt(items[i].menu_price));
				}
			}
			return total;
		},
		addItem: function(item) {
			var items = JSON.parse(localStorage.getItem("cart"));
			items.push(item);
			localStorage.setItem("cart",JSON.stringify(items));
		},
		removeItem: function(index){

		}
	}
	return cart;
});

angular.module('search',[]).factory('Search',function(){
	var cart = {
		items : '',
		latitude : '',
		longitude : '',
		init: function(){
			localStorage.setItem("search",JSON.stringify([]));
		},
		getAll: function(){
			return localStorage.getItem("search");
		},
		addOutlet: function(outlet) {
			var items = JSON.parse(localStorage.getItem("search"));
			items.push(outlet);
			localStorage.setItem("search",JSON.stringify(items));
		},
		remove: function(){
			localStorage.setItem("search",JSON.stringify([]));
		},
		addLoc: function(lat,lng) {
			latitude = lat;
			longitude = lng;
		},
		getLoc : function() {
			return latitude + "," + longitude;
		}
	}
	return cart;
});