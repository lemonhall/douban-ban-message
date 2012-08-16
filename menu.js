	var clear_onetopic_ban=function(event){
		var retrievedObject = localStorage.getItem('douban_banlist');
		var banlist=JSON.parse(retrievedObject);
		event.stopPropagation();
		var ifexist=false;
		var banindex=0;
		var get_url=$(this).parent().find('a').attr("href");
		if(debug==4){
			console.log(get_url);
		}
		//取出保存在游览器内的名单,并判断是否存在
				jQuery.each(banlist,function(index, objban_url){
					if(get_url==objban_url.url){
						ifexist=true;
						banindex=index;//记录INDEX值
					};
				});
		if(debug==4){
			console.log("判断是否存在的bool:"+ifexist);
			console.log("URL:"+get_url);
		}
			if(ifexist==true){
				banlist.splice(banindex, 1);
			}
		if(debug==4){console.log("处理过的BANLIST："+banlist);}
		localStorage.setItem('douban_banlist', JSON.stringify(banlist));
		$(this).parent().html("");
  		window.location.reload();

	},
	init_Menu=function(){
		//加入过滤器标示并建立好对象	
		var doumail=$("a[href*='http://www.douban.com/doumail/']");
			doumail.after("<a id='douban-filter-btn' href='#'>过滤名单</a>");
		var overlay_html="<div id='lemon-overlay' style='position:absolute;left: 0px;top: 0px;width:100%;height:100%;z-index: 1000;'>";
		var overlaydiv_html="<div id='lemon-overlaydiv' style='width:250px;height:400px;margin: 30px 0px 0px 70%;background-color: #fff;border:1px solid #000;padding:15px;overflow-y:scroll;'>";
		var closelnk_html="<a href='#'' class='overlay-lnk-close'>关闭[X]</a>";
		var clearlnk_html="<a href='#'' class='clear-all-banlist'>清空全部</a>";
		var content_html="<div id='ban-content'></div>";
		var overlayend_html="</div></div>";
		doumail.after(overlay_html+overlaydiv_html+closelnk_html+clearlnk_html+content_html+overlayend_html);
		//缓存好【过滤器】这个关键的按钮对象
		var db_filter_btn=$("#douban-filter-btn");
		//缓存好【弹出窗口的CLOSE对象】
		var overlay_close_btn=$(".overlay-lnk-close");
		//缓存设置窗口的遮罩层
		var overlay_background=$("#lemon-overlay");
		//缓存设置窗口本身
		var overlay_win=$("#lemon-overlaydiv");
		//缓存bancontent-div
		var ban_list_content=$("#ban-content");
		//当设置菜单隐藏后，取得指定的ID并隐藏
		//TODO：将设置的ID保存在LOCALSTORAGE里面去		
		jQuery.fn.hideandban = function() {
	    	var o = $(this[0]); 
	    	o.hide();    	
		};
		//设置窗口的关闭按钮行为
		overlay_close_btn.click(function(event){
			event.stopPropagation();
			overlay_background.hideandban();	
		});
		//如果在设置框外点击，则立即隐藏整个遮罩层
		overlay_background.click(function(){
			overlay_background.hideandban();	
		});
		//点击设置窗口本身就别冒泡了，好不？
		overlay_win.click(function(event){
			event.stopPropagation();
			overlay_background.show();	
		});
		//过滤器链接的点击事件响应
		db_filter_btn.click(function(){
				console.log("db_filter_btn click!");
				overlay_background.show();
			}
		);

		//缓存好【清空全部对象】
		var clear_all_banlist_btn=$(".clear-all-banlist");
		//设置【清空全部对象】行为
		clear_all_banlist_btn.click(function(event){
			event.stopPropagation();
			var empty_array=new Array();
	  		localStorage.setItem('douban_banlist', JSON.stringify(empty_array));
	  		ban_list_content.html("");
	  		window.location.reload();
		});

		//缓存bancontent-div
		var clear_onetopic_ban=$(".clear_onetopic_ban");
		//删除某个话题的BAN行为
		clear_onetopic_ban.click(function(event){
			clear_onetopic_ban(event);
		});			

	};