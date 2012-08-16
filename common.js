var datatypehash={3043:"推荐单曲",1025:"上传照片",1026:"相册推荐",1013:"推荐小组话题",1018:"我说",1015:"推荐/新日记",1022:"推荐网址",1012:"推荐书评",1002:"看过电影",3049:"读书笔记",1011:"活动兴趣",3065:"东西",1001:"想读/读过",1003:"想听/听过"};
	var debug=4;
	var cur_location=location.href;
	var ifupdate_url=cur_location.slice(0,29)=="http://www.douban.com/update/";
	var people=cur_location.slice(29,-1);

var urlParams = {};
	(function () {
	    var match,
	        pl     = /\+/g,  // Regex for replacing addition symbol with a space
	        search = /([^&=]+)=?([^&]*)/g,
	        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
	        query  = window.location.search.substring(1);

	    while (match = search.exec(query))
	       urlParams[decode(match[1])] = decode(match[2]);
	})();
	//console.log(urlParams);
	function dayDiffFromNow(thePast){
			var millisBetween=Date.now()-thePast;
			var millisecondsPerDay = 1000 * 60 * 60 * 24;
			return	Math.floor(millisBetween / millisecondsPerDay);
	}	
	//判断是否是第一次运行
	var banfirstRun = (localStorage['douban_first'] == 'true');
		if (!banfirstRun) {
		//是第一次，则设置标记,初始化一个空数组，并设置给localStorage
  		localStorage['douban_first'] = 'true';
  		var empty_array=new Array();
  		localStorage.setItem('douban_banlist', JSON.stringify(empty_array));
		}

	//判断是否是第一次运行
	var firstRun = (localStorage['douban_collpse_timeout_mark'] == undefined);
	if(debug==3){console.log("firstRun："+firstRun);}
		if (!firstRun) {
			//不是第一次则比较时间
			var marktime=localStorage['douban_collpse_timeout_mark'];			
    		var days = dayDiffFromNow(marktime);
			//清除所有的缓存？
			if(debug==3){console.log("运行插件的日期差："+days);}
			//这是最简单粗暴的清理原则，但说实话，的确太暴力了
			if(days>3){
				localStorage.clear();
				localStorage['douban_collpse_timeout_mark'] = Date.now();
			}
		}else{
			//是第一次，则设置标记,记录当前时间
			localStorage['douban_collpse_timeout_mark'] = Date.now();
	}