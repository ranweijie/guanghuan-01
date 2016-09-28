//http请求服务,向web服务器
angular.module('ozApp.Http', [])
.service('httpService', ['$http', function($http) {
	return {
		commonPost:function(url,postData,callback){
			$http.post(url, postData)
				.success(function(resp) {
					callback(resp);
				}).error(function() {
					callback({code:-1});
				});
		},
		commonGet:function(url,callback){
			$http.get(url)
				.success(function(resp) {
					callback(resp);
				}).error(function() {
					callback({code:-1});
				});
		}
	};

}]);