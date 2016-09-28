//app services

//常量配置
angular.module('ozApp.Config', [])
.factory('Constant', ['$location',function($location) {
	//版本 
	var Version = "1.0.8.5";
	//获取用户信息接口
	//var getUserInfo = "/js/userObj.json";
	var getUserInfo = "/player/get_data?action=userObj";
	//应用的icon
	var appIcon = "http://cdn.ozhuan.com/ozhuan/";
	//钥匙地址
	var plistAdd = "itms-services://?action=download-manifest&url=https://ozhuan.oss-cn-shanghai.aliyuncs.com/EarnKeyEnterprise2016_06_03_17_17.plist";
	//获取任务列表 
	//var  getTaskList = "taskListArray.json";
	var getTaskList = "/player/get_data?action=taskListArray";
	//获取任务详情
	var getTaskDetail = "/player/get_data?action=taskInfo";
	//获取学徒信息
	var getStuInfo = "/player/get_data?action=studentInfo";
	//拜师任务
	var baishi = "/player/apprentice"
	//个人中心获取扩展信息
	var userExInfo = "/player/get_data?action=exInfo";
	//用户修改个人中心提交信息
	var commitExInfo = "/player/commit_ex_info";
	//获取sessionid
	var getSessionid = "/player/make_session_id";
	//注册用户/player/reg    
	var regUser = "/player/reg";
	//用户登录/player/login 	
	var userLogin = "/player/login";
	//任务收入获取列表
	var rewardHistory = "player/getRewardHistory";
	//接一个任务
	var acceptTask = "/player/accept_task";
		//提交一个任务，成功与失败
	var commitTask = "/player/commit_task";
	//跳到appstore搜索界面
	var toAppstoreSearch = "https://itunes.apple.com/WebObjects/MZStore.woa/wa/search?media=software&country=CN&mt=8&term=";
	var toAppstoreKeyWork = "https://itunes.apple.com/WebObjects/MZStore.woa/wa/search?mt=8&submit=edit&term=";
	//websocketurl
	//var webSockUrl = "ws://192.168.199.212:9235/service";
	var webSockUrl = "ws://localhost:9235/service";
	//钥匙向服务器通知完成任务的url
	var commitUrl = "http://"+$location.host()+":"+$location.port()+"/player/commit_task";
	//偶赚scheme
	var ozScheme = "ozhuan://";
	//是否自动重连
	var webSockRe = true;
	//safari跳打开微信
	var safariToWx = "weixin://";
	//提现接口
	var drawCash = "/player/withraw_cash"; 
	//签到接口
	var qianDao = "/player/every_day_sign_in";
	//抢红包接口
	var redEnvelope = "/player/grab_cash";
	//获取新手任务接口
	var newUserTaskList = "/player/get_data?action=noviceTaskListAndInfos";
	//提现记录
	var cashRecord = "/player/get_withraw_cash_record";
	//反馈
	var feedback = "/player/feedback";
	//微信分享的url
	var shareurl = "http://m.ozhuan.com/tpl/wx_share.html";
	//分享url到微信
	var wxshare = "ozhuan://share?";
	//获取签到情况
	var qiandaoData = "/player/get_data?action=signRecord";
	//分享后提交事件.
	var shareCommit = "/player/event_notify";
	//绑定手机号
	var sendCode= "/player/bind_phone";
	//提交验证码
	var commitCode= "/player/commit_phone_check_num";
	//微信内跳转到safari浏览器提示连接
	var wxToSafari = "http://wx.ozhuan.com/download_ozapp";
	//app需要运行的时间,检测到后提交时间
	var runTargetAppTime = 120;
	
	//app超时时间,算法，比如100M包大小,超时时间是100*0.1*60 = 600秒，十分钟.(目前没用这个，用服务器超时)
	var runAppTimeOut = 0.2;
	
	//一元夺宝
	var GoToYyg = "http://myyg.ozhuan.com";
	
	return {
		Version:Version,
		
		appIcon:appIcon,
		
		getUserInfo: getUserInfo,

		getTaskList: getTaskList,

		getTaskDetail: getTaskDetail,

		getStuInfo:getStuInfo,

		userExInfo:userExInfo,

		commitExInfo:commitExInfo,

		baishi:baishi,

		getSessionid: getSessionid,

		regUser: regUser,

		userLogin: userLogin,

		rewardHistory:rewardHistory,

		acceptTask: acceptTask,

		commitTask: commitTask,

		webSockUrl: webSockUrl,

		webSockRe: webSockRe,

		toAppstoreSearch:toAppstoreSearch,
		
		toAppstoreKeyWork:toAppstoreKeyWork,
		
		commitUrl:commitUrl,

		safariToWx:safariToWx,

		drawCash:drawCash,

		qianDao:qianDao,

		redEnvelope:redEnvelope,
		
		newUserTaskList:newUserTaskList,

		cashRecord:cashRecord,

		feedback:feedback,

		ozScheme:ozScheme,

		wxshare:wxshare,

		shareurl:shareurl,

		qiandaoData:qiandaoData,

		shareCommit:shareCommit,

		sendCode:sendCode,

		wxToSafari:wxToSafari,

		commitCode:commitCode,

		plistAdd:plistAdd,
		
		runTargetAppTime:runTargetAppTime,
		
		runAppTimeOut:runAppTimeOut,
		
		GoToYyg:GoToYyg
	};

}]);