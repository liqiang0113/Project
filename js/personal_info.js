$(function(){
	$(".identity b,.attention b").click(function(){
		$(this).toggleClass("hover");
	})
	
	//实例化输入提示的JS,参数为进行查询操作时要调用的函数名 
	var searchSuggests = new searchSuggest($(".countrys div"),$(".country")); 
	var searchSuggests = new searchSuggest($(".primarys div"),$(".primary")); 
	var searchSuggests = new searchSuggest($(".secondarys div"),$(".secondary")); 
	/*禁用enter提交form*/
	 document.onkeydown = function(event) {  
           var target, code, tag;  
           if (!event) {  
              event = window.event; //针对ie浏览器  
              target = event.srcElement;  
              code = event.keyCode;  
              if (code == 13) {  
                 tag = target.tagName;  
                 if (tag == "TEXTAREA") { return true; }  
                   else { return false; }  
               }  
            }  
            else {  
                target = event.target; //针对遵循w3c标准的浏览器，如Firefox  
                code = event.keyCode;  
                if (code == 13) {  
                    tag = target.tagName;  
                    if (tag == "INPUT") { return false; }  
                    else { return true; }  
                }  
            }  
        };
})


/*
 * ListMain 列表内容的容器
 * viewInput 展示区域
 */
function searchSuggest(ListMain,viewInput){
	var suggestWrap=ListMain;
	var input=viewInput;
	var highLightIndex=-1;
	var ids;
	var txt;
	var timeoutId;
	//初始化
	var init=function(){
		input.bind("keyup",sendKeyWord);
		$(document).click(function(){
			hideSuggest();
			suggestWrap.empty();
		})
	}
	//渲染下拉列表;
	var renderFn=function(){
		var applyName=$(".applyName").val();
		var investName=$(".investName").val();
		var techName=input.val();
		var param={
			applyname:applyName,
			investname:investName,
			techNameparam:techName
		};
		$.ajax({
			type:'get',
			data:param,
			url:'../../js/test.json',
			dataType:'json',
			success:function(result){
				console.log(result);
				var str="";
				$.each(result,function(index,value){
					str+='<p id='+index+'>'+result[index].name+'</p>';
				})
				suggestWrap.append(str);
				suggestWrap.show();
				changeLight();
				changeText();
			},
			error:function(){
				hideSuggest();
			}
		})
	}
	//发送请求,根据关键字在后台查询;
	var sendKeyWord=function(event){
		//键盘选择下拉项;
		var myEvent = event || windows.event; 
        var keyCode = myEvent.keyCode; 
        //输入是字母，或者退格键则需要重新请求 
        if(keyCode ==8){ 
           highLightIndex = -1;
           suggestWrap.empty();
           //处理上下键(up,down) 
         }else if(keyCode == 38 || keyCode == 40){ 
              processKeyUpAndDown(keyCode);
              //按下了回车键 
         }else if(keyCode == 13){
              processEnter();
         }
	}
	var processKeyUpAndDown=function(keyCode){
		var words = suggestWrap.children(); 
        var num = words.length; 
        if(num <= 0) return; 
        changeToWhite(); 
        highLightIndex = ((keyCode != 38 ? num + 1:num - 1)+highLightIndex) % num; 
        words.eq(highLightIndex).addClass("hover");
        ids=words.eq(highLightIndex).attr("id");
        txt=words.eq(highLightIndex).text()
        input.val(txt); 
	}
	//鼠标滑过每一项高亮显示;
	var changeLight=function(){
		suggestWrap.find("p").hover(function(){
			suggestWrap.find("p").removeClass("hover");
			$(this).addClass("hover");
		},function(){
			$(this).removeClass("hover");
		})
	}
	//鼠标点击每一项时,显示剩余的内容;
	var changeText=function(){
		suggestWrap.find("p").click(function(){
			input.val($(this).text());
			hideSuggest();
			suggestWrap.empty();
		})
	}
	
	var processEnter=function(){
		if(highLightIndex != -1){
			hideSuggest();
			suggestWrap.empty(); 
		}
	}
	//input聚焦事件;
	input.bind("click",function(){
		suggestWrap.empty();
		renderFn();
	})
	//隐藏下拉框
	var hideSuggest=function(){
		suggestWrap.hide();
	}
	//改变高亮显示;
	var changeToWhite=function(){
		if(highLightIndex != -1){ 
            suggestWrap.children().eq(highLightIndex).removeClass('hover'); 
        } 
	}
	init();
}