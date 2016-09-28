//登录登出等认证服务
angular.module('ozApp.Auth', [])

	.service('Auth', ['$location', '$rootScope', 'MyWebSock', 'Constant', 'httpService', 'tools', '$timeout','$interval', function ($location, $rootScope, MyWebSock, Constant, httpService, tools, $timeout,$interval) {

		var UserInfo = {};
		//向web服务器获取sessionid
		function getSessionId(callback) {
			httpService.commonPost(Constant.getSessionid, {}, function (resp) {
				callback(resp);
			});
		}
		//向web服务器发登录请求
		function loginToServer(token, sign, callback) {
			var postData = {
				uid: UserInfo.uid,
				token: token,
				sid: UserInfo.sid,
				uuid: UserInfo.uuid,
				sign: sign
			};
			httpService.commonPost(Constant.userLogin, postData, function (resp) {
				if (resp.code == 0) {
					callback(0, resp);
				} else {
					callback(-1, resp.code === -1 ? "请求失败" : resp.msg);
				}
			});
		}
		//向web服务器发起注册请求
		function registerToServer(teachedId,channelId, callback) {
			var postData = {
				deviceInfo: "nodeviceInfo",
				uuid: UserInfo.uuid,
				netType: 1,
				longitude: 12.3,
				latitude: 1.2,
				promoCode: teachedId,
				channelId:channelId || ""
			};
			
			httpService.commonPost(Constant.regUser, postData, function (resp) {
				callback(resp);
			});
		}
		//向钥匙发起登录请求
		function loginToApp(timestamp) {
			var o = {
				"cmd": "login",
				"v": "v1.0",
				"data": {
					"sid": UserInfo.sid,
					"timestamp": timestamp
				}
			};
			var i = angular.toJson(o);
			
			MyWebSock.sendData(i);
		}
		
		//向钥匙发起注册通知
		function registerToApp(token, sign) {
			var postData = {
				"cmd": "set_user_info",
				"v": "v1.0",
				"data": {
					"sid": UserInfo.sid,
					"uid": UserInfo.uid,
					"token": token,
					"sign": sign
				}
			};
			var jsonString = angular.toJson(postData);
			MyWebSock.sendData(jsonString);
		}
		//向钥匙获取设备信息.
		function getInfoFromApp(type, callback) {
			MyWebSock.Reg("getInfo", OnInfo);
			//发送登陆指令
			var o = {
				"cmd": "getInfo",
				"v": "v1.0",
				"data": {
					"sid": UserInfo.sid,
					"uid": UserInfo.uid,
					"bid": "b123456",
					"type": type
				}
			};
			var i = angular.toJson(o);
			MyWebSock.sendData(i);
			function OnInfo(data) {

				if (data.data.code == 0) {
					callback(true, data.data.data.uuid);
				} else {
					callback(false, "notgetdeviceinfo");
				}
			}
		}
		//对外注册接口
		function RegApi(teachedId,channelId, callback) {
			registerToServer(teachedId,channelId, function (regresp) {
				if (regresp.code == 0) {
					//注册成功,向钥匙通知注册消息
					UserInfo.uid = regresp.data.uid;
					registerToApp(regresp.data.base.token, regresp.data.sign);
					//注册请求回调函数
					MyWebSock.Reg("set_user_info", setUserInfo);
					function setUserInfo(appresp) {
						if (appresp.data.code == 0) {
							callback(1);
						} else {
							callback(2);
						}
					}
				} else if (regresp.code == 103) {
					callback(103);
				} else {
					callback(3);
				}
			});
		}
		//对外的登录接口
		function LoginApi(callback) {
			// var loginCallback = callback;
			//第一步，向web服务器获取sessionid和时间戳，用于向钥匙登录的参数
			getSessionId(function (sessionResp) {
				if (sessionResp.code == 0) {

					//保存sessionId数据到用户对象
					UserInfo.sid = sessionResp.data.sid;
					//注册钥匙登录回调
					MyWebSock.Reg("login", loginRespFromApp);
					//向钥匙发起登录请求
					loginToApp(sessionResp.data.timestamp);
					//处理钥匙登录的回调函数
					function loginRespFromApp(appresp) {
						UserInfo.uuid = appresp.data.uuid;
						//判断钥匙是否授权登录
						if (appresp.data.code == 0) {

							//保存uid到userinfo中
							UserInfo.uid = appresp.data.uid;

							loginToServer(appresp.data.token, appresp.data.sign, function (status, serverresp) {
								if (status === 0) {
									auth.userInfo.save(serverresp.data);
									//设置sid自动获取更新
									
									callback(1);
								} else {
									//此处是服务器拒绝登录
									callback(2);
								}
							});
						} else {
							//进行注册
							callback(3);
						}
					}
				} else {
					callback(4);
				}
			});
		}
		
		//对外提供接口
		 var auth = {
			//用户信息的存储与读取，通过localstorage
			userInfo: {
				save: function (data) {
					if (tools.getLocalStorage("baseInfo")) {
						UserInfo = angular.fromJson(tools.getLocalStorage("baseInfo"));
					}
					angular.extend(UserInfo, data);
					tools.toLocalStorage("baseInfo", angular.toJson(UserInfo));
				},
				get: function (key) {
					var userinfo = angular.fromJson(tools.getLocalStorage("baseInfo"));
					//判断有没有baseInfo数据
					if (!userinfo) {
						return "";
					}
					return userinfo[key];
				}
			},
			login: LoginApi,
			reg: RegApi,
			getInfoFromApp: getInfoFromApp,
			getSessionId:getSessionId
		};
		return auth;
	}]);