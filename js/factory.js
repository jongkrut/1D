angular.module('cart',[]).factory('Cart',function(){
	var cart = {
		outlet_id : '',
		tax_service_charge : '',
		delivery_charge : '',
		grandtotal : '',
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
		getTaxCharge:function(){
			return tax_service_charge;
		},
		getDeliveryFee: function(){
			return delivery_charge;
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
		},
		updatePrice : function(tsc,delfee){
			tax_service_charge = tsc;
			delivery_charge = delfee;
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
			localStorage.setItem("latitude","");
			localStorage.setItem("longitude","");
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
			localStorage.setItem("latitude","");
			localStorage.setItem("longitude","");
		},
		addLoc: function(lat,lng) {
			localStorage.setItem("latitude",lat);
			localStorage.setItem("longitude",lng);
		},
		getLat : function() {
			return localStorage.getItem("latitude");
		},
		getLng : function(){
			return localStorage.getItem("longitude");
		}
	}
	return cart;
});

angular.module('customer',[]).factory('Customer',function($rootScope){
	var cart = {
		customer : '',
		address : '',
		init: function(customer){
			localStorage.setItem("customer",JSON.stringify(customer));
		},
		setAddress: function(address) {
			localStorage.setItem("customer_address",JSON.stringify(address));
		},
		getCustomer: function() {
			return JSON.parse(localStorage.getItem("customer"));
		},
		getAddress: function() {
			return JSON.parse(localStorage.getItem("customer_address"));
		},
		getAddressByID:function(index){
			var address = JSON.parse(localStorage.getItem("customer_address"));
			return address[index];
		},
		getDefaultAddress : function(){
			address = JSON.parse(localStorage.getItem("customer_address"));
			var addr = "";
			for(var i = 0; i < address.length;i++){
				if(address[i].default_address == 1) {
					addr = address[i];
					break;
				}
			}
			return addr;
		},
		logout: function(){
			localStorage.removeItem("customer");
			localStorage.removeItem("customer_address");
			$rootScope.$broadcast('state.update');
		},
		isLogged : function(){
			if(localStorage.getItem("customer") == null)
				return false;
			else
				return true;
		}
	}
	return cart;
});