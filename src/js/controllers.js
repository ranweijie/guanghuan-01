//app controller,首页控制器
angular.module('ozApp.controllers', [])

	//开始页控制器
	.controller('startController', ['$rootScope', '$scope', 'Auth', '$location', '$interval', 'tools', 
        'MyWebSock', 'Constant', 'ConstantDrawcashAndDesc', '$timeout','httpService','Task', 
        function ($rootScope, $scope, Auth, $location, $interval, tools, MyWebSock, Constant, 
                  ConstantDrawcashAndDesc, $timeout,httpService,Task) {
		//钥匙状态描述
		$scope.websockinfo = "正在连接..."
		//版本
		$scope.version = "v"+Constant.Version;
		//邀请码弹出框
		$scope.InviteCodeBoxShow = false;
		//ios9关闭
		$scope.showIos9Seting = false;
		//是否是微信内或者qq内,是,如果安装就提示safari打开
		$scope.isWx = false;
		if (tools.isQQ() || tools.isWeixin()) {
			$scope.isWx = true;
		}
		
		//拦截无痕模式,是无痕就弹出提示
		$scope.isWuhen = tools.isWuHen();
		//自动登录。
		var interval = $interval(function () {
			//如果状态为已连接，登录。
			if (MyWebSock.webSockStatus()) {
				//检测版本号
				Task.getAppVersion(function(resp){
					$interval.cancel(interval);
					if (resp.data.code == 0){
						var version = resp.data.buildVersion;
						if (Constant.Version > version){
							$scope.$apply(function(){
								
								$scope.websockinfo = "偶赚有更新,请点击安装助手更新APP";
								//跳转安装连接
								window.location.href = Constant.plistAdd;
							});
							return;
						}else{
							$scope.$apply(function(){
								$scope.websockinfo = "正在登录..."
							});
							login();
						}
					}else{
						$scope.websockinfo = "连接助手失败，请重试"
					}
				});
				
			} else {
				$scope.websockinfo = "安装偶赚助手,每天收入几十元零花钱,可提现！"
			}
		}, 2000);
		//登录
		function login() {
			Auth.login(function (status) {
				switch (status) {
					case 1:
						$scope.websockinfo = "登录成功..."
						$location.url("/userindex");
						break;
					case 2:
						$scope.websockinfo = "登录失败,请刷新或者删除钥匙重新安装";
						break;
					case 3:
						$scope.$apply(function () {
							reg();
						});
						break;
					case 4:
						$scope.websockinfo = "登录服务器失败,请刷新重试";
						break;
				}
			});
		}
		//注册
		$scope.teachObj = {
			teachedId: ''
		};
		function reg() {
			$scope.websockinfo = "正在注册...";
			//检查cookie是否有渠道id
			var channelId = tools.getCookie("channelId");
			//有渠道ID的话，直接进行注册。
			if (channelId != null){
				GoIndex(channelId);	
				return;
			}
			$scope.InviteCodeBoxShow = true;
			//检查cookie是否有邀请码，有就默认来一个
			var promocode = tools.getCookie("promocode");
			
			if (promocode != null){
				
				$scope.teachObj.teachedId = parseInt(promocode);
			}
			
			
		}
		//检测邀请码是否正确
		$scope.getTeachedId = function () {
			var tid = $scope.teachObj.teachedId;
			
			if (tid == "" || tid == null) {
				$scope.teachIdTips = "邀请码错误"
				return
			}

			Auth.reg(tid,"", function (status) {
				if (status === 1) {
					$scope.websockinfo = "注册成功...";
					$scope.InviteCodeBoxShow = false;
					//删除cookie的,邀请码和昵称
						tools.clearCookie("promocode");
						tools.clearCookie("nickname");
					login();
				} else if (status === 2) {
					$scope.InviteCodeBoxShow = false;
					$scope.websockinfo = "注册失败...";
				} else if (status === 3) {
					//注册失败
					$scope.InviteCodeBoxShow = false;
					$scope.websockinfo = "向服务器注册失败,请反馈给我们";
				} else if (status === 103) {
					$scope.teachIdTips = "邀请码错误"
				}
			});
		}
		//去首页
		$scope.goIndex = function () {
			GoIndex("");	
		}
		//直接进入
		function GoIndex(channelId){
			Auth.reg("", channelId,function (status) {
					$scope.InviteCodeBoxShow = false;
					if (status === 1) {
						$scope.websockinfo = "注册成功...";
						//删除cookie的渠道id,邀请码和昵称
						tools.clearCookie("channelId");
						tools.clearCookie("promocode");
						tools.clearCookie("nickname");
						login();
					} else if (status === 2) {
						$scope.websockinfo = "注册失败...";
					} else if (status === 3) {
						//注册失败
						$scope.websockinfo = "向服务器注册失败,请反馈给我们";
					}
				});
		}
		//安装偶赚钥匙
		var installTime;
		$scope.isInstall = true;
		$scope.installOz = function () {
			//点击安装，检测是否在微信或者qq中,是就跳转
			if ($scope.isWx) {
				window.location.href = Constant.wxToSafari;
				return;
			}
			$scope.isInstall = true;
			$scope.installText = "请稍候";
			if (tools.iOSVersion() >= 9){
				$scope.showIos9Seting = true;
				var num = 10;
				//安装倒计时
				if (installTime){
					$interval.cancel(installTime);
				}
				installTime = $interval(function () {
					$scope.installText = "请稍候(" + num + ")";
					num--;
					if (num < 0) {
						$interval.cancel(installTime);
						$scope.installText = "去设置";
						$scope.isInstall = false;
					}
				}, 1000);
			}
		
			//跳转安装连接
			window.location.href = Constant.plistAdd;
		}
		//清除所有本地localStorage数据,cookie方式不清除--不清除了
		tools.removeStorage();
		//启动偶赚app
		$scope.openApp = function () {
			if ($scope.isWx) {
				window.location.href = Constant.wxToSafari;
				return;
			}
			window.location.href = Constant.ozScheme;
		}
		//ios9去设置按钮,信任企业号
		$scope.ios9ToSeting = function () {
			if ($scope.isInstall) {
				return;
			}
			location.href = "prefs:root=General&path=ManagedConfigurationList";
		}
		//启动页循环中奖信息...
		$scope.listArray = [];
		var nameArray = ConstantDrawcashAndDesc.startPageDisplayNameArray;
		var textArray = ConstantDrawcashAndDesc.startPageDisplayTextArray;
		for (var i = 0; i < 12; i++) {
			var num = tools.getRandNum(11);
			$scope.listArray.push({
				title: nameArray[num],
				time: "1分钟前",
				icon: "http://cdn.ozhuan.com/ozhuan/img/user-icon/user_" + (num + 1) + ".jpg",
				desc: textArray[num]
			});
		}
		//跳转其它视图时，在这里收拾残局。
		$scope.$on('$destroy', function () {
			if (interval) {
				$interval.cancel(interval);
			}
			if (installTime) {
				$interval.cancel(installTime);
			}
		});
	}])

	//用户首页控制器
	.controller('ozIndexController', ['$rootScope', '$scope', 'httpService', '$location', 'Constant', 'Auth', 'Task', '$interval', 'tools', '$timeout', 'MyWebSock', function ($rootScope, $scope, httpService, $location, Constant, Auth, Task, $interval, tools, $timeout, MyWebSock) {

		//获取设备信息
		// $scope.getInfo = function() {
		// 	Auth.getInfoFromApp("deviceInfo",function(bool,uuid){
		// 		if (bool){
		// 			
		// 		}else{
		// 			
		// 		}
		// 	});
		// };
		//$scope.getInfo();
		
		//一元夺宝
		$scope.goYyg = function(){
			window.location.href = Constant.GoToYyg;
		}
	
		// //下拉刷新
		// $scope.refreshText = "下拉刷新";
		// var refresh = false;
		// window.onscroll=function(){
			
		// 	if (document.body.scrollTop < -100){
		// 		$scope.$apply(function(){
		// 			$scope.refreshText = "放开刷新";
		// 			refresh = true;	
		// 		})	
		// 	}else if(refresh && (document.body.scrollTop <= 45)){
		// 		$scope.$apply(function(){
		// 			$scope.refreshText = "正在刷新";	
		// 		})	
				
		// 	}else if(!refresh){
		// 		$scope.$apply(function(){
		// 			$scope.refreshText = "下拉刷新";
		// 		})
		// 	}
		// }
		//获取推送服务所需要的devicetoken
		// Task.getPushDc(function(resp){
		// 	console.log(resp.data.dc);
		// });
		//点击今日收益和今日收益元体现
		$scope.drawCash = function () {
			$location.url('/mywallet');
		}
		//点击头像，跳转到用户资料中心
		$scope.userCenter = function () {
			$location.url('/usercenter');
		}
		//应用的icon
		$scope.AppIcon = Constant.appIcon;
		//存储用户信息的对象
		$scope.userObj = {
			"base": {
				"icon": "/img/deault_3.jpg",
				"userNickname": "未知用户"
			},
			"economics": {
				"allBalance": 0,
				"allIncome": 0,
				"todayIncome": 0
			}
		}
		//先从本地获取用户信息
		$scope.todayIncome = 0;
		if (Auth.userInfo.get("base").userNickname) {
			$scope.userObj.base.icon = Auth.userInfo.get("base").icon;
			$scope.userObj.base.userNickname = Auth.userInfo.get("base").userNickname || "不明用户";
			$scope.userObj.economics.allBalance = Auth.userInfo.get("economics").allBalance || 0;
			$scope.userObj.economics.allIncome = Auth.userInfo.get("economics").allIncome || 0;
		}
		if (tools.getLocalStorage('todayIncome')) {
			$scope.todayIncome = parseInt(tools.getLocalStorage('todayIncome'));
		}
		//是否展示加钱效果,钱增加了就展示
		$scope.addrmbShow = false;
		//立即提现按钮
		$scope.drawcash = function () {
			$location.url('/drawcash');
		}
		//是否显示正在加载列表提示...正在加载第三方方平台任务
		$scope.taskListLoaded = true;
		//是否显示正在加载列表提示....正在加载己方平台任务
		$scope.taskListLoadedown = true;
		$scope.tasklistLoadText = "正在加载任务列表...";
		//获取用户信息,加个时间搓防止get请求访问缓存
		$timeout(function () {
			httpService.commonGet(Constant.getUserInfo + "&timeStamp=" + Date.parse(new Date()) / 1000, function (resp) {
				if (resp.code == 0) {
					$scope.userObj = resp.data;
					//看看本地有没有金钱
					var oldrmb = tools.getLocalStorage('todayIncome');
					var newrmb = $scope.userObj.economics.todayIncome;
					//如果有老的金钱，先显示老的。
					if (oldrmb) {
						$scope.todayIncome = parseInt(oldrmb);
					} else {
						$scope.todayIncome = newrmb;
					}
					//延迟加钱
					if (newrmb > parseInt(oldrmb)) {
						$scope.addrmbShow = true;
						$scope.addrmb = newrmb - parseInt(oldrmb);
						$timeout(function () {
							$scope.todayIncome = newrmb;
							$scope.addrmbShow = false;
						}, 2000);
					}
					//保存一份到本地。
					Auth.userInfo.save(resp.data);
					tools.toLocalStorage('todayIncome', newrmb);
				} else {
					//没用户信息或者获取出错，去登陆界面
					tools.showTips(1000,"获取用户信息失败");
					$location.url("/start");
				}
			});
		}, 100);

		//任务完成状态
		$scope.playerTaskInfo = {};
		//未接受任务
		$scope.normalTaskInfo = [];
		//已接受即正在进行中的任务
		$scope.acceptTaskInfo = [];
		//已完成的任务
		$scope.completeTaskInfo = [];
		//第三方任务
		$scope.taskList3rd = [];
		//从localstorage获取斗金任务列表
		if (tools.getLocalStorage('doujinTask')) {
			$scope.taskListLoaded = false;
			$scope.taskList3rd = angular.fromJson(tools.getLocalStorage('doujinTask'));
			//并从钥匙再获取一次
			get3rdTaskListFromApp();
		} else {
			get3rdTaskListFromApp();
		}
		//本地没有第三方任务，从app获取任务列表
		function get3rdTaskListFromApp() {
			//准备接受rootscope websocket发送超时的广播事件
			tools.onMsg("sendMsgTimeout",function(msg){
					$scope.ShowZhuanLoad = false;
					//tools.showTips(2000,"加载第三方列表任务失败了");
					$scope.tasklistLoadText = "加载第三方列表任务失败,请重试";
			},$scope);
			Task.getTask3rdList(splitTaskList);
		}
		
		//钥匙发来第三方任务列表的回调
		function splitTaskList(resp) {
			$scope.taskListLoaded = false;
			if (resp.data.code == 0) {
				$scope.$apply(function () {
					$scope.taskList3rd = resp.data.data;
					//存到localstorage
					tools.toLocalStorage("doujinTask", angular.toJson(resp.data.data));
				});
			}else{
				tools.showTips(1000,"加载第三方列表任务失败");
				$scope.tasklistLoadText = "加载第三方列表任务失败...";
			
			}
		}
		//点击第三方任务
		$scope.click3rd = function (id, name, icon, steptext1, points, size, steptext2) {
			//存储到本地
			var jsonData = {
				"id": id,
				"name": name,
				"icon": icon,
				"steptext1": steptext1,
				"points": points,
				"size": size,
				"steptext2": steptext2
			};
			//存储第三方任务详情到localstorage
			tools.toLocalStorage("doujintaskdetail", angular.toJson(jsonData));
			$location.url('/tasklmdetail');
		}

		//获取任务列表数据,自己平台的
		httpService.commonGet(Constant.getTaskList + "&timeStamp=" + Date.parse(new Date()) / 1000, function (resp) {
			if (resp.code == 0) {
				//全部任务列表在这里taskListBuffs
				//每个任务的完成状态在这里playerTaskInfo
				//把任务的接受完成状态装到一个对象中,方便用
				if (resp.data.playerTaskInfo) {
					angular.forEach(resp.data.playerTaskInfo, function (obj) {
						$scope.playerTaskInfo[obj.TaskId] = obj.CurState;
					});
				}
				//遍历任务列表存数据
				angular.forEach(resp.data.taskListBuffs, function (obj) {
					//已接受的
					if ($scope.playerTaskInfo[obj.Id] === 1) {
						$scope.acceptTaskInfo.push(obj);
						//组合id，存储到本地。
						obj.status = 1;
						tools.toLocalStorage('platformTask' + obj.Id, angular.toJson(obj));
						return;
					}
					//已完成的
					if ($scope.playerTaskInfo[obj.Id] === 2) {
						$scope.completeTaskInfo.push(obj);
						return;
					}
					//剩下未接受的了
					$scope.normalTaskInfo.push(obj);
					//组合id，存储到本地。
					obj.status = 0;
					tools.toLocalStorage('platformTask' + obj.Id, angular.toJson(obj));
				});
				$scope.taskListLoadedown = false;
				$scope.tasklistLoadText = "正在加载第三方任务列表...";
			}
		});
		//新手任务
		$scope.ozXsrw = function () {
			$location.url('/tasklist');
		}
		//签到
		$scope.ozQd = function () {
			$location.url('/qiandao');
		}
		//抢红包
		$scope.ozQhb = function () {
			$location.url('/redenvelope');
		}
		//收徒任务
		$scope.ozStrw = function () {
			$location.url('/studentInfo/' + 1);
		}
		//点击一个未接受的任务
		$scope.clickNormal = function (Id) {
			//显示正在争抢任务loading效果。。。
			$scope.ShowZhuanLoad = true;
			
		
			//给钥匙发送接受任务消息
			//从本地取出该任务的详情
			var platformTaskDetail = tools.getLocalStorage('platformTask'+Id);
			if (!platformTaskDetail){
				$scope.ShowZhuanLoad = false;
				tools.showTips(1000,"抢任务失败，请重试");
				return;
			}
			var platformTaskDetailJson = angular.fromJson(platformTaskDetail);
			//组装发送给钥匙的开始任务数据
			var dataObj = {
				taskId:platformTaskDetailJson.Id,
				prj_name:platformTaskDetailJson.prj_name,
				bundle_id:platformTaskDetailJson.bundle_id,
				appid:platformTaskDetailJson.appid,
				CheckInstalledUrl:platformTaskDetailJson.CheckInstalledUrl,
				//CheckInstalledUrl:'http://192.168.199.31:9999/simulator/check_device',
				//超时时间
				timeout:parseInt(platformTaskDetailJson.DeadlineTimeLong) || 300,
				runTargetAppTime:Constant.runTargetAppTime
			};
			//准备接受rootscope websocket发送超时的广播事件
			tools.onMsg("sendMsgTimeout",function(msg){
					$scope.ShowZhuanLoad = false;
					tools.showTips(2000,"连接钥匙超时,请重启钥匙试试");
			},$scope);
			tools.onMsg("ozAppIsNoReady",function(msg){
					$scope.ShowZhuanLoad = false;
			},$scope);
			//由于sid有效期五分钟，这里接受任务时更新下sid
			Auth.getSessionId(function(sidresp){
				if (sidresp.code == 0){
				var obj = {
					sid:sidresp.data.sid
				}
				//存储到本地
				Auth.userInfo.save(obj)
				//向钥匙发送开始任务消息
				Task.startTask(dataObj,function(status,msg){
					$scope.$apply(function(){
						$scope.ShowZhuanLoad = false;
					});
					if (status === 0){
						tools.showTips(1000,"成功抢到任务");
						$location.url('/taskowndetail/' + Id);
					}else if(status === 1){
						toTop();
					}else if(status === 102){
						tools.showTips(2000,"您已安装过此应用");
					}else{
						tools.showTips(1000,"抢任务失败,ErrCode="+status);
					}
				});
				}else{
					tools.showTips(2000,"获取sid出错了~");
				}
			});
			
		}
		function toTop(){
			tools.showTips(2000,"您已有一个任务正在进行~");
			var timeinter = $interval(function(){
				if (document.body.scrollTop < 50){
					$interval.cancel(timeinter);
				}else{
					window.scrollBy(0,-30);
				}
			},2);	
		}
		//点击一个已接受的任务，直接进入了。
		$scope.clickAccept = function (Id) {
			$location.url('/taskowndetail/' + Id);
		}
		//不在此视图了就不监听滑动事件了,减少开销
		$scope.$on('$destroy', function () {
			window.onscroll = null;
		});
	}])

	//斗金平台任务详情控制器
	.controller('tasklmdetail', ['$rootScope', '$scope', '$stateParams', '$location', 'httpService', 'Constant', 'ConstantDrawcashAndDesc', 'Task', 'tools', '$interval', function ($rootScope, $scope, $stateParams, $location, httpService, Constant, ConstantDrawcashAndDesc, Task, tools, $interval) {

		$scope.ozBackIndex = function () {
			//$interval.cancel(t);
			//$location.url('/userindex');
			window.history.go(-1);
		};
		$scope.title = "联盟任务";
		//联盟任务说明
		$scope.showLm = false;
		// $scope.noRecieveLmPrizeExplain = Constant.noRecieveLmPrizeExplain;
		$scope.noRecieveLmPrizeExplain = ConstantDrawcashAndDesc.noRecieveLmPrizeExplain;
		$scope.abountLm = function () {
			$scope.showLm = true;
		}
		$scope.closeLm = function (id, $event) {
			$event.stopPropagation();
			if (id == 2) {
				return
			}
			$scope.showLm = false;
		}
		//任务详情数据对象
		$scope.detailObj = {};
		//去appstore
		$scope.toAppStore = function (url) {
			location.href = Constant.toAppstoreSearch;
		};

		window.onCopy = function () {
			location.href = Constant.toAppstoreSearch;
		}
		//传过来的任务描述
		var data = tools.getLocalStorage("doujintaskdetail");
		$scope.detailObj = angular.fromJson(data);
		//提交任务
		$scope.commitTaskText = "提交任务";
		//提交按钮class状态
		$scope.active = true;
		$scope.disabled = false;
		//循环check这个任务是否完成
		//开始任务
		$scope.beginTask = function (id) {
			$scope.ShowZhuanLoad = true;
			//请求钥匙接受第三方任务
			Task.start3rdTask(id, handleResp);
			//处理钥匙回复的消息
			function handleResp(resp) {
				$scope.ShowZhuanLoad = false;
				if (resp.data.code == 0) {
					$scope.$apply(function () {
						tools.showTips(1000, "接受任务成功");
					});

				} else {
					$scope.$apply(function () {
						tools.showTips(1000, "暂不能接受此任务")
					});
				}
			}
		}

		//放弃任务
		$scope.giveUpTask = function (id) {
			Task.giveUp3rdTask(id, giveUpBack);
		}
		function giveUpBack(resp) {

			if (resp.data.code == 0) {
				$scope.$apply(function () {
					tools.showTips(1000, "放弃任务成功");
				});
				$location.url('/userindex');
			} else {
				$scope.$apply(function () {
					tools.showTips(1000, "放弃任务失败，未找到此任务");
				});
			}
		}

	}])

	//己方平台任务详情控制器
	.controller('taskowndetail', ['$rootScope', '$scope', '$stateParams', '$location', 'httpService', 'Constant', 'ConstantDrawcashAndDesc', 'Task', 'tools', '$interval', function ($rootScope, $scope, $stateParams, $location, httpService, Constant, ConstantDrawcashAndDesc, Task, tools, $interval) {
		//获取列表id
		var taskId = $stateParams.taskId;
		if (!taskId) {
			tools.showTips(1000,"糟糕,获取任务Id出错了");
			return;
		}
		$scope.ozBackIndex = function () {
			if (statusCode == 5 || statusCode == 2){
				$scope.showGiveupBox = true;
				return;
			}
			window.history.go(-1);
		};
		//应用icon
		$scope.AppIcon =Constant.appIcon;
		$scope.title = "平台任务详情";
		//平台任务
		$scope.detailObj = {
		};
		var task_own_detail = tools.getLocalStorage('platformTask' + taskId);
		if (!task_own_detail) {
			tools.showTips(1000,"糟糕,获取任务详情出错了");
			return;
		}
		var task_own_detail_json = angular.fromJson(task_own_detail);

		//任务详情数据对象
		$scope.detailObj = task_own_detail_json;
		
		//去appstore
		$scope.toAppStore = function (title) {
			//挂号网#software
			location.href = Constant.toAppstoreKeyWork + title + "#software";
			console.log(Constant.toAppstoreKeyWork + title + "#software");
		};
		//放弃任务
		$scope.showGiveupBox = false; //取得定放弃任务对话框
		$scope.giveUpTask = function (Id) {
			$scope.showGiveupBox = true;	
		}
		$scope.giveUpTaskTrue = function(Id){
			Task.giveUpOwnTask(Id,function(resp){
				if (resp.data.code == 0){
					$scope.$apply(function(){
						$scope.showGiveupBox = false;
						tools.showTips(1000,"放弃任务成功");
					})
					
					window.history.go(-1);
				}else{
					$scope.$apply(function(){
						$scope.showGiveupBox = false;
						tools.showTips(1000,resp.data.msg || "放弃任务失败");
					});
				}
				});
		}
		$scope.giveUpTaskFalse = function(){
			$scope.showGiveupBox = false;
		}
		//任务状态
		$scope.taskState = "正在获取";
		//不断获取任务进度
		var statusCode = 0; //任务状态
		$scope.isComplete = false; //任务是否完成，完成就把放弃任务按钮去掉
		var taskOwnDetailInterval = $interval(function(){
			Task.getTaskState(taskId,function(resp){
				
				statusCode = resp.data.code;
				if (resp.data.code == 0){
					$scope.$apply(function(){
						$scope.isComplete = true;
						$scope.taskState = resp.data.msg;
					});
				}else{
					$scope.$apply(function(){
						$scope.taskState = resp.data.msg || "获取状态出错";
					});
				}
			});
		},3000);
		//试玩必读
		var timeout = parseInt($scope.detailObj.DeadlineTimeLong/60);
		if (isNaN(timeout) || timeout < 5){
			timeout = 5;
		}
		$scope.timeout = timeout;
		
		$scope.showSWBox = false;
		$scope.shiwanBox = function(){
			
			if ($scope.showSWBox){
				document.getElementById('shiwanicon').style.webkitTransform='rotate(-90deg)';
				$scope.showSWBox = false;
			}else{
				$scope.showSWBox = true;
				document.getElementById('shiwanicon').style.webkitTransform='rotate(90deg)';
			}
		}
		
		$scope.shiwanInfo = ["1,请在规定时间内按操作进行下载，下载完成后打开进行试玩;","2,超过规定时间未试玩,则此次任务无效;","3,试玩过程中请勿关闭钥匙APP,若关闭则此次任务无效;","如果您对我们有任何意见或建议,请至帮助中心的意见反馈提交反馈给我们,我们会及时查看并解决问题。"];
		//不在此视图了就不监听滑动事件了,减少开销
		$scope.$on('$destroy', function () {
			if (taskOwnDetailInterval){
				$interval.cancel(taskOwnDetailInterval);
			}
		});

	}])

	//任务列表控制器
	.controller('tasklist', ['$scope', '$stateParams', '$location', 'httpService', 'Constant', 'tools', '$timeout', function ($scope, $stateParams, $location, httpService, Constant, tools, $timeout) {

		//获取列表id
		var listId = $stateParams.listId;
		$scope.ozBackIndex = function () {
			window.history.go(-1);
		};
		$scope.title = "新手任务详情";
		$scope.listObj = {
			desc: false,
			listdata: [],
			descShow: false,
			listShow: false
		};
		//系统任务下的新手任务
		$scope.listObj.listShow = true;
		$scope.listObj.title = "新手任务列表";
		//已完成任务
		$scope.compeleteTask = [];
		//每日任务
		$scope.everyDayTask = [];
		//待完成任务
		$scope.normalTask = [];

		//获取任务列表数据
		//httpService.commonGet(Constant.newUserTaskList +  "&timeStamp=" + Date.parse(new Date()) / 1000, function(resp) {
		httpService.commonGet(Constant.newUserTaskList, function (resp) {
			if (resp.code == 0 && resp.data.noviceTaskList != "") {
				var data = resp.data;
				var completeArry = [];
				//已完成的任务
				var playerNoviceTaskInfo = resp.data.playerNoviceTaskInfo.complates;
				//有已完成的转成hashtable
				var overTaskTable = {};
				if (playerNoviceTaskInfo != "") {
					angular.forEach(playerNoviceTaskInfo, function (value1, key1) {
						overTaskTable[value1] = true;
					});
				}
				//所有任务
				var noviceTaskList = resp.data.noviceTaskList;
				angular.forEach(noviceTaskList, function (value2, key2) {
					//有数据就是已完成的任务
					if (overTaskTable[value2.ID]) {
						$scope.compeleteTask.push({
							"Title": value2.Title,
							"Reward": value2.Reward
						});
					}
					//无数据并且是每日任务
					if (!overTaskTable[value2.ID] && value2.IsEveryDay) {
						$scope.everyDayTask.push({
							"Title": value2.Title,
							"Reward": value2.Reward,
							"EventType": value2.EventType
						});
					}
					//无数据并且不是每日任务
					if (!overTaskTable[value2.ID] && !value2.IsEveryDay) {
						$scope.normalTask.push({
							"Title": value2.Title,
							"Reward": value2.Reward,
							"EventType": value2.EventType
						});
					}

				});

			}
			taskEmpty();
		});
		//置为空
		function taskEmpty() {
			if ($scope.compeleteTask.length == 0) {
				$scope.compeleteTask = [{
					"Title": "无",
					"Reward": 0
				}];
			}
			if ($scope.everyDayTask.length == 0) {
				$scope.everyDayTask = [{
					"Title": "无",
					"Reward": 0
				}];
			}

			if ($scope.normalTask.length == 0) {
				$scope.normalTask = [{
					"Title": "无",
					"Reward": 0
				}];
			}
		}
		//点击去做任务
		$scope.goJob = function (type) {
			switch (type) {
				//下载任务
				case 1:
					$location.url('/userindex');
					break;
				//分享以及邀请好友任务
				case 5: case 2: case 3: case 4:
					$location.url('/studentInfo/' + 2);
					break;
				//绑定手机和微信
				case 6:
					// $location.url('/usercenter');
					$scope.showWxBind = true;
					break;
				//绑定手机
				case 8:
					$location.url('/usercenter');
					break;
				//关注微信
				case 7:
					tools.showTips(3000, "使用微信搜索并关注偶赚公众号");
					$timeout(function () {
						location.href = Constant.safariToWx;
					}, 3500);

					break;
				default:
					break;
			}
		}

	}])

	//收徒任务
	.controller('student', ['$scope', '$stateParams', '$location', 'httpService', 'Constant', 'ConstantPlayerLvRedBag', 'ConstantDrawcashAndDesc', 'tools', 'Auth', '$timeout', 'Task', function ($scope, $stateParams, $location, httpService, Constant, ConstantPlayerLvRedBag, ConstantDrawcashAndDesc, tools, Auth, $timeout, Task) {

		$scope.ozBackIndex = function () {
			//$location.url('/userindex');
			window.history.go(-1);
		};
		$scope.title = "收徒任务";
		$scope.desc = ConstantDrawcashAndDesc.studentDescStr;
		// $scope.desc = Constant.studentDescStr;

		$scope.stObj = {
			StudentAmount: 0,
			StudentsReward: 0,
			TodayAmount: 0,
			TodayAllReward: 0,
			Level: "LV1"

		};
		//更多等级
		// var moreLevelDetail = Constant.moreLevelDetail
		var moreLevelDetail = ConstantPlayerLvRedBag.PlayerLvCfg
		var nickNameArray = []
		for (var i in moreLevelDetail) {
			// nickNameArray.push(moreLevelDetail[i]["level"])
			nickNameArray.push(moreLevelDetail[i]["Title"])
		};

		$scope.moreLevel = function () {
			$location.url('/morelevel');
		}
		$scope.nickName = "勤学苦练";
		$scope.nextNickName = "初出茅庐";
		//每个等级昵称
		// $scope.nickNameArray = ["勤学苦练", "初出茅庐", '小试牛刀', "崭露头角", '精益求精', "一方威名", '炉火纯青', "笑傲江湖", '纵横天下', "一代宗师", '独孤求败'];
		$scope.nickNameArray = nickNameArray;
		//获取学徒信息
		httpService.commonGet(Constant.getStuInfo + "&timeStamp=" + Date.parse(new Date()) / 1000, function (resp) {
			if (resp.code == 0) {
				$scope.stObj = resp.data;
				$scope.nickName = $scope.nickNameArray[$scope.stObj.Level];
				if ($scope.stObj.Level < 10) {
					$scope.nextNickName = $scope.nickNameArray[$scope.stObj.Level + 1];
				} else {
					$scope.nextNickName = "已达顶级";
				}
			} else {
				$scope.stObj = [];
			}
		});
		//邀请码
		$scope.promoCode = 0;
		var promoCode = Auth.userInfo.get('base').promoCode;

		if (promoCode) {
			$scope.promoCode = promoCode;
		} else {
			$scope.promoCode = "无法获取"
		}
		//开始收徒按钮
		$scope.stShow = false;
		//查看来源
		if ($stateParams.sid == 2) {
			$scope.stShow = true;
		}

		//分享按钮
		$scope.shareClose = function (id, $event) {
			$event.stopPropagation();
			if (id == 2) {
				return
			}
			$scope.stShow = false;
		}

		$scope.shareToWx = function (typeid) {
			if (Auth.userInfo.get('exinfo').WeiXinOpenId == "") {
				tools.showTips(2000, "请绑定微信后再收徒噢");
				$timeout(function () {
					$scope.showWxBind = true;
				}, 2000);
				return
			}
			postShareToServer(typeid);
			var nickname = Auth.userInfo.get('base').userNickname;
			var icon = Auth.userInfo.get('base').icon;
			var shareurl = Constant.shareurl + "?promocode=" + promoCode + "&nickname=" + nickname + "&imgurl=" + icon;
			shareurl = encodeURIComponent(shareurl);
			var title = "偶赚-好友邀请";
			var desc = "好友给您发红包啦,每月轻轻松松赚几百零花钱,你也快来试试吧!";
			var shareScheme = "&text=" + shareurl + "&title=" + title + "&desc=" + desc;
			//看是否在safari中,在safari就通过scheme跳转,不在就发送websocket命令
			if (!navigator.userAgent.match(/Safari/i)) {
				Task.shareToWx(typeid, shareurl, title, desc);
			} else {
				if (typeid == 1) {
					window.location.href = Constant.wxshare + "action=shareUrlToHY" + shareScheme;
				} else if (typeid == 2) {
					window.location.href = Constant.wxshare + "action=shareUrlToPYQ" + shareScheme;
				}

			}

		}
		//TODO没有完成分享成功与否的验证.
		//分享后提交给服务器
		function postShareToServer(typeid) {
			var type = "";
			if (typeid == 1) {
				type = "share2WeiXinFriend";
			} else if (typeid == 2) {
				type = "share2WeiXinCircleOfFriend";
			}
			var postData = {
				eventType: type
			};

			httpService.commonPost(Constant.shareCommit, postData, function (resp) {
			});
		}
		$scope.ozStSubmit = function () {
			$scope.stShow = true;
		};

	}])

	//个人中心显示
	.controller('usercenter', ['$interval', '$scope', '$stateParams', '$location', 'httpService', 'Constant', 'tools', 'Auth', function ($interval, $scope, $stateParams, $location, httpService, Constant, tools, Auth) {
		$scope.ozBackIndex = function () {
			//$location.url('/userindex');
			window.history.go(-1);
		};
		$scope.title = "个人中心";
		//帮助
		$scope.help = function () {
			$location.url('/help');
		}
		//信息对象
		$scope.userinfo = {
			NickName: "",
			Gender: "男",
			Job: "上班族",
			Birthday: "2016-01-01",
			Phone: "未绑定",
			icon: "",
			WeChat: "未绑定"
		};
		//phone和weixin绑定Btn
		$scope.showBindWxBtn = true;
		$scope.showBindPhoneBtn = true;

		//phone和weixin绑定Page
		$scope.showBindWxPage = false;
		$scope.showBindPhonePage = false;
		//查看收益详细
		$scope.seeDetail = function () {
			$location.url('/mywallet');
		}
		//从本地获取用户个人资料
		$scope.allBalance = Auth.userInfo.get('economics').allBalance;
		$scope.userinfo.NickName = Auth.userInfo.get('base').userNickname;

		// $scope.userinfo.Gender = Auth.userInfo.get('exinfo').Gender;
		// $scope.userinfo.Job = Auth.userInfo.get('exinfo').Job;
		// $scope.userinfo.Birthday = Auth.userInfo.get('exinfo').Birthday;
		//$scope.userinfo.Phone = Auth.userInfo.get('exinfo').Phone;
		$scope.userinfo.icon = Auth.userInfo.get('base').icon;
		if (Auth.userInfo.get('exinfo').WeiXinOpenId != "") {
			$scope.userinfo.WeChat = "已绑定";
			$scope.showBindWxBtn = false;
		}
		if (Auth.userInfo.get('exinfo').Phone != "") {
			$scope.userinfo.Phone = Auth.userInfo.get('exinfo').Phone;
			$scope.showBindPhoneBtn = false;
		}
		// if ($scope.userinfo.Birthday == "") {
		// 	$scope.userinfo.Birthday = '2016-01-01';
		// }

		$scope.changeinfo = function () {
			$location.url('/userinfochange');
		}

		//绑定微信账号
		$scope.bindWx = function () {
			if (Auth.userInfo.get('exinfo').WeiXinOpenId != "") {
				return
			}
			if (!$scope.showWxBind) {
				$scope.showWxBind = true;
			}
		}

		//绑定手机号
		$scope.sendText = "发送验证码";
		$scope.phoneObj = {};
		//发送验证码
		var sendInter;
		$scope.sendCode = function () {
			if (!(($scope.phoneObj.phoneNum + "").length == 11)) {
				tools.showTips(1000, "手机号需11位");
				return
			}
			if (!angular.isNumber($scope.phoneObj.phoneNum)) {
				tools.showTips(1000, "手机号必须为数字");
				return
			}

			$scope.disableSend = true;
			var second = 60;
			$scope.sendText = second + "秒";
			sendInter = $interval(function () {
				second--;
				$scope.sendText = second + "秒";
				if (second <= 0) {
					$interval.cancel(sendInter);
					$scope.disableSend = false;
					$scope.sendText = "发送验证码";
				}
			}, 1000);
			//发送验证码
			var postData = {
				pn: $scope.phoneObj.phoneNum
			};
			httpService.commonPost(Constant.sendCode, postData, function (resp) {

				if (resp.code == 0) {
					tools.showTips(1000, "验证码发送成功");
				} else {
					$interval.cancel(sendInter);
					$scope.disableSend = false;
					$scope.sendText = "发送验证码";
					tools.showTips(1000, "验证码发送失败");
				}
			});
		}
		$scope.bindPhone = function () {
			if (Auth.userInfo.get('exinfo').Phone != "") {
				return
			}
			$scope.showPhoneBind = true;

		}
		//提交绑定手机
		$scope.commitPhone = function () {
			if (!(($scope.phoneObj.codeNum + "").length == 5)) {
				tools.showTips(1000, "验证码需5位");
				return
			}
			if (!(($scope.phoneObj.phoneNum + "").length == 11)) {
				tools.showTips(1000, "手机号需11位");
				return
			}
			if (!angular.isNumber($scope.phoneObj.phoneNum)) {
				tools.showTips(1000, "手机号必须为数字");
				return
			}
			if (!angular.isNumber($scope.phoneObj.codeNum)) {
				tools.showTips(1000, "验证码是数字");
				return
			}
			//提交验证
			var postData = {
				cn: $scope.phoneObj.codeNum
			};
			httpService.commonPost(Constant.commitCode, postData, function (resp) {
				if (resp.code == 0) {
					tools.showTips(2000, "绑定手机成功")
					$location.url("/userindex");
				} else if (resp.code == 104) {
					tools.showTips(2000, "验证码过期")
				} else if (resp.code == 105) {
					tools.showTips(2000, "验证码错误")
				}
			});

		}

		$scope.$on('$destroy', function () {
			if (sendInter) {
				$interval.cancel(sendInter);
			}

		});

	}])

	//个人资料的修改
	.controller('userinfochange', ['$scope', '$location', 'httpService', 'Constant', 'tools', '$timeout', 'Auth', function ($scope, $location, httpService, Constant, tools, $timeout, Auth) {

		$scope.ozBackIndex = function () {
			//$location.url('/usercenter');
			window.history.go(-1);
		};
		$scope.title = "修改资料";
		$scope.Birthday = new Date('2016-01-01');
		$scope.userinfo = {
			NickName: "",
			Gender: "男",
			Job: "上班族"
		};
		//从本地取出资料
		$scope.userinfo.NickName = Auth.userInfo.get('base').userNickname;
		//ios safari上的坑，必须是2016/01/02才能转化成date对象。
		var t = Auth.userInfo.get('exinfo').Birthday.replace(/-/g, "/");
		$scope.Birthday = new Date(t);
		$scope.userinfo.Gender = Auth.userInfo.get('exinfo').Gender;
		$scope.userinfo.Job = Auth.userInfo.get('exinfo').Job;

		//点击修改
		$scope.commit = function () {

			//验正值为空
			if (!angular.isDefined($scope.userinfo.NickName)) {
				tools.showTips(1000, "请填写昵称.");
				return;
			}
			//获取年月日
			var postData = $scope.userinfo;
			//处理下日期
			var year = $scope.Birthday.getFullYear();
			var month = $scope.Birthday.getMonth() + 1;
			var day = $scope.Birthday.getDate()
			var s = year + "-" + month + "-" + day;
			postData.Birthday = s;
			httpService.commonPost(Constant.commitExInfo, postData, function (resp) {
				if (resp.code == 0) {
					//再次从服务器获取信息
					httpService.commonGet(Constant.getUserInfo + "&timeStamp=" + Date.parse(new Date()) / 1000, function (resp) {
						if (resp.code == 0) {
							Auth.userInfo.save(resp.data);
						}
					});
					tools.showTips(1000, "修改成功,正跳转到个人中心..");
					$timeout(function () {
						$location.url('/usercenter');
					}, 1500);

				} else {
					tools.showTips(1000, "修改资料失败，请稍后修改");
				}
			});
		}
	}])

	//提取现金
	.controller('mywallet', ['$scope', '$location', 'httpService', 'Constant', 'tools', '$timeout', 'Auth', function ($scope, $location, httpService, Constant, tools, $timeout, Auth) {

		//返回
		$scope.ozBackIndex = function () {
			//$location.url('/userindex');
			window.history.go(-1);
		}

		//获取提现金额
		var canDrawCash = Auth.userInfo.get('economics').allBalance || 0;
		var allIncome = Auth.userInfo.get('economics').allIncome || 0;
		var DrawCashed = allIncome - canDrawCash;
		if (DrawCashed < 0) {
			DrawCashed = 0;
		}
		$scope.title = "我的钱包";
		$scope.mywallet = {
			canDrawCash: canDrawCash,
			DrawCashed: DrawCashed,
			allIncome: allIncome
		};
		//提现记录
		$scope.cashhistory = function () {
			$location.url('/cashrecord');
		}
		//申请提现
		$scope.drawcash = function () {
			$location.url('/drawcash');
		}
		//任务收入
		$scope.taskincome = function () {
			$location.url('/taskincome/' + 1);
		}
		//好友提成
		$scope.friendincome = function () {
			$location.url('/taskincome/' + 2);
		}
		//其它收入
		$scope.otherincome = function () {
			$location.url('/taskincome/' + 3);
		}
	}])

	//任务收入列表
	.controller('taskincome', ['$scope', '$location', 'httpService', 'Constant', 'tools', '$timeout', '$stateParams', function ($scope, $location, httpService, Constant, tools, $timeout, $stateParams) {
		$scope.ozBackIndex = function () {
			//$location.url('/mywallet');
			window.history.go(-1);
		}
		$scope.title = "详细列表";
		//无数据显示
		$scope.descShow = true;
		$scope.descText = "暂无数据";
		$scope.desctext = "任务,赚了";
		var typeId = parseInt($stateParams.typeId);
		//task表示任务收入，默认值.friend好友收入，others其它收入
		var rewardType = "task";
		switch (typeId) {
			case 1:
				rewardType = "task";
				break;
			case 2:
				rewardType = "friend";
				$scope.title = "好友提成";
				break;
			case 3:
				rewardType = "others";
				$scope.title = "其它收入";
				$scope.desctext = ",赚了";
				break;
			default:
				rewardType = "task";
				break;
		}

		//获取明细
		httpService.commonGet(Constant.rewardHistory + "?rewardType=" + rewardType + "&timeStamp=" + Date.parse(new Date()) / 1000, function (resp) {
			if (resp.code == 0 && resp.data != "") {
				$scope.listInfo = resp.data;
				$scope.descShow = false;
			} else {
				tools.showTips(1000, "暂无数据,赶紧做任务赚钱吧~");
			}
		});

	}])

	//帮助中心
	.controller('help', ['$scope', '$location', 'httpService', 'Constant', 'tools', '$timeout', function ($scope, $location, httpService, Constant, tools, $timeout) {
		//返回
		$scope.ozBackIndex = function () {
			//$location.url('/usercenter');
			window.history.go(-1);
		}
		//标题
		$scope.title = "帮助中心";
		$scope.helpobj = {
			content: "这里是帮助中心,为您提供全面帮助服务"
		};

		//常见问题
		$scope.commonIssue = function () {
			$location.url('/commonissue');
		}
		//新手教程
		$scope.userCourse = function () {
			$location.url('/usercourse');
		}
		//关于我们
		$scope.abountMe = function () {
			$location.url('/abountoz');
		}
		//意见反馈
		$scope.feedback = function () {
			$location.url('/feedback');
		}
	}])

	//微信提现
	.controller('drawcash', ['$scope', '$location', 'Auth', 'tools', 'Constant', 'ConstantDrawcashAndDesc', 'httpService', function ($scope, $location, Auth, tools, Constant, ConstantDrawcashAndDesc, httpService) {
		//返回
		$scope.ozBackIndex = function () {
			window.history.go(-1);
		}
		//对象
		var allBalance = Auth.userInfo.get('economics').allBalance;
		if (angular.isUndefined(allBalance) || allBalance == "") {
			allBalance = 0;
		}
		//从本地取出资料
		var wxid = "";
		var nickname = "";
		var bindDisable = true;

		wxid = Auth.userInfo.get('exinfo').WeiXinOpenId;
		nickname = Auth.userInfo.get('base').userNickname;

		if (wxid == "") {
			wxid = "未绑定,点我绑定";
			bindDisable = false;
		} else {
			wxid = nickname;
			bindDisable = true;
		}
		$scope.title = "微信提现";
		$scope.drawcash = {
			yue: allBalance,
			wxid: wxid
		};
		$scope.bindWx = function () {
			if (!bindDisable) {
				$scope.showWxBind = true;
			}
		}
		//输入的真实姓名
		$scope.drawcashName = "";
		//可提现的金额
		var drawcashNumArray = []
		var serverDrawcashData = ConstantDrawcashAndDesc.WithrawCashGear;
		for (var index in serverDrawcashData) {
			drawcashNumArray.push(serverDrawcashData[index] / 100)
		}
		$scope.drawcashNumArray = drawcashNumArray;


		//选中金额
		$scope.drashSelected = 0;

		//选中按钮
		$scope.drawcashNum = function (num) {
			$scope.drashSelected = num;
		}
		//提交
		$scope.commit = function () {

			if ($scope.drawcashName == "") {
				tools.showTips(1000, "请输入真实姓名");
				return
			} 
			else if (!bindDisable) {
				tools.showTips(1000, "请绑定微信帐号后再提现");
				return
			} 
			//检查余额是否充足
			else if ($scope.drawcashNumArray[$scope.drashSelected] > ($scope.drawcash.yue/100)) {
				tools.showTips(1000, "余额不足以提现,请努力赚钱吧");
				return
			}
			
			//TODO提现申请
			var str = "是否提取" + $scope.drawcashNumArray[$scope.drashSelected] + "元到微信帐号?"
			var ok = confirm(str);
			if (ok) {
				postToServer($scope.drashSelected + 1, $scope.drawcashName, function (isok) {
					if (isok) {
						//成功就再次从服务器刷新本地信息
						//再次从服务器获取信息
						httpService.commonGet(Constant.getUserInfo + "&timeStamp=" + Date.parse(new Date()) / 1000, function (resp) {
							if (resp.code == 0) {
								Auth.userInfo.save(resp.data);
							}
						});
						alert("提现申请成功,3个工作日内审核无问题后发到您的微信账户上");
					} else {
						tools.showTips(1000, "提现申请失败，请稍候再试");
					}
				});

			}
		}

		//绑定微信页面
		$scope.showWxBind = false;
		//点击去微信
		function postToServer(gear, name, callback) {
			//向服务器通知提现
			var postData = {
				amountGear: gear,
				channel: "WeiXin",
				realName: name
			};

			httpService.commonPost(Constant.drawCash, postData, function (resp) {
				if (resp.code == 0) {
					callback(true);
				} else {
					callback(false);
				}
			});

		}
	}])

	//签到中心
	.controller('qiandao', ['$scope', '$location', 'httpService', 'Constant', 'tools', 'Auth', function ($scope, $location, httpService, Constant, tools, Auth) {
		//返回
		$scope.ozBackIndex = function () {
			//$location.url('/userindex');
			window.history.go(-1);
		}
		//标题.
		$scope.title = "签到任务";
		$scope.btnContent = "签到";

		$scope.jsonData = [];

		//这个月1号前空几天
		var date = new Date();
		var thisYear = date.getFullYear();
		var thisMonth = date.getMonth() + 1;
		var thisDays = DayNumOfMonth(thisYear, thisMonth);
		// var thisYear = 2016;
		// var thisMonth = 6;
		// var thisDays = 22;
		//签到日历
		$scope.yearMonth = thisYear + "年" + thisMonth + "月";
		var emptyDateNum = whatWeekOfMonth(thisYear, thisMonth);
		for (var i = 0; i < emptyDateNum; i++) {
			$scope.jsonData.push({ val: "", isSign: false });
		}
		//上个月按钮显示
		$scope.lastMonth = true;
		//上个月按钮
		$scope.lastMonthFun = function () {

			$scope.lastMonth = false;
			var lastYear, lastMonth;
			if (thisMonth == 1) {
				lastMonth = 12;
				lastYear = thisYear - 1;
			} else {
				lastMonth = thisMonth - 1;
				lastYear = thisYear;
			}
			$scope.yearMonth = lastYear + "年" + lastMonth + "月";
			var emptyDateNum = whatWeekOfMonth(lastYear, lastMonth);
			$scope.jsonData = [];
			for (var i = 0; i < emptyDateNum; i++) {
				$scope.jsonData.push({ val: "", isSign: false });
			}
			var lastDays = DayNumOfMonth(lastYear, lastMonth);

			if (tools.getLocalStorage('qd')) {
				var qdData = angular.fromJson(tools.getLocalStorage('qd'));
				var lastMonthData = qdData.LastMonSignedRecord;
				angular.forEach(lastMonthData, function (val, key) {
					if ((key + 1) <= lastDays) {
						$scope.jsonData.push({ val: key + 1, isSign: val });
					}
				});
			}
		}
		$scope.nextMonth = function () {

			$scope.yearMonth = thisYear + "年" + thisMonth + "月";
			$scope.lastMonth = true;
			$scope.jsonData = [];
			for (var i = 0; i < emptyDateNum; i++) {
				$scope.jsonData.push({ val: "", isSign: false });
			}
			getThisMonth();
		}
		//先从本地取签到数据
		if (tools.getLocalStorage('qd')) {
			getThisMonth();
			getQdDataFromServer(1);
		} else {
			getQdDataFromServer(2);
		}
		//这个月的签到情况获取
		function getThisMonth() {

			var qdData = angular.fromJson(tools.getLocalStorage('qd'));
			var thisMonthData = qdData.CurMonSignedRecord;
			// var lastDays = DayNumOfMonth(lastYear,lastMonth);
			angular.forEach(thisMonthData, function (val, key) {
				//thisDays
				if ((key + 1) <= thisDays) {
					$scope.jsonData.push({ val: key + 1, isSign: val });
				}

			});
		}
		function getQdDataFromServer(type) {
			//获取月份签到数据
			httpService.commonGet(Constant.qiandaoData + "&timeStamp=" + Date.parse(new Date()) / 1000, function (resp) {
				if (resp.code == 0) {
					tools.toLocalStorage('qd', angular.toJson(resp.data));
					if (type == 2) {
						$scope.jsonData = [];
						for (var i = 0; i < emptyDateNum; i++) {
							$scope.jsonData.push({ val: "", isSign: false });
						}
						angular.forEach(resp.data.CurMonSignedRecord, function (val, key) {
							if ((key + 1) <= thisDays) {
								$scope.jsonData.push({ val: key + 1, isSign: val });
							}
						});

					}

				}
			});
		}
		//返回当前月的天数
		function DayNumOfMonth(Year, Month) {
			var d = new Date(Year, Month, 0);

			return d.getDate();
		}
		//获取这个月的第一天是星期几,0是星期日
		function whatWeekOfMonth(Year, Month) {
			var d = new Date(Year, Month, 0);
			d.setDate(1);
			return d.getDay();
		}
		$scope.isQianDao = true;
		//本地获取签到数据
		var SignedOffCount = Auth.userInfo.get('EveryDayInfos').SignedOffCount;
		if (SignedOffCount == 0) {
			$scope.isQianDao = false;
		} else {
			$scope.btnContent = "今日已签到";
			$scope.isQianDao = true;
		}
		$scope.qiandao = function () {
			httpService.commonPost(Constant.qianDao, '{}', function (resp) {
				if (resp.code == 0) {
					if (resp.data.signInResult) {
						getQdDataFromServer(2);
						tools.showTips(2000, "签到成功,获得1次抽奖次数");
						$scope.btnContent = "今日已签到";
						$scope.isQianDao = true;
					} else {
						tools.showTips(1000, "签到失败，请稍后再试");
					}

				} else {
					tools.showTips(1000, "签到失败，请稍后再试");
				}
			});

		}
		//一元夺宝
		$scope.goYyg = function(){
			window.location.href = Constant.GoToYyg;
		}
	}])

	//抢红包
	.controller('redenvelope', ['$scope', '$location', 'httpService', 'Constant', 'ConstantPlayerLvRedBag', 'tools', 'Auth', '$timeout', '$interval', function ($scope, $location, httpService, Constant, ConstantPlayerLvRedBag, tools, Auth, $timeout, $interval) {
		$scope.ozBackIndex = function () {
			window.history.go(-1);
		}
		//标题
		$scope.title = "抢红包";
		//次数
		$scope.envelopeNum = 0;
		// $scope.envelopeNum = 20;
		var CanGrabCashCount = Auth.userInfo.get('EveryDayInfos').CanGrabCashCount;
		if (CanGrabCashCount != "" && !angular.isUndefined(CanGrabCashCount) && CanGrabCashCount >= 0) {
			$scope.envelopeNum = CanGrabCashCount;
		}
		//定义相应变量
		// var servPrizeArr = ["2分", "5分", "1角", "1元", "2元", "5元", "10元", "100元"];
		// 红包档位
		// var servPrizeArr = Constant.servRedBagArr;
		var servPrizeArr = [];
		var moneyNumArr = []
		var moneyUnitArr = []

		var serverRedBagData = ConstantPlayerLvRedBag.GrabCashGear;
		var tmpMoneyNum, tmpMoneyUnit

		for (var i in serverRedBagData) {
			var redBagAmount = serverRedBagData[i]["CashAmount"];
			if (redBagAmount >= 100) {
				tmpMoneyNum = redBagAmount / 100;
				tmpMoneyUnit = "元";
			} else if (redBagAmount < 100 && redBagAmount >= 10) {
				tmpMoneyNum = redBagAmount / 10;
				tmpMoneyUnit = "角";
			} else {
				tmpMoneyNum = redBagAmount;
				tmpMoneyUnit = "分";
			};
			moneyNumArr.push(tmpMoneyNum);
			moneyUnitArr.push(tmpMoneyUnit);
			servPrizeArr.push(tmpMoneyNum + tmpMoneyUnit)
		}

		//是否开始
		var isBegin = false;
		//金额
		$scope.moneyNum = moneyNumArr;
		//金额对应单位
		$scope.moneyUnit = moneyUnitArr;

		$scope.selected = 0;

		$scope.beginDraw = function () {
			if (!isBegin) {
				isBegin = true;
				if ($scope.envelopeNum > 0) {
					getServerRedBag(redBack);
					//redBack(6);
				} else {
					isBegin = false;
					tools.showTips(2000, "剩余次数不足,签到和做任务都可获得抽红包机会");
				};
			};
		}
		function redBack(num) {
			GO(50, num);
		}
		//红包开跑
		var inter1;
		function GO(second, realNum) {
			//真实档位
			var realnum = realNum;
			//跑的档位
			var num = 0;
			inter1 = $interval(function () {
				num++;
				//跑一圈了重新开始
				if (num > 7) {
					num = 0;
					second = second * 1.8;
					$interval.cancel(inter1);
					GO(second, realnum)
				}
				$scope.selected = num;
				if (second >= 500 && num == realnum) {
					$interval.cancel(inter1);
					isBegin = false;
					$timeout(function () {
						if (servPrizeArr[realnum]) {
							$interval.cancel(inter1);
							$scope.showJoy = true;
							$scope.gearsNum = moneyNumArr[realnum];
							$scope.gearsUnit = moneyUnitArr[realnum];
						}
					}, 200);
				}

			}, second);
		}
		//关闭弹出框
		$scope.closeJoy = function () {
			$scope.showJoy = false;
		}
		//抢红包接口
		function getServerRedBag(callback) {
			httpService.commonGet(Constant.redEnvelope + "?timeStamp=" + Date.parse(new Date()) / 1000, function (resp) {
				if (resp.code == 0) {
					$scope.envelopeNum = resp.data.CanGrabCashCount || 0;
					//$scope.envelopeNum = 20;
					//再次从服务器获取信息
					httpService.commonGet(Constant.getUserInfo + "&timeStamp=" + Date.parse(new Date()) / 1000, function (resp) {
						if (resp.code == 0) {
							Auth.userInfo.save(resp.data);
						}
					});
					callback(resp.data.amountGear);
					//callback(0);
				} else {
					tools.showTips(1000, "抽奖失败,请稍后再试");
				}
			});
			// callback(6)
		}
		//滚动公告
		var scrollObj = document.getElementById("roll-board");
		var oneScrollEnd = false;
		var totalHight = scrollObj.offsetHeight;
		function scollBoard() {
			if (!oneScrollEnd) {
				scrollObj.scrollTop += 1;
				var currScollHeight = scrollObj.scrollTop;
				if (currScollHeight == totalHight) {
					oneScrollEnd = true;
				}
			} else {
				scrollObj.scrollTop = 0;
				oneScrollEnd = false;
			}
		}
		var scrollInter = $interval(function () {
			scollBoard();
		}, 50)
		//销毁
		$scope.$on('$destroy', function () {
			$interval.cancel(scrollInter);
		});
	}])

	//常见问题
	.controller('commonissue', ['$scope', '$location', 'ConstantDrawcashAndDesc', function ($scope, $location, ConstantDrawcashAndDesc) {
		//返回
		$scope.ozBackIndex = function () {
			//$location.url('/help');
			window.history.go(-1);
		}
		//标题
		$scope.title = "常见问题";

		//文字
		$scope.textArray = ConstantDrawcashAndDesc.commonIssueDescArray;

	}])

	//新手教程
	.controller('usercourse', ['$scope', '$location', function ($scope, $location) {
		//返回
		$scope.ozBackIndex = function () {
			//$location.url('/help');
			window.history.go(-1);
		}
		//标题
		$scope.title = "新手教程";
		//文字
		$scope.textArray = "";

	}])

	//意见反馈
	.controller('feedback', ['$scope', '$location', 'tools', '$timeout', 'httpService', 'Constant', function ($scope, $location, tools, $timeout, httpService, Constant) {
		//返回
		$scope.ozBackIndex = function () {
			//$location.url('/help');
			window.history.go(-1);
		}
		//标题
		$scope.title = "意见反馈";

		//提交
		//$scope.feedbackText = "";
		$scope.commit = function () {
			if (angular.isUndefined($scope.feedbackText)) {
				tools.showTips(1000, "亲，您还未输入任何内容");
			} else {
				if ($scope.feedbackText.length < 10) {
					tools.showTips(1000, "连十个字凑不齐么");
					return;
				}
				var postdata = {
					content: $scope.feedbackText
				};
				httpService.commonPost(Constant.feedback, postdata, function (resp) {
					if (resp.code == 0) {
						tools.showTips(1000, "提交成功，感谢您的建议。");
						$timeout(function () {
							$location.url('/help');
						}, 2000);
					} else {
						tools.showTips(1000, resp.msg || "出问题啦，请下次在尝试,谢谢");

					}
				});


			}
		}

	}])

	//关于我们
	.controller('abountoz', ['$scope', '$location','Constant', function ($scope, $location,Constant) {
		//返回
		$scope.ozBackIndex = function () {
			//$location.url('/help');
			window.history.go(-1);
		}
		//标题
		$scope.title = "关于我们";
		//版本
		$scope.version = Constant.Version;

	}])

	//提现记录
	.controller('cashrecord', ['$scope', '$location', 'httpService', 'Constant', function ($scope, $location, httpService, Constant) {
		//返回
		$scope.ozBackIndex = function () {
			//$location.url('/mywallet');
			window.history.go(-1);
		}
		//标题
		$scope.title = "提现记录";

		$scope.descShow = true;

		$scope.descText = "暂无数据";
		// 记录
		$scope.recordArray = [];
		httpService.commonGet(Constant.cashRecord + "?timeStamp=" + Date.parse(new Date()) / 1000, function (resp) {
			if (resp.code == 0 && resp.data != "") {
				$scope.descShow = false;
				$scope.recordArray = resp.data;
				//修改状态
				angular.forEach($scope.recordArray, function (val, key) {
					if (val.State == 0) {
						val.status = "正审核";
					} else if (val.State == 1) {
						val.status = "提现成功";
					} else {
						val.status = "申请失败";
					}
				});
			} else {
				$scope.descShow = true;
			}
		});

	}])
        
	//更多等级
	.controller('morelevel', ['$scope', '$location', 'ConstantPlayerLvRedBag', function ($scope, $location, ConstantPlayerLvRedBag) {
		//返回
		$scope.ozBackIndex = function () {
			window.history.go(-1);
		}
		//标题
		$scope.title = "等级描述";
		$scope.moreLevelDetail = ConstantPlayerLvRedBag.PlayerLvCfg;
		
	}]);