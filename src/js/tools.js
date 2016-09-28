//工具箱
angular.module('ozApp.tools', [])

	.factory('tools', ['$rootScope', '$timeout','Constant', function ($rootScope, $timeout,Constant) {
		//获得cookie值
		function getCookie(name) {
			var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
			if (arr = document.cookie.match(reg))
				return unescape(arr[2]);
			else
				return null;
		}
		//设置cookie,默认是30天的过期时间
		function setCookie(name, value) {
			var Days = 30;
			var exp = new Date();
			exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
			document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
		};
		//清除cookie  
		function clearCookie(name) {  
			var Days = -1;
			var exp = new Date();
			exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
			document.cookie = name + "=" +"" + ";expires=" + exp.toGMTString();
		} 
		//数组去重复
		function arrayUnique(arr) {
			var ret = []
			var hash = {}
			for (var i = 0; i < arr.length; i++) {
				//要设置对象中的一个属性来比对才能更正确。
				var item1 = arr[i].Title;
				var item2 = arr[i];
				var key = item1;
				if (hash[key] !== 1) {
					ret.push(item2)
					hash[key] = 1
				}
			}
			return ret
		};
		//返回一个随机数,返回0~num之间的数,不包括num
		function getRandNum(num) {
			return Math.floor(Math.random() * num);
		}
		//提示消息
		function showTips(time, text) {
			if ($rootScope.ShowLoading){
				$rootScope.ShowLoading = false;
			}
			$rootScope.loadText = text;
			$rootScope.ShowLoading = true;
			$timeout(function () {
				$rootScope.ShowLoading = false;
				$rootScope.loadText = "加载中...";
			}, time);
		}
		//判断是否微信
		function isWeixin() {
			if (navigator.userAgent.match(/MicroMessenger/i)) {
				return true;
			}
			return false;
		}
		//判断是否是QQ
		function isQQ() {
			if (navigator.userAgent.match(/QQ/i)) {
				return true;
			}
			return false;
		}
		//返回ios版本号
		function iOSVersion() {
			//判断是不是苹果手机、平板、pod等
			if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
				if (navigator.userAgent.match(/OS [9]_\d[_\d]* like Mac OS X/i)) {
					return 9;
				} else if (navigator.userAgent.match(/OS [5]_\d[_\d]* like Mac OS X/i)) {
					return 5;
				} else if (navigator.userAgent.match(/OS [6]_\d[_\d]* like Mac OS X/i)) {
					return 6;
				} else if (navigator.userAgent.match(/OS [7]_\d[_\d]* like Mac OS X/i)) {
					return 7;
				} else if (navigator.userAgent.match(/OS [8]_\d[_\d]* like Mac OS X/i)) {
					return 8;
				} else if (navigator.userAgent.match(/OS [10]_\d[_\d]* like Mac OS X/i)) {
					return 10;
				} else {
					return 88;
				}
			} else {
				return 77;
			}
		}
		//浏览器是否是无痕或者隐私模式,这里用localstorage来测试...
		function isWuHen() {
			try {
				localStorage.setItem("test", "testdata");
				return false;
			} catch (e) {
				return true;
			}
		}
		//制保留2位小数，如：2，会在2后面补上00.即2.00    
		function toDecimal2(x) {    
			var f = parseFloat(x);    
			if (isNaN(f)) {    
				return false;    
			}    
			var f = Math.round(x*100)/100;    
			var s = f.toString();    
			var rs = s.indexOf('.');    
			if (rs < 0) {    
				rs = s.length;    
				s += '.';    
			}    
			while (s.length <= rs + 2) {    
				s += '0';    
			}    
			return s;    
		}
		//截取app大小，转换成数字超时时间（单位秒）
		function appSizeToTime(appSize){
			if (!appSize){
				return 300;
			}
			var reg = new RegExp(/M/gi);
			var size =  parseInt(appSize.replace(reg,""));
			
			var time = size*Constant.runAppTimeOut*60; 
			//如果时间太小了。。那么最低300秒。
			if (time < 300){
				time = 300;
				//大于一小时的，最高一小时.
			}else if(time > 3600 ){
				time = 3600;
			}
			return time;
		} 
		//获取urlget参数
		function GetQueryString(name)
		{
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null)return  unescape(r[2]); return null;
		}
		//判断是否是
		var fun = {
			getRandNum: getRandNum,
			//存储cookie
			setCookie: setCookie,
			//获取cookie数据
			getCookie: getCookie,
			//清楚cookie
			clearCookie:clearCookie,
			//清除所有localstorage数据
			removeStorage: function () {
				localStorage.clear();
			},
			//清除指定key的localstorage数据
			removeStorageItem: function (key) {
				localStorage.removeItem(key);
			},
			//存储到本地localstorage
			toLocalStorage: function (key, val) {
				localStorage.setItem(key, val);
			},
			//根据key值获取本地的localstorage数据
			getLocalStorage: function (key) {
				return localStorage.getItem(key);
			},
			//提示模版，可以自定义时间
			showTips: showTips,
			//通过rootscope发布事件
			emitMsg: function (msg, data) {
				var data = data || {};
				$rootScope.$emit(msg, data);
			},
			//scope接受事件
			onMsg: function (msg, func, scope) {
				var unbind = $rootScope.$on(msg, func);
				//当传进来的scope被销毁时，销毁这个发送事件
				if (scope) {
					scope.$on('$destroy', unbind);
				}
			},
			//数组去重
			arrayUnique: arrayUnique,

			//判断是否微信
			isWeixin: isWeixin,

			//是否qq
			isQQ: isQQ,
			//iOS版本号
			iOSVersion: iOSVersion,
			
			//无痕模式
			isWuHen:isWuHen,
			
			//强制保留两位小数
			toDecimal2:toDecimal2,
			
			//截取包大小返回超时时间
			appSizeToTime:appSizeToTime,
			
			//获取get参数
			GetQueryString:GetQueryString
		};

		return fun;
	}])