//指令服务,相当于通用模版

angular.module('ozApp.directive', [])

//无痕或者隐私模式时.
.directive('traceless',function(){
	return{
		restrict:'E',
		template:'\
		<div class="start-wuhen" ng-if="isWuhen"> \
		<h4>温馨提示</h4> \
		<p>为了您良好的体验，请不要使用无痕或者隐私模式浏览网站，谢谢。退出无痕模式重新访问即可。</p> \
		</div>',
		replace:true
	};
})
//无钥匙提示
.directive('noapp',['Constant','$timeout',function(Constant,$timeout){
	return{
		restrict:'E',
		template:'\
		<div id="appkey" ng-if="showNotConnectApp">\
		<div id="hintbox">\
		<h4>温馨提示</h4>\
		<div class="smile">\
		<svg xmlns="http://www.w3.org/2000/svg" version="1.1">\
		 	<circle cx="25" cy="20" r="10" stroke="gray" stroke-width="2" fill="gray" />\
		  	<circle cx="75" cy="20" r="10" stroke="gray" stroke-width="2" fill="gray" />\
			<ellipse cx="50" cy="60" rx="15" ry="20" style="fill:white;stroke:gray;stroke-width:2" />\
		</svg>\
		</div>\
		<h5>未检测到钥匙,请打开钥匙</h5>\
		<p>若重复提示,请手动关闭钥匙再打开</p>\
		<div class="appkey_btn">\
			<button type="button" ng-click="closeAppKeyBox()">打开钥匙</button>\
			<p>若钥匙打开无效或闪退,请重新<span ng-click="downNewApp()">下载新版钥匙</span></p>\
		</div>\
		</div>\
		</div>',
		link:function(scope){
			//关闭
			scope.closeAppKeyBox = function(){
		      scope.showNotConnectApp = false;
		      //打开钥匙
		      window.location.href = Constant.ozScheme;
		      //10秒后刷新当前页面
		      $timeout(function(){
		        window.location.reload();
		      },10000);
   		 	}
   		 	//下载新版钥匙
   		 	scope.downNewApp = function(){
   		 		//安装助手
				window.location.href = Constant.plistAdd;
   		 	}
		},
		replace:true
	};
}])
//IOS9企业帐号信任设置提示.
.directive('ios9seting',[function(){
	return{
		restrict:'E',
		template:'\
		<div class="ios9seting" ng-show="showIos9Seting" ng-click="ios9Close(1,$event)">\
		<div class="ios9-box" ng-click="ios9Close(2,$event)">\
		<div class="ios9-title">\
			ios9小伙伴注意了\
		</div>\
		<div class="ios9-close" ng-click="ios9Close(1,$event)">x</div>\
		<div class="ios9-explain">\
		偶赚App是一款企业级应用,需要信任企业帐号才能使用,<b style="color:red;">安装完成后</b>请按下面步骤操作:\
		</div>\
		<div class="ios9-explain-bold">\
		设置-->通用-->描述文件与设备管理-->找到AURA打头的企业级应用-->进入后信任即可打开偶赚。\
		</div>\
		<div class="ios9-explain-to-seting">直接去设置:(信任后才能在桌面打开偶赚)</div>\
		<div class="ios9-toSeting" >\
			<div class="install" ng-click="ios9ToSeting()" id="install" ng-class="{true:\'isInstall\'}[!isInstall]"><div ng-bind="installText"></div></div>\
		</div>\
		</div>\
		</div>',
		link:function(scope){
			//关闭设置界面
			scope.ios9Close = function(id,$event){
				$event.stopPropagation();
				if (id == 2){
					return
				}
				scope.showIos9Seting = false;
			}
			
		},
		replace:true
	};
}])

//绑定微信
.directive('bindwx',['Constant','tools',function(Constant,tools){
	return{
		restrict:'E',
		template:'\
		<div class="bind-wx-container" ng-if="showWxBind">\
		<div class="bind_wx_title_bar">\
			<div class="main-box-back" ng-click="closeBindBox()">\
				<i class="iconfont">&#xe614;</i>\
			</div>\
			<div class="bind-wx-title" >绑定微信</div>\
		</div>\
		<div class="bind-wx-content-container">\
			<div class="bind-wx-item1">1、请使用微信搜索关注[偶赚]公众号！关注后点击[绑定微信]菜单即可自动绑定。</div>\
			<div class="bind-wx-keyword" oncopy="onCopyWx()" id="cashCopyKey">\
			偶赚\
			</div>\
			<div class="bind-wx-item1">2、也可以截屏保存到相册，在微信中扫一扫中选择从相册中选取二维码进行关注！关注后点击[绑定微信]菜单即可自动绑定。</div>\
			<div class="bind-wx-qrcode">\
			<img src="http://cdn.ozhuan.com/ozhuan/img/ozqrcode2.jpg" alt="偶赚">\
			</div>\
			<div class="bind-wx-towx" ng-click="toWeiXin()">打开微信</div>\
		</div>\
	</div>',
		link:function(scope, element, attrs){
			//绑定复制的关键字
			(function(){
				//copy事件
				window.onCopyWx = function() {
					if (tools.getLocalStorage('bindwx')){
						tools.removeStorageItem('bindwx');
					}
					location.href = Constant.safariToWx;
				}
				//自动全选
				document.addEventListener("selectionchange", function(e) {
	            	if(window.getSelection().anchorNode.parentNode.id == 'cashCopyKey' && document.getElementById('cashCopyKey').innerText != window.getSelection()){
	                	var key = document.getElementById('cashCopyKey');
	               	 	window.getSelection().selectAllChildren(key);
	            	}
	        	}, false);
			})();
			//去微信
			scope.toWeiXin = function() {
				//有绑定微信的就去掉
				if (tools.getLocalStorage('bindwx')){
					tools.removeStorageItem('bindwx');
				}
				location.href = Constant.safariToWx;
			};
			//关闭此界面
			scope.closeBindBox = function() {
				//清除绑定微信标志
				if (tools.getLocalStorage('bindwx')){
					tools.removeStorageItem('bindwx');
				}
				scope.showWxBind = false;
			};
		},
		replace:true
	};
}])

