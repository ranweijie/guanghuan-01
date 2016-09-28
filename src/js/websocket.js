// //websocket服务器
angular.module('ozApp.Websocket', [])
	.service('MyWebSock', ['$rootScope', 'Constant','$timeout', 'tools',function($rootScope, Constant,$timeout,tools) {
		//消息处理对象
		var cmdCallBacks = {};
		//socket对象
		var wsObj;
		//连接超时
		var conTimeout;
		//发送超时
		var sendTimeout;
		//钥匙连接状态
		var status = false;
		//是否重连
		var reConnect = Constant.webSockRe;
		//初始化一个websocket连接
		function init(url){
			
			//设置一个连接超时
			conTimeout = $timeout(function() {
				close();
			}, 3000);
			//new一个webscoket连接
			wsObj = new WebSocket(url);
			//连接成功
			wsObj.onopen = onOpen;
			//收到消息
			wsObj.onmessage = onMessage;
			//连接失败
			wsObj.onerror = onError;
			//连接关闭
			wsObj.onclose = onClose;
		}
		//连接成功处理方法
		function onOpen(){
			//更新状态为已连接
			status = true;
			//隐藏钥匙未连接成功提示模块
			$rootScope.$apply(function(){
				if ($rootScope.showNotConnectApp){
					$rootScope.showNotConnectApp = false;
					tools.showTips(2000,"已正常连接钥匙,现在可以做任务啦");
				}
				
			});
			
			//连接成功，取消连接时设置的超时
			if (conTimeout){
				$timeout.cancel(conTimeout);
			}
		}
		//收到消息处理方法
		function onMessage(evt){
			//收到时，取消发送设置的超时
			if (sendTimeout){
				$timeout.cancel(sendTimeout);
			}
			//根据data内的cmd指令，再结合注册的数组进行分配。
			var data = angular.fromJson(evt.data);
			var callBackFunc = cmdCallBacks[data.cmd];
			if (callBackFunc) {
				callBackFunc(data)
			}
		}
		//连接失败处理方法
		function onError(){
			//更新状态为未连接
			status = false;
			//连接失败，也取消连接时设置的超时
			if (conTimeout){
				$timeout.cancel(conTimeout);
			}
			
		}
		//连接关闭处理方法
		function onClose(){
			//更新状态为未连接
			status = false;
			//连接关闭了，是否重新连接
			if (reConnect){
				$timeout(function(){
					startWebsocket();
				},2000);
			}
		}
		//注册消息处理集合
		function reg(cmd, callback){
			cmdCallBacks[cmd] = callback
		}
		//发送消息方法
		function sendData(data){
			//为了体验，只有在发送消息时，判断下socket状态，状态不正常，就显示钥匙连接不成功模块。
			if (1 != wsObj.readyState) {
					close();
					tools.emitMsg("ozAppIsNoReady","YES");
					$rootScope.showNotConnectApp = true;
					return;
				}
			//开始计时，看发送消息到回复消失是否超时,15秒
			//如果之前有，先取消
			if (sendTimeout){
				$timeout.cancel(sendTimeout);
			}
			sendTimeout = $timeout(function(){
				//广播事件,给下面的scope接受事件处理
				tools.emitMsg("sendMsgTimeout","YES");
			},15000);
			wsObj.send(data);
		}
		//我主动关闭连接
		function close(){
			wsObj.close();
		}
		//返回连接状态
		function webstatus(){
			return status;
		}
		//启动websocket
		function startWebsocket(){
			//如果为未连接，那么可以启动。
			if (!status){
				//浏览器需要支持WebSocket
				if (window.WebSocket){
					init(Constant.webSockUrl)
				}else{
					alert('浏览器版本太低，不支持websocket,无法进行正常任务!');
					return;
				}
			}else{
				//已连接，先关闭再连接
				close();
				startWebsocket();
			}
		}
		//向外提供接口
		return {
			Reg: reg,
			webSockStatus:webstatus,
			sendData: sendData,
			Close: close,
			startWebsock: startWebsocket
		}
	}]);