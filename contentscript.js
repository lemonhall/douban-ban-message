﻿/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
 
(function(){
	function dayDiffFromNow(thePast){
			var millisBetween=Date.now()-thePast;
			var millisecondsPerDay = 1000 * 60 * 60 * 24;
			return	Math.floor(millisBetween / millisecondsPerDay);
	}
	var debug=4;
	var cur_location=location.href;
	var ifupdate_url=cur_location.slice(0,29)=="http://www.douban.com/update/";
	var people=cur_location.slice(29,-1);
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


var datatypehash={3043:"推荐单曲",1025:"上传照片",1026:"相册推荐",1013:"推荐小组话题",1018:"我说",1015:"推荐/新日记",1022:"推荐网址",1012:"推荐书评",1002:"看过电影",3049:"读书笔记",1011:"活动兴趣",3065:"东西",1001:"想读/读过",1003:"想听/听过"};
//====================================================================
//如果是在广播界面
	if(ifupdate_url){
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
	ban_temply_btn=$("a.ban_temply_btn");
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

	//缓存bancontent-div
	var clear_onetopic_ban=$(".clear_onetopic_ban");
	//删除某个话题的BAN行为
	clear_onetopic_ban.click(function(event){
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
	});

var need_save_kind={1026:"相册推荐",1013:"推荐小组话题",1015:"推荐/新日记",1012:"推荐书评",3065:"东西",1025:"推荐相片"}


$("div.status-item").each(function(){
	var myself=$(this);
	//优先判断是否为值得存取的类型
	//【存入数据库】类型
	var data_kind=myself.attr("data-object-kind");
	//【存入数据库】数据行为
	var data_action=myself.attr("data-action");
		if(debug==1){console.log("Action:"+data_action);}
//============================================
	if((need_save_kind.hasOwnProperty(data_kind))&&(data_action=="0"||data_action=="1")){
	//打印人性化的提示信息
	var action=datatypehash[data_kind]==undefined?data_kind:datatypehash[data_kind];
		if(debug==1){console.log("Kind:"+action);}			
		
	//【数据库KEY】SID
	var data_sid=myself.attr("data-sid");
		if(debug==1){console.log("ID:"+data_sid);}
	//用户地址
	var user_url=myself.find("div.bd p.text a:first").attr("href");
		if(debug==1){console.log("user_url:"+user_url);}		
	//用户的昵称
	var user_name=myself.find("div.bd p.text a:first").html();
		if(debug==1){console.log("user_name:"+user_name);}
	//用户的发言
	var user_quote=myself.find("div.bd blockquote p").html();
		if(debug==1){console.log("user_quote:"+user_quote);}
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
	var uid_url=user_url+"status/"+data_sid;
	//建立新的ITME对象，暂时只记录这一条的UID以及时间还有
	var newitem={};
	newitem.user_uid=user_uid;
	newitem.time=time;
	newitem.user_name=user_name;	
	newitem.uid_url=uid_url;
	newitem.data_sid=data_sid;
	newitem.user_quote=user_quote;
	//判断是否有KEY存在？如果存在，则取出，加入最新的data，然后保存
	if(localStorage.hasOwnProperty(data_object)){
		//循环外取出对象，到内存(这里应该还有优化的余地)
		var retrievedObject = localStorage.getItem(data_object);
		var status=JSON.parse(retrievedObject);

		var ifexist=false;
		//这里应该剔除同一用户的同一全局行为
		jQuery.each(status,function(index, onestatu){		
			if(onestatu.uid_url==uid_url){
				ifexist=true;
			}
		});//Endof 剔除同一全局STATUS_URL的循环
		if(debug==2){console.log("最终判断出来的是否存在"+ifexist);}
		if(!ifexist){
			status.push(newitem);
			status.sort(function(a,b) {return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0);} );
			//可以在这里加入时间限制，比如超过3天的东西，就不予继续缓存在本地
			localStorage.setItem(data_object, JSON.stringify(status));
		}
		//调试语句，打印修改后的单条status
		if(debug==2){
			if(status.length>2){
			console.log("修改后的status,dataobject:"+data_object);				
				jQuery.each(status,function(index, onestatu){
					//打印数据描述
				if(index==0){
					console.log("+人性化数据描述:"+onestatu.data_description);
					console.log("-共有条目:"+status.length);
				}else{
					console.log("--用户名:"+"("+index+")"+onestatu.user_name);
					console.log("--------全局链接:"+onestatu.uid_url);
					console.log("--------用户发言:"+onestatu.user_quote);						
				}
				});
			}
		}//debug的东西endif
//===========================================================		
//如果值得折叠则，开始实际的折叠逻辑
if(status.length>2){
//定位p.text a对象，然后开始修改吧，少年
var user_actions_obj=myself.find("div.actions");
user_actions_obj.parent().parent().parent().css("background-color","#E9F4E9");
//循环开始之前先给楼主自己加上标示
var user_quote_obj=myself.find("div.bd blockquote");
user_quote_obj.before("楼主说：");
jQuery.each(status,function(index, onestatu){
//不去管第一条META信息，以及本条目本身
if((index!=0)&&(onestatu.data_sid!=data_sid)){	
//隐藏不等于本条目data-sid的其余全部
//同一页面的隐藏逻辑仍旧有问题
//应该是这样，使用行为对象来进行扫描，扫描全部同一行为对象的集合
//隐藏除了第一个以外的行为对象，比如同一页面上有多个推荐同一话题的
//则隐藏除了第一个以外的
//user_actions_obj.parent().parent().parent().parent("[data-sid=='"+onestatu.data_sid+"']").hide();
//【存入数据库】行为对象，div.bd p.text下的第二个a连接的href一般来说就是行为
// var data_object=myself.find("div.bd p.text a:eq(1)").attr("href");
// 	if(debug==1){console.log("行为对象:"+data_object);}
if(onestatu.user_quote!=null){
//加入用户的发言信息
var before_quote="<a href='"+onestatu.uid_url+"'>"+onestatu.user_name+"</a>&nbsp;"+onestatu.time+"&nbsp;说:"+"<blockquote><p>"+onestatu.user_quote+"</p></blockquote>";
}else{
var before_quote="<a href='"+onestatu.uid_url+"'>"+onestatu.user_name+"</a>&nbsp;"+onestatu.time+"<blockquote><p>什么也没说~</p></blockquote>";
}
user_actions_obj.before(before_quote);
}
});//End of each loop

}
//=========================================
	}else{
		//如果不存在，则建立一个全新的就OK
		if(debug==1){
			console.log("=======First Blood!!=========");
			console.log("UserID:"+newitem.user_uid);
			console.log("Time:"+newitem.time);
			console.log("Name:"+newitem.user_name);
			console.log("UID_URL:"+newitem.uid_url);
			console.log("SID:"+newitem.data_sid);
			console.log("Quote:"+newitem.user_quote);
		}
		var newarray=new Array();
		//第一次扫描得到该条目时，ARRAY的第一条为该条目的详细信息
		var dataitem={};
		dataitem.data_description=data_description;
		dataitem.data_timestamp=Date.now();
		newarray.push(dataitem);
		newarray.push(newitem);
		localStorage.setItem(data_object, JSON.stringify(newarray));
	}//判断key/value存储当中dataobject_url是否计入存储的endif
	//存入逻辑结束
	}
});
	
		
	}//End of if update view?
 
} )();