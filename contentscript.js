/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
 
(function(){
	var cur_location=location.href;
	var ifupdate_url=cur_location.slice(0,29)=="http://www.douban.com/update/";
	//判断是否是第一次运行
	var firstRun = (localStorage['douban_first'] == 'true');
		if (!firstRun) {
		//是第一次，则设置标记,初始化一个空数组，并设置给localStorage
  		localStorage['douban_first'] = 'true';
  		var empty_array=new Array();
  		localStorage.setItem('douban_banlist', JSON.stringify(empty_array));
		}
	var datatypehash={3043:"推荐单曲",1025:"上传照片",1026:"相册推荐",1013:"推荐小组话题",1018:"我说",1015:"推荐/新日记",1022:"推荐网址",1012:"推荐书评",1002:"看过电影",3049:"读书笔记",1011:"活动兴趣",3065:"东西",1001:"想读/读过",1003:"想听/听过"};
//====================================================================
//如果是在广播界面
	if(ifupdate_url){
		//console.log("我正在处理广播页面");
		//console.log('retrievedObject: ', banlist);
		var retrievedObject = localStorage.getItem('douban_banlist');
		var banlist=JSON.parse(retrievedObject);



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
	//缓存好【清空全部对象】
	var clear_all_banlist_btn=$(".clear-all-banlist");
	//缓存设置窗口的遮罩层
	var overlay_background=$("#lemon-overlay");
	//缓存设置窗口本身
	var overlay_win=$("#lemon-overlaydiv");
	//缓存bancontent-div
	var ban_list_content=$("#ban-content");
	//设置【清空全部对象】行为
	clear_all_banlist_btn.click(function(event){
		event.stopPropagation();
		var empty_array=new Array();
  		localStorage.setItem('douban_banlist', JSON.stringify(empty_array));
  		ban_list_content.html("");
  		window.location.reload();
	});

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


	//初始化的一些代码
	overlay_background.hide();

var need_save_kind={1026:"相册推荐",1013:"推荐小组话题",1015:"推荐/新日记",1012:"推荐书评",3065:"东西"}
var debug=2;
$("div.status-item").each(function(){
	var myself=$(this);
	//优先判断是否为值得存取的类型
	//【存入数据库】类型
	var data_kind=myself.attr("data-object-kind");
	if(need_save_kind.hasOwnProperty(data_kind)){
		//打印人性化的提示信息
	var action=datatypehash[data_kind]==undefined?data_kind:datatypehash[data_kind];
		if(debug==1){console.log("Kind:"+action);}			
		
	//【数据库KEY】SID
	var data_sid=myself.attr("data-sid");
		if(debug==1){console.log("ID:"+data_sid);}
	//【存入数据库】数据行为
	data_action=myself.attr("data-action");
		if(debug==1){console.log("Action:"+data_action);}

	//用户地址
	var user_url=myself.find("div.bd p.text a:first").attr("href");
		if(debug==1){console.log("user_url:"+user_url);}
	//用户的昵称
	var user_name=myself.find("div.bd p.text a:first").html();
		if(debug==1){console.log("user_name:"+user_name);}
	//【存入数据库】用户的唯一ID
	var user_uid=user_url.slice(29,-1);
		if(debug==1){console.log("user_uid:"+user_uid);}
	//【存入数据库】行为对象，div.bd p.text下的第二个a连接的href一般来说就是行为
	var data_object=myself.find("div.bd p.text a:eq(1)").attr("href");
		if(debug==1){console.log("行为对象:"+data_object);}
	//【存入数据库】行为对象的描述
	var data_description=myself.find("div.bd p.text a:eq(1)").html();
		if(debug==1){console.log("行为对象:"+data_description);}
	//【存入数据库？】时间对象？
	var time=myself.find("div.actions span.created_at").attr("title");
		if(debug==1){console.log("Time:"+time);}
	//生成一个全局对象ID的URL并存入数据库
	var uid_url=user_url+"status"+data_sid;
	//建立新的ITME对象，暂时只记录这一条的UID以及时间还有
	var newitem={};
	newitem.user_uid=user_uid;
	newitem.time=time;
	newitem.user_name=user_name;	
	newitem.uid_url=uid_url;
	//判断是否有KEY存在？如果存在，则取出，加入最新的data，然后保存
	if(localStorage.hasOwnProperty(data_object)){
		var retrievedObject = localStorage.getItem(data_object);
		var status=JSON.parse(retrievedObject);
		//这里应该剔除同一用户的行为
		var ifexist=true;		
		jQuery.each(status,function(index, onestatu){
			if(onestatu.user_uid==user_uid){
				ifexist=true;
			}else{
				ifexist=false;
			}

		});
		if(!ifexist){
			status.push(newitem);
			localStorage.setItem(data_object, JSON.stringify(status));
		}else{
			//DO nothing
		}
		//调试语句，打印修改后的单条status
		if(debug==2){
			if(status.length>3){
			console.log("修改后的status,dataobject:"+data_object);				
				jQuery.each(status,function(index, onestatu){
					//打印数据描述
				if(index==0){
					console.log("人性化数据描述:"+onestatu.data_description);
				}else{
					console.log("用户名:"+onestatu.user_name);
					console.log("全局链接:"+onestatu.uid_url);					
				}
				});
			}
		}//debug的东西endif
	}else{
		//如果不存在，则建立一个全新的就OK
		var newarray=new Array();
		//第一次扫描得到该条目时，ARRAY的第一条为该条目的详细信息
		var dataitem={};
		dataitem.data_description=data_description;
		newarray.push(dataitem);
		newarray.push(newitem);
		localStorage.setItem(data_object, JSON.stringify(newarray));
	}//判断key/value存储当中dataobject_url是否计入存储的endif
	//存入逻辑结束
	}
});
	
		
	}//End of if update view?
 
} )();
