angular.module('cart',[]).factory('Cart',function(){
	var cart = {
		outlet_id : '',
		init: function(outlet){
			outlet_id = outlet;
			if(localStorage.getItem("cart-"+outlet_id) == null)
				localStorage.setItem("cart-"+outlet_id,JSON.stringify([]));
		},
		getAll: function(){
			return JSON.parse(localStorage.getItem("cart-"+outlet_id));
		},
		getTotalItems: function(){
			var items = JSON.parse(localStorage.getItem("cart-"+outlet_id));
			var total = 0;
			for(var i = 0; i < items.length;i++){
				total = total + parseInt(items[i].qty);
			}
			return total;
		},
		getTotalPrice: function(){
			var items = JSON.parse(localStorage.getItem("cart-"+outlet_id));
			var total = 0;
			for(var i = 0; i < items.length;i++){
				if(items[i].size == undefined) {
					total = total + (parseInt(items[i].qty) * parseInt(items[i].menu_price));
				}
			}
			return total;
		},
		addItem: function(item) {
			var items = JSON.parse(localStorage.getItem("cart-"+outlet_id));
			items.push(item);
			localStorage.setItem("cart-"+outlet_id,JSON.stringify(items));
		},
		removeItem: function(index){
			var items = JSON.parse(localStorage.getItem("cart-"+outlet_id));
			items.splice(index,1);
			localStorage.setItem("cart-"+outlet_id,JSON.stringify(items));
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

angular.module('customer',[]).factory('Customer',function(){
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