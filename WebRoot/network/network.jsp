<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'uploadhead.jsp' starting page</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<link rel="stylesheet" href="<%=path%>/resources/easydialog/easydialog.css" type="text/css" />
	
	<script type="text/javascript" src="<%=path%>/swfupload/swfupload.js"></script>
	<script type="text/javascript" src="<%=path%>/jquery-1.8.0.js"></script>
	<script type="text/javascript" src="<%=path%>/upload.js"></script>
	<script type="text/javascript" src="<%=path%>/resources/easydialog/easydialog.min.js"></script>
	
	<script src="<%=path%>/resources/js/jsCodeFormat/codemirror.js"></script>
    <script src="<%=path%>/resources/js/jsCodeFormat/javascript.js"></script>

    <link href="<%=path%>/resources/js/jsCodeFormat/codemirror.css" rel="stylesheet">
    <link href="<%=path%>/resources/js/jsCodeFormat/monokai.css" rel="stylesheet">
	
	<style type="text/css">
		.easyDialog_wrapper .easyDialog_title {
			height: 30px;
			line-height: 30px;
			overflow: hidden;
			color: #666;
			padding: 0 10px;
			font-size: 14px;
			border-bottom: 1px solid #e5e5e5;
			background: #f7f7f7;
			border-radius: 4px 4px 0 0;
			margin: 0px;
		}
		
		.node {
		  fill: #000;
		  cursor: crosshair;
		}
		
		.node_selected {
		  fill: #ff7f0e;
		  stroke: #ff7f0e;
		}
		
		.drag_line {
		  stroke: #999;
		  stroke-width: 2;
		  /**stroke-width: 5;**/
		  pointer-events: none;
		}
		
		.drag_line_hidden {
		  stroke: #999;
		  stroke-width: 0;
		  pointer-events: none;
		}
		
		.drag_line{
		  stroke: #999;
		  pointer-events: none;
		}
		
		.link {
		  stroke: #999;
		  /**stroke-width: 5;**/
		  cursor: crosshair;
		}
		
		.link_selected {
		  stroke: #ff7f0e;
		}
		
		.tool_code{
			/*border:1px solid #b0b0b0;*/
			position: relative;
			text-align: right;
			vertical-align: middle;
			border-bottom: 1px solid #b0b0b0;;
		}
		
		.tool_code button{
			text-align: right;
		}
		
		.CodeMirror {
			/*border: 1px solid #b0b0b0;*/
			height: 470px;
		}
		
		#code_chart_view{
			position: absolute;
			left: 50px;
			top:50px;
			width: 1000px;
			height:500px;
			border:1px solid #b0b0b0;
		}
		
		#codeView{
			position: absolute;
			/*border:1px solid #b0b0b0;*/
			left:0;
			top:0;
			width: 100%;
			height:100%;
			z-index: -1;
			
			background: #fff;
		}
		
		#chartView{
			position: absolute;
			/*border:1px solid #b0b0b0;*/
			left:0;
			top:0;
			width: 100%;
			height:100%;
			background: #fff;
		}
		
		.easyDialog_wrapper {
			width: 400px;
		}
		
		.easyDialog_wrapper .easyDialog_text {
			padding: 25px 10px 10px;
		}
		
		object{
			position: absolute;
			top: 3px;
		}
		
		.poplist{
			position: relative;
		}
		
	</style>
  </head>
  
 <body>  
		
		<div id='pop_image_up' style="display:none">
			<div class="poplist">
				<div id="spanButtonPlaceholder" style='position: relative;top: 12px;'></div>
		    	<div id="newFiles" style='display:inline-block;position: relative;left: 85px;'>
		    		  <div id="f" style='width: 270px;
									height: 30px;
									border: 1px solid #b0b0b0;
									display: inline-block;
									position: relative;
									top: -2px;font-size: 15px;padding-top: 5px;' >
		    		  </div>
				</div>
			</div>
			
			<div class="poplist2">
				<label style="font-size: 16px">输入名称：</label>
				<input name="headname" id="headname" style="line-height: 30px;font-size: 16px;width: 270px;" placeholder="请输入图片名称...">
			</div>
			
			
			<div style='border-top:1px solid #b0b0b0;
								position: relative;
								padding-top:10px;
								text-align: right;
								margin-top: 15px;'>
				<button  class="btn add"  type="button" id="button" style="display: block">上   传</button>
			</div>
		</div>
		
		<div id='code_chart_view'>
	  	  <div id="codeView">
		  	  <div class="tool_code">
			  	<button id="alert">刷新</button>
			  </div>
			  <textarea id="code" name="code"></textarea>
		  </div>
	
		 <div id="chartView">
		 	<div class="tool_code">
		 		<button id="showImage">显示图像</button>
			  	<button id="getData">数据视图</button>
			  	<button id="huatu">重置</button>
			  </div>
		 	<div id="chart"></div>
		 </div>
		  
	  </div>
		
		  <script src="<%=path%>/resources/js/d3.v2.js"></script>
		  <script src="<%=path%>/resources/js/jsCodeFormat/jsonFormat.js"></script>
		  <script src="<%=path%>/resources/js/jsCodeFormat/codeLineFormat.js"></script>
		  <script type="text/javascript" src="<%=path%>/resources/js/easydialog/easydialog.min.js"></script>
		  <script type="text/javascript" src="<%=path%>/network/network.js"></script>
		
		<script type="text/javascript">
			var spath="<%=path%>";
			var pop_string = "";

			$(document).ready(function(){
				pop_string = $("#pop_image_up").html();
				$("#pop_image_up").html("").remove();
			});

		  $(document).ready(function(){
				$("#getData").click(function(){
					var nl = getNodeAndLink();
					$("#code").text("option = "+JsonUti.convertToString(nl));
					//$("#code").text("option = "+nl.toJSONString());
					cvtToCode();

					//切换视图
					$("#codeView").css("z-index","1");
					$("#chartView").css("z-index","-1");
				});

				$("#showImage").click(function(){
					if($(this).text()=="显示图像"){
						image_show_flag = true;//显示图像
						$(this).text("隐藏图像");
					}
					else{
						image_show_flag = false;//不显示图像
						$(this).text("显示图像");
					}
					redraw();
				});

				$("#alert").click(function(){
					var newdata = getCodeData();
					multiDraw(newdata);
					//切换视图
					$("#codeView").css("z-index","-1");
					$("#chartView").css("z-index","1");
				});

				$("#huatu").click(function(){
					var friend_net_origin = {
					  		"nodes":[
					           { "name" : "待命名","special":"false","r":16,"color":"1","catagory":"默认","headImg":"headImg.png"}],
					         "edges":[]};
					drawNetwork(friend_net_origin);
				});
				
			});
			
			//send();
		</script>
 </body>
</html>
