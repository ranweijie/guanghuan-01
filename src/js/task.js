//任务方面的处理
angular.module('ozApp.Task', [])

.service('Task', ['Constant', 'httpService', 'MyWebSock', 'Auth', 'tools', function(Constant, httpService, MyWebSock, Auth, tools) {
		
		//通知钥匙开启一个任务
		function startTask(dataObj,callback){
			//钥匙返回startTask的结果回调注册
			MyWebSock.Reg("startTask", StartTask);
			//发送开启任务
			var o = {
				"cmd": "startTask",
				"v": "v1.0",
				"data": {
					"sid": Auth.userInfo.get("sid") || '0',
					"uid": Auth.userInfo.get("uid") || 0,
					'token':Auth.userInfo.get("base").token || '0',
					"taskId": dataObj.taskId,
					"prj_name": dataObj.prj_name,
					"bundle_id": dataObj.bundle_id,
					"appid":dataObj.appid,
					"CheckInstalledUrl":dataObj.CheckInstalledUrl,
					"timeout": dataObj.timeout,
					"runTargetAppTime": dataObj.runTargetAppTime
				}
			};

			var i = angular.toJson(o);
			console.log("startTask = ",i);
			
			MyWebSock.sendData(i);
			
			function StartTask(resp) {
				if (resp.data.code == 0){
					callback(0,resp.data.msg);
				}else{
					//并通知
					if (resp.data.code){
						callback(resp.data.code,resp.data.msg);
					}else{
						callback(1,resp.data.msg);
					}
					
				}
			}
		}
		//向钥匙发送请求checkTask检测一个任务是否完成
		function checkTask(taskId, callback){
			//注册检测任务处理函数
			MyWebSock.Reg("checkTask", CheckTask);
			//发送开启任务
			var o = {
				"cmd": "checkTask",
				"v": "v1.0",
				"data": {
					"sid": Auth.userInfo.get("sid"),
					"uid": Auth.userInfo.get("uid"),
					"taskId": taskId
				}
			};
			var i = angular.toJson(o);
			
			MyWebSock.sendData(i);
		
			function CheckTask(resp) {
				callback(resp);
			}
		}
		//从钥匙那里获取第三方任务列表
		function getTask3rdList(callback){
			//注册检测任务处理函数
			MyWebSock.Reg("get3rdDouJin", getList);
			//发送开启任务
			var o = {
				"cmd": "get3rdDouJin",
				"v": "v1.0",
				"data": {}
			};
			var i = angular.toJson(o);
			MyWebSock.sendData(i);
			//处理函数
			function getList(resp){
				callback(resp);
			}
		}
		//通知钥匙开启一个第三方任务
		function start3rdTask(id,callback){
			//注册检测任务处理函数
			MyWebSock.Reg("start3rdDouJinTask", Start3rdTask);
			//发送开启任务
			var o = {
				"cmd": "start3rdDouJinTask",
				"v": "v1.0",
				"data": {
					"douJstoreID":id
				}
			};
			//
			var i = angular.toJson(o);
			MyWebSock.sendData(i);
			function Start3rdTask(resp){
				callback(resp);
			}
		}
		//放弃一个第三方任务
		function giveUp3rdTask(id,callback){
			//注册检测任务处理函数
			MyWebSock.Reg("giveUp3rdDouJinTask", Start3rdTask);
			//发送开启任务
			var o = {
				"cmd": "giveUp3rdDouJinTask",
				"v": "v1.0",
				"data": {
					"douJstoreID":id
				}
			};
			//
			var i = angular.toJson(o);
			MyWebSock.sendData(i);

			function Start3rdTask(resp){
				callback(resp);
			}
		}
		//用safari打开一个url
		function openUrlUseSafari(url){
			//发送
			var o = {
				"cmd": "launchSafariUrl",
				"v": "v1.0",
				"data": {
					"url":url
				}
			};
			//
			var i = angular.toJson(o);
			MyWebSock.sendData(i);
		}
		//非safari时,即在webview中，用websocket发送给钥匙进行微信分享
		function shareToWx(typeid,shareurl,title,desc){
			var action = "shareUrlToHY";
			if (typeid == 1){
				action = "shareUrlToHY";
			}else {
				action = "shareUrlToPYQ";
			}
			//发送
			var o = {
				"cmd": "share",
				"v": "v1.0",
				"data": {
					"action":action,
					"text":shareurl || "",
					"title":title || "",
					"desc":desc || ""
				}
			}
			//
			var i = angular.toJson(o);
			MyWebSock.sendData(i);
		}
		//获取app版本信息
		function getAppVersion(callback){
			var o = {
				"cmd": "getAppVersion",
				"v": "v1.0",
				"data": {
				}
			}
			//
			var i = angular.toJson(o);
			MyWebSock.sendData(i);
			//注册检测任务处理函数
			MyWebSock.Reg("getAppVersion", getAppVersionBack);
			function getAppVersionBack(resp){
				//版本号在resp.data.appVersion
				//构建版本号在resp.data.buildVersion
				callback(resp);
			}
		}
		//获取任务进度
		function getTaskState(taskId,callback){
			var o = {
				"cmd": "getTaskState",
				"v": "v1.0",
				"data": {
					taskId:taskId
				}
			}
			//
			var i = angular.toJson(o);
			MyWebSock.sendData(i);
			//注册检测任务处理函数
			MyWebSock.Reg("getTaskState", getTaskStateBack);
			function getTaskStateBack(resp){
				//任务进度在msg中
				callback(resp);
			}
		}
		//放弃己方平台任务
		function giveUpOwnTask(Id,callback) {
			var o = {
				"cmd": "giveUpOwnTask",
				"v": "v1.0",
				"data": {
					taskId:Id
				}
			}
			//
			var i = angular.toJson(o);
			MyWebSock.sendData(i);
			//注册检测任务处理函数
			MyWebSock.Reg("giveUpOwnTask", giveUpOwnTaskBack);
			function giveUpOwnTaskBack(resp){
				//任务进度在msg中
				callback(resp);
			}
		}
		//获取devicetoken
		function getPushDc(callback) {
			var o = {
				"cmd": "getPushDc",
				"v": "v1.0",
				"data": {
				}
			}
			//
			var i = angular.toJson(o);
			MyWebSock.sendData(i);
			//注册检测任务处理函数
			MyWebSock.Reg("getPushDc", getPushDcBack);
			function getPushDcBack(resp){
				//任务进度在msg中
				callback(resp);
			}
		}
		//向外提供接口
		return {
			
			startTask: startTask,
			
			checkTask: checkTask,

			getTask3rdList:getTask3rdList,

			start3rdTask:start3rdTask,

			giveUp3rdTask:giveUp3rdTask,

			openUrlUseSafari:openUrlUseSafari,

			shareToWx:shareToWx,
			
			getAppVersion:getAppVersion,
			
			getTaskState:getTaskState,
			
			giveUpOwnTask:giveUpOwnTask,
			
			getPushDc:getPushDc
		}
}]);