//绑定手机
.directive('bindmobile',function(){
	return{
		restrict:'E',
		template:'\
		<div class="bind-phone-container" ng-if="showPhoneBind"><div>\
		<div class="main-box-back" ng-click="closePhoneBindBox()">\
			<i class="iconfont">&#xe614;</i>\
		</div>\
		<div class="bind-phone-title" >绑定手机</div>\
		</div>\
		<div class="bind-phone-content-container">\
			<div class="bind-phone-item1">\
				<input type="tel"  placeholder="输入11位手机号" maxlength="11" ng-model="phoneObj.phoneNum">\
				<button type="button" ng-click="sendCode()" ng-bind="sendText" ng-disabled="disableSend" ng-class="{true:\'bind-phone-item1-disabled\'}[disableSend]">发送验证码</button>\
			</div>\
			<div class="bind-phone-item2">\
			<input type="tel" placeholder="输入5位验证码" maxlength="5" ng-model="phoneObj.codeNum">\
			</div>\
			<button class="bind-phone-item3" ng-click="commitPhone()" ng-disabled="!phoneObj.codeNum || !phoneObj.phoneNum" ng-class="{true: \'bind-phone-item3-disabled\'}[!phoneObj.codeNum || !phoneObj.phoneNum]">确定</button>\
			<div ng-show="!phoneObj.phoneNum" class="bind-phone-tips">请输入11位手机号</div>\
			<div ng-show="!phoneObj.codeNum" class="bind-phone-tips">请输入5位验证码</div>\
		</div></div>',
		link:function(scope){
			scope.closePhoneBindBox = function() {
				scope.showPhoneBind = false;
			}
		},
		replace:true
	};
})

//动画加载
.directive("showzhuanloading",function(){
	return{
		restrict:'E',
		template:'\
		<div class="zhuan_fixed" ng-if="ShowZhuanLoad">\
		<div class="zhuan_box">\
			<div class="zhuan_svg">\
				<svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\
					viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">\
				<g id="XMLID_2_">\
				<path id="XMLID_3_" fill="#f8f8f8" d="M19.6,12.4l-5.6,27H9.7L12,27.9h-1.8V7.6h12.7v20.3h-3.2V10.1h-6.3v11.4l2-9.1H19.6z M23,39.4h-4.4\
				l-2.3-10.5h4.4L23,39.4z M26.7,24.8l-0.8,14.6h-2.7L24,24.8H26.7z M42.4,11.3h-5.1v1.5h3.9V17h1.1v2.5h-1.1v4.1h-3.9v15.8H33V23.6\
				h-1.4v15.8h-4.2V23.6h-3.2v-2.5h3.2v-1.5h-3.8V17h3.8v-1.7h-3.2v-2.5h3.2v-1.5h-3.8V8.6h18.8V11.3z M31.5,8.2h-5.3l5.3-2.5V8.2z\
				M33,12.8v-1.5h-1.4v1.5H33z M33,17v-1.7h-1.4V17H33z M33,21.1v-1.5h-1.4v1.5H33z M39.9,8.2h-5.3l5.3-2.5V8.2z M38.5,15.3h-1.1V17\
				h1.1V15.3z M38.5,21.1v-1.5h-1.1v1.5H38.5z M42.4,39.4h-3.5l-1.3-14.6H41L42.4,39.4z"/>\
				</g>\
				</svg>\
			</div>\
			<div class="zhuan_desc" ng-bind="zhuanLoadText">正在加载</div>\
			<div class="zhuan_loading">\
				<span></span>\
				<span></span>\
				<span></span>\
			</div>\
		</div>\
	</div>\
		',
		link:function(scope){
			scope.zhuanLoadText = "正在抢任务";
		},
		replace:true
	}
});