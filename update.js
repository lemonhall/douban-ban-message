	var rollpage=function(){
		var number = urlParams["p"]===undefined?1:parseInt(urlParams["p"], 10);
			//console.log(number);			
			if(number!=100){
				location.href="http://www.douban.com/update/?p="+(number+1)+"&auto_roll=1";
			}
	},
	init_reshare_btn=function(){
		var reshare_btn=$("div.actions a.btn-reshare");
		reshare_btn.each(function(){
			var hd=$(this).parent().parent().parent().parent();
			var user_url=hd.find("div.hd>a").attr("href");
			if(user_url==undefined){

			}else{
				$(this).after("&nbsp;&nbsp;<a class='ban_temply_btn'>不再关注该话题</a>");
			}
		});

		//在Action条下运行的，暂时关小黑屋功能
		var ban_temply_btn=$("a.ban_temply_btn");
		ban_temply_btn.click(function(event){
			var myfather=$(this).parent().parent().parent().parent();
			//【存入数据库】行为对象，div.bd p.text下的第二个a连接的href一般来说就是行为
			var data_object=myfather.find("div.bd p.text a:eq(1)").attr("href");
			if(debug==1){console.log("行为对象:"+data_object);}
			//【存入数据库】行为对象的描述
			var data_description=myfather.find("div.bd p.text a:eq(1)").html();
			if(debug==1){console.log("行为对象:"+data_description);}
			//调试信息

			var objban_url=new Object();
				objban_url.url=data_object;
				objban_url.data_description=data_description;

			var retrievedObject = localStorage.getItem('douban_banlist');
			var banlist=JSON.parse(retrievedObject);
				banlist.push(objban_url);
			if(debug==1){console.log("暂时关小黑屋功能处理过的BANLIST："+banlist);}
			localStorage.setItem('douban_banlist', JSON.stringify(banlist));
			window.location.reload();
		});//End of 暂时关小黑屋功能LocalStorage

	},
	init_filter=function(){
		var retrievedObject = localStorage.getItem('douban_banlist');
		var banlist=JSON.parse(retrievedObject);
		//实际的隐藏工作的核心代码
		jQuery.each(banlist,function(index, objban_url){
		//定位到需要屏蔽的推荐地址的URL对象上去
		var ban_url=$("div.status-item div.bd p.text a[href*='"+objban_url.url+"']");
		//console.log(people.parent().parent().parent().html());
		//people.parent().parent().parent().parent(['data-object-kind=1022']).hide();
		ban_url.parent().parent().parent().parent().hide();

		//Add hyplink to 过滤器名单
			var ban_link="<a href='"+objban_url.url+"'>"+objban_url.data_description+"</a>";
			var data_type="<p>&nbsp;>不再关注<span>"+ban_link+"&nbsp;</span>"
			var clear_onetopic_ban="<a class='clear_onetopic_ban'>X</a></p>";
			ban_list_content.prepend(data_type+clear_onetopic_ban);      

		});//End of 实际的过滤代码.....就这么一小段而已
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