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
		
		.easyDialog_wrapper .btn_highlight, .easyDialog_wrapper .btn_normal{
			margin-bottom: 0px;
		}
		.easyDialog_wrapper .easyDialog_footer {
			padding: 10px 10px;
			border-top: 1px solid #b0b0b0;
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
		
		<button id="pop_window">上传图片</button>
		
		
		<script type="text/javascript">
			var spath="<%=path%>";
			var pop_string = "";

			$(document).ready(function(){
				pop_string = $("#pop_image_up").html();
				$("#pop_image_up").html("").remove();

				$("#pop_window").click(function(){
					var ss = easyDialog.open({
						  container : {
							    header : '上传图片',
							    content : pop_string
							  },
						  fixed : false,
					});
					send();
				});
			});

			var callbackF = function(filename){
				alert(filename);
			}
			
			//send();
		</script>
 </body>
</html>
