//app services


//常量配置--提现金额及描述文字

angular.module('ozApp.ConfigDrawcashAndDesc', [])

.factory('ConstantDrawcashAndDesc', ['$location',function($location) {


	//取现金额档位对应

	var WithrawCashGear = {

		"1": 1000,

		"2": 5000,

		"3": 10000,

		"4": 50000,

		"5": 100000,

		"6": 10000000} 

	//收徒描述

	var studentDescStr = "当你推荐的徒弟完成下载任务时，你将获得最高20%的奖励，并且当你的徒弟再推荐加入的徒弟完成下载任务时，您也可以获得5%的收入，上不封顶哦！亲";

	//联盟任务未收到奖励说明

	var noRecieveLmPrizeExplain = [

		"1、您必须是首次安装，非首次安装将不能获得奖励；",

		"2、请仔细阅读任务要求，根据任务要求来完成任务；",

		"3、大多数情况下，完成任务即可收到奖励，偶尔会由于第三方服务延迟不能及时返还，请耐心等待；",

		"4、在使用本产品获取任务奖励的过程中遇到任何问题或疑问,可随时通过“个人中心->需要帮助->意见反馈”功能向我们进行问题反馈，我们会在核实之后尽快处理。"];

	//帮助中心--常见问题

	var commonIssueDescArray = [

		"1、未检测到钥匙问题，请手动打开钥匙APP运行然后点击开始赚钱重新进入即可;",

		"2、如果钥匙在运行，但还是提示未检测到钥匙，请手动关闭钥匙，然后再重启运行钥匙即可;",

		"3、钥匙不能启动问题，请先长按删除钥匙，并进用safari浏览器输入我们官网www.ozhuan.com,点击安装助手,重新下载新版本钥匙APP，安装后在设置-->通用-->描述文件中信任钥匙APP，即可正常打开使用;",

		"4、如还有其它问题，可以通过微信或者帮助中心-->反馈问题给我们,感谢你耐心看完。"];

	//start页--滚动展示内容--Name

	var startPageDisplayNameArray = [

		"loveU",

		"sandx",

		"1314Love",

		"passNN",

		"抚顺雷锋",

		"alrfa",

		"lookme",

		"念佛、",

		"走样",

		"axib",

		"方士的2"];

	//start页--滚动展示内容--text

	var startPageDisplayTextArray = [

		"得到了3.00元",

		"领取了5.00元红包",

		"领取了一个任务",

		"邀请了一位用户",

		"提取了10元现金",

		"提取了50元现金",

		"邀请了2位用户",

		"得到了2元任务奖励",

		"得到了3元任务奖励",

		"邀请了2位好友",

		"提取了30元现金"];

	return {


		WithrawCashGear: WithrawCashGear,


		studentDescStr: studentDescStr,


		noRecieveLmPrizeExplain: noRecieveLmPrizeExplain,


		commonIssueDescArray: commonIssueDescArray,


		startPageDisplayNameArray: startPageDisplayNameArray,


		startPageDisplayTextArray: startPageDisplayTextArray

	};

}]);