
//app config
angular.module('ozApp', ['ui.router', 'ozApp.directive', 'ozApp.controllers', 'ozApp.Auth', 'ozApp.Config', 
  'ozApp.ConfigPlayerLvRedBag', 'ozApp.ConfigDrawcashAndDesc', 'ozApp.Websocket', 'ozApp.Http', 'ozApp.Task', 
  'ozApp.filter', 'ozApp.tools'])
  //全局初始化，只对全局变量如rootScope有效
  .run(['$rootScope', 'MyWebSock', 'tools', function ($rootScope, MyWebSock, tools) {

    //启动webscoket服务
    MyWebSock.startWebsock();
    //全局提示模版。
    $rootScope.loadText = "加载中...";
    //全局提示模版是否显示
    $rootScope.ShowLoading = false;
    //是否显示钥匙未连接提示框
    $rootScope.showNotConnectApp = false;
    //检查是否有渠道id,这是判断是不是从渠道来的链接.
		var channelId = tools.GetQueryString("channelId");
    //有渠道id，就写入cookie备用，
    if (channelId != null){
      tools.setCookie("channelId",channelId);
    }
    
    //匹配ios6系统版本,是就提示，因为ios6及以前html5支持不好。
    if (tools.iOSVersion() === 6) {
      alert("您手机系统的版本为iOS6,版本较低，浏览体验会不佳，请升级到iOS7及以上系统来体验我们的网站，谢谢！");
    }

  }])

  //配置路由
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide', function ($stateProvider, $urlRouterProvider, $httpProvider, $provide) {
    //默认路由
    $urlRouterProvider.otherwise("/start");
    $stateProvider.state('start', {
      url: "/start",
      cache: 'false',
      templateUrl: "tpl/start.html",
      controller: 'startController'
    }).state('userindex', {
      url: "/userindex",
      cache: 'false',
      templateUrl: "tpl/userindex.html",
      controller: 'ozIndexController'
    }).state('usercenter', {
      url: "/usercenter",
      cache: 'false',
      templateUrl: "tpl/usercenter.html",
      controller: 'usercenter'
    }).state('userinfochange', {
      url: "/userinfochange",
      cache: 'false',
      templateUrl: "tpl/userinfochange.html",
      controller: 'userinfochange'
    }).state('taskdetail', {
      url: "/tasklmdetail",
      cache: 'false',
      templateUrl: "tpl/tasklmdetail.html",
      controller: 'tasklmdetail'
    }).state('taskowndetail', {
      url: "/taskowndetail/:taskId",
      cache: 'false',
      templateUrl: "tpl/taskowndetail.html",
      controller: 'taskowndetail'
    }).state('tasklist', {
      url: "/tasklist",
      cache: 'false',
      templateUrl: "tpl/tasklist.html",
      controller: 'tasklist'
    }).state('student', {
      url: "/studentInfo/:sid",
      cache: 'false',
      templateUrl: "tpl/student.html",
      controller: 'student'
    }).state('mywallet', {
      url: "/mywallet",
      cache: 'false',
      templateUrl: "tpl/mywallet.html",
      controller: 'mywallet'
    }).state('help', {
      url: "/help",
      cache: 'false',
      templateUrl: "tpl/help.html",
      controller: 'help'
    }).state('taskincome', {
      url: "/taskincome/:typeId",
      cache: 'false',
      templateUrl: "tpl/taskincome.html",
      controller: 'taskincome'
    }).state('drawcash', {
      url: "/drawcash",
      cache: 'false',
      templateUrl: "tpl/drawcash.html",
      controller: 'drawcash'
    }).state('qiandao', {
      url: "/qiandao",
      cache: 'false',
      templateUrl: "tpl/qiandao.html",
      controller: 'qiandao'
    }).state('redenvelope', {
      url: "/redenvelope",
      cache: 'false',
      templateUrl: "tpl/redenvelope.html",
      controller: 'redenvelope'
    }).state('commonissue', {
      url: "/commonissue",
      cache: 'false',
      templateUrl: "tpl/commonissue.html",
      controller: 'commonissue'
    }).state('usercourse', {
      url: "/usercourse",
      cache: 'false',
      templateUrl: "tpl/usercourse.html",
      controller: 'usercourse'
    }).state('feedback', {
      url: "/feedback",
      cache: 'false',
      templateUrl: "tpl/feedback.html",
      controller: 'feedback'
    }).state('abountoz', {
      url: "/abountoz",
      cache: 'false',
      templateUrl: "tpl/abountoz.html",
      controller: 'abountoz'
    }).state('cashrecord', {
      url: "/cashrecord",
      cache: 'false',
      templateUrl: "tpl/cashrecord.html",
      controller: 'cashrecord'
    }).state('morelevel', {
      url: "/morelevel",
      cache: 'false',
      templateUrl: "tpl/morelevel.html",
      controller: 'morelevel'
    });

    // 注册一个请求拦截器
    $provide.factory('myHttpInterceptor', ['$rootScope', '$q', '$location', '$injector', '$timeout', '$location',
      function ($rootScope, $q, $location, $injector, $timeout) {
        return {
          'request': function (config) {
            return config;
          },
          'requestError': function (rejection) {
            return $q.reject(rejection);
          },
          'response': function (response) {
            if (response.data.code === 1 || response.data.code === 201) {

              $location.path('/start');
            }
            return response;
          },

          'responseError': function (rejection) {
            $rootScope.ShowLoading = true;
            $rootScope.loadText = "网络请求错误!";
            $timeout(function () {
              $rootScope.ShowLoading = false;
            }, 800);
            return $q.reject(rejection);
          }
        };
      }
    ]);
    //把拦截器装载进去
    $httpProvider.interceptors.push('myHttpInterceptor');
    //解决angularjs post提交时数据不在formdata里面的问题。
    $httpProvider.defaults.transformRequest = function (obj) {
      var str = [];
      for (var p in obj) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
      return str.join("&");
    }
    $httpProvider.defaults.headers.post = {
       'Content-Type': 'application/x-www-form-urlencoded'
    }

  }]);