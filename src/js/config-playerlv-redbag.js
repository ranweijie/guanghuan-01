//app services

//常量配置--玩家等级详情--抢红包档位
angular.module('ozApp.ConfigPlayerLvRedBag', [])
.factory('ConstantPlayerLvRedBag', ['$location',function($location) {

	//玩家等级配置
	var PlayerLvCfg = [
		{"Level":0,"IncomeNeed":0,"StudentAmountNeed":0,"TeachRewardRote":10,"Title":"勤学苦练"},
		{"Level":1,"IncomeNeed":1000,"StudentAmountNeed":1,"TeachRewardRote":11,"Title":"初出茅庐"},
		{"Level":2,"IncomeNeed":3000,"StudentAmountNeed":3,"TeachRewardRote":12,"Title":"小试牛刀"},
		{"Level":3,"IncomeNeed":8000,"StudentAmountNeed":5,"TeachRewardRote":13,"Title":"崭露头角"},
		{"Level":4,"IncomeNeed":15000,"StudentAmountNeed":10,"TeachRewardRote":14,"Title":"精益求精"},
		{"Level":5,"IncomeNeed":30000,"StudentAmountNeed":20,"TeachRewardRote":15,"Title":"一方威名"},
		{"Level":6,"IncomeNeed":50000,"StudentAmountNeed":50,"TeachRewardRote":16,"Title":"炉火纯青"},
		{"Level":7,"IncomeNeed":100000,"StudentAmountNeed":100,"TeachRewardRote":17,"Title":"笑傲江湖"},
		{"Level":8,"IncomeNeed":200000,"StudentAmountNeed":150,"TeachRewardRote":18,"Title":"纵横天下"},
		{"Level":9,"IncomeNeed":500000,"StudentAmountNeed":200,"TeachRewardRote":19,"Title":"一代宗师"},
		{"Level":10,"IncomeNeed":1000000,"StudentAmountNeed":300,"TeachRewardRote":20,"Title":"独孤求败"}
	];

	//红包档位
	var GrabCashGear = [
		{"Gear":0,"CashAmount":2},
		{"Gear":1,"CashAmount":5},
		{"Gear":2,"CashAmount":10},
		{"Gear":3,"CashAmount":100},
		{"Gear":4,"CashAmount":200},
		{"Gear":5,"CashAmount":500},
		{"Gear":6,"CashAmount":1000},
		{"Gear":7,"CashAmount":10000}
	];
	return {

		PlayerLvCfg:PlayerLvCfg,

		GrabCashGear:GrabCashGear
	};
}]);