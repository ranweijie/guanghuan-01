
//一个过滤器
angular.module('ozApp.filter', [])

//分转化成元的过滤器,完全转换,不打折
.filter('fenToYuan',['tools',function(tools){
	 
	
	return function(fen){
		var yuan = fen/100;
		yuan = yuan.toFixed(2);
		//判断是否是数字
		if (isNaN(yuan)){
			yuan = 0;
		}
		yuan = parseFloat(yuan);
		yuan = tools.toDecimal2(yuan);
		return yuan;
	};
}])
//分转化成元的过滤器，0.8折
.filter('fenToYuanHalve',['tools',function(tools){
	return function(fen){
		var yuan = (fen*0.8)/100;
		//保留两位小数，并转成数字类型。
		yuan = yuan.toFixed(2);
		yuan = parseFloat(yuan);
		//判断是否是数字
		if (isNaN(yuan)){
			yuan = 0;
		}
		yuan = tools.toDecimal2(yuan);
		return yuan;
	};
}])
//时间戳转成可视日期
.filter('toLocalTime',[function(){
	return function(timeStamp){
		var s = new Date(parseInt(timeStamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ").replace(/GMT\+8/," ");
		return s; 
	}
}]);