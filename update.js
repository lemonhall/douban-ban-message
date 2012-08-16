	var rollpage=function(){
		var number = urlParams["p"]===undefined?1:parseInt(urlParams["p"], 10);
			//console.log(number);			
			if(number!=100){
				location.href="http://www.douban.com/update/?p="+(number+1)+"&auto_roll=1";
			}
	},
	init_rollpage=function(){
		var doumail=$("a[href*='http://www.douban.com/doumail/']");
		//自动翻页功能相关代码段===================
			doumail.after("<a id='auto-scan-btn'>自动翻页</a>");
		$("#auto-scan-btn").bind("click",function(){			
			rollpage();
		});	
	};

 	var router = function (){
		if(ifupdate_url){
				//初始化的一些代码
				if(urlParams["auto_roll"]==="1"){setTimeout(rollpage,2000);}
				init_Menu();
				init_rollpage();				
				var overlay_background=$("#lemon-overlay");
				overlay_background.hide();
				init_reshare_btn();	
				init_filter();
				init_grouper();
		}//if_update_url end	
	};

	router();