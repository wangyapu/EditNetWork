//数据
  var friend_net_origin = {
	  		"nodes":[
			     { "name" : "待命名","special":"false","r":16,"color":"1","catagory":"默认","headImg":"headImg.png"}],
			"edges":[]};
  
    //是否为第一次画图
    var firstDraw = true;
    
    //是否需要显示头像
    var image_show_flag = false;

	var input_name = false;//是否启用编辑姓名
	var input_image = false;//是否启用上传照片
	var input_circle = false;//是否启用图形编辑；
	var input_line = false;//是否启用线条编辑
	var input_image = false;//是否启用图片编辑
	var edit_node = null;//当前编辑的对象
	var edit_link = null;//当前编辑的线条

	var emp_circle = false;//处于强调状态
	
	var content_html = "<div> "+
					    "	<label>当前名称：</label> "+
						"		<input id='filename_before' type='text' style='width:250px' value='未命名' disabled='true'> "+
					    "</div> "+
					    "<div> "+
					    "	<label>修改名称：</label> "+
						"		<input id='filename_after' type='text' style='width:250px' placeholder='请输入名称...'> "+
					    "</div>";
	var content_html_link = "<div> "+
					    "	<label>当前宽度：</label> "+
						"		<input id='linkweight_before' type='text' style='width:250px' value='16' disabled='true'> "+
					    "</div> "+
					    "<div> "+
					    "	<label>修改宽度：</label> "+
						"		<input id='linkweight_after' type='text' style='width:250px' placeholder='请输入宽度...'> "+
					    "</div>";
	var content_html_circle = "<div> "+
					    "	<label>当前半径：</label> "+
						"		<input id='circle_r_before' type='text' style='width:250px' value='16' disabled='true'> "+
					    "</div> "+
					    "<div> "+
					    "	<label>修改半径：</label> "+
						"		<input id='circle_r_after' type='text' style='width:250px' placeholder='请输入半径...'> "+
					    "</div>"+
					    "<div> "+
					    "	<label>原始分类：</label> "+
						"		<input id='color_before' type='text' style='width:250px' value='16' disabled='true'> "+
					    "</div>"+
					    "<div> "+
					    "	<label>修改分类：</label> "+
						"		<input id='color_after' type='text' style='width:250px' placeholder='请输入新分类...'> "+
					    "</div>";
  
  var width = 1000,
      height = 470,
      color = d3.scale.category10();

  // mouse event vars
  var selected_node = null,
      selected_link = null,
      mousedown_link = null,
      mousedown_node = null,
      mouseup_node = null;
  
  var dblclick_node = null;
  
  var outer = null;
  var vis = null;
  var force = null;
  var drag_line = null;
  
//get layout properties
  var nodes = null,
      links = null,
      node = null,
      link = null;
  
  var clustertype = [];
  
  var drawNetwork = function(friend_net){
	  d3.select("#panel_net").remove();

	// init svg
	  outer = d3.select("#chart")
	      .append("svg:svg").attr("id","panel_net")
	      .attr("width", width)
	      .attr("height", height)
	      .attr("pointer-events", "all");

	  vis = outer
	      .append('svg:g')
	      .attr("class","content_net")
	      .call(d3.behavior.zoom().on("zoom", rescale))
	      .on("dblclick.zoom", null)
	      .append('svg:g')
	      .on("mousemove", mousemove)
	      .on("mousedown", mousedown)
	      .on("mouseup", mouseup);

	  vis.append('svg:rect')
	      .attr('width', width)
	      .attr('height', height)
	      .attr('fill', 'white');
	  
	  //先对friend_net的颜色值进行重新定义
	  for(var i=0;i<friend_net.nodes.length;i++){
		  friend_net.nodes[i].color = hashCode(friend_net.nodes[i].catagory);
	  }

	  // init force layout
	  force = d3.layout.force()
	      .size([width, height])
	      .charge(-200)
		  .linkDistance(150)
	      .nodes(friend_net.nodes)
	      .links(friend_net.edges)
	      .on("tick", tick);


	  // line displayed when dragging new nodes
	  drag_line = vis.append("line")
	      .attr("class", "drag_line")
	      .attr("x1", 0)
	      .attr("y1", 0)
	      .attr("x2", 0)
	      .attr("y2", 0);

	  // get layout properties
	  nodes = force.nodes();
	  links = force.links();
	  node = vis.selectAll(".node_group");
	  link = vis.selectAll(".link");

	  console.log(nodes);
	  console.log(links);
	  
	  // add keyboard callback
	  d3.select(window).on("keydown", keydown);

	  redraw();

	  // focus on svg
	  // vis.node().focus();
  }
  
  var multiDraw = function(friend_net){
	  //force.stop();
	  force = null;
	  
	  //先对friend_net的颜色值进行重新定义
	  for(var i=0;i<friend_net.nodes.length;i++){
		  friend_net.nodes[i].color = hashCode(friend_net.nodes[i].catagory);
	  }
	  
	  force = d3.layout.force()
		      .size([width, height])
		      .charge(-200)
			  .linkDistance(150)
		      .nodes(friend_net.nodes)
		      .links(friend_net.edges)
		      .on("tick", tick);
	  //force.nodes(friend_net.nodes);
	  //force.links(friend_net.edges);
	  nodes = force.nodes();
	  links = force.links();
	  
	  //links.splice(0, 2);
	  
	  console.log(friend_net.nodes);
	  console.log(friend_net.edges);
	  
	  //console.log(nodes);
	  //console.log(links);
	  redraw();
  }
  
  function mousedown() {
	    if (!mousedown_node && !mousedown_link) {
	      // allow panning if nothing is selected
	      vis.call(d3.behavior.zoom().on("zoom"), rescale);
	      return;
	    }
	  }

	  function mousemove() {
	    if (!mousedown_node) return;

	    // update drag line
	    drag_line
	        .attr("x1", mousedown_node.x)
	        .attr("y1", mousedown_node.y)
	        .attr("x2", d3.svg.mouse(this)[0])
	        .attr("y2", d3.svg.mouse(this)[1]);

	  }

	  function mouseup() {
	    if (mousedown_node) {
	      // hide drag line
	      drag_line.attr("class", "drag_line_hidden")

	      if (!mouseup_node) {
	        // add node
	        var point = d3.mouse(this);
	        //console.log(point);
	        var node = {"x": point[0], "y": point[1], "r":16, "color":hashCode("默认"), "name":"待命名", "special":"false","catagory":"默认","headImg":"headImg.png"};
	        var n = nodes.push(node);

	        // select new node
	        selected_node = node;
	        selected_link = null;
	        
	        // add link to mousedown node
	        //console.log({source: mousedown_node, target: node});
	        links.push({source: mousedown_node, target: node, weight:3});
	      }

	      redraw();
	    }
	    // clear mouse event vars
	    resetMouseVars();
	  }

	  function resetMouseVars() {
	    mousedown_node = null;
	    mouseup_node = null;
	    mousedown_link = null;
	  }

	  function tick() {
	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    //node.attr("cx", function(d) { return d.x; })
	    //    .attr("cy", function(d) { return d.y; });
	    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	  }

	  // rescale g
	  function rescale() {
	    trans=d3.event.translate;
	    scale=d3.event.scale;

	    vis.attr("transform",
	        "translate(" + trans + ")"
	        + " scale(" + scale + ")");
	  }

	  // redraw force layout
	  function redraw() {
		
	    //先画出图例
	    clustertype = [];
		for(var i = 0,len = nodes.length;i < len;i++){ 
			! RegExp(nodes[i]["catagory"],"g").test(clustertype.join(",")) && (clustertype.push(nodes[i]["catagory"])); 
		}
		console.log(clustertype);
		//clustertype.sort();
		for(var i=0,len=clustertype.length;i<len;i++){
			clustertype[i] = {"catagory":clustertype[i],"color":hashCode(clustertype[i])};
		}
		console.log(clustertype);
		
		//对图例数据进行前期处理
		
		//画出图例
		var legend_all = outer.selectAll("g.legend").data(clustertype);
		var legend = legend_all.enter().append("g")
		  .attr("class","legend")
		  .style("pointer-events","all")
  		  .style("cursor","pointer")
  		  .attr("transform", function(d, i) { return "translate("+25+"," + (25+i*35) + ")"; })
  		  .on("click",function(){
		      var cl = $($(d3.event.target)[0]).attr("class");
		      cl = cl.replace("_label","").replace("legend_text ","").replace("legend_rect ","");
		      c2 = cl.replace("class_",""); 
		      var col = $("#"+cl).attr("fill");
		      //alert(cl);
		      //改动links线条
		      d3.selectAll(".link")
		        .style("stroke-opacity",function(d){
		        	if(col=="gray"){
		        		if(d.source.color==c2 || d.target.color==c2){
    		        		return 1;
    		        	}
		        	}
		        	else{
		        		if(d.source.color==c2 || d.target.color==c2){
    		        		return 0;
    		        	}
		        	}
		        	
		        });
		      
		      d3.selectAll(".node_group")
		        .style("opacity",function(d){
		        	if(col=="gray"){
		        		if(d.color==c2){
    		        		return 1;
    		        	}
		        	}
		        	else{
		        		if(d.color==c2){
    		        		return 0;
    		        	}
		        	}
		        });

		      if(col=="gray"){
				 d3.select("#"+cl).attr("fill",function(d){return color(d.color)});
			  }
		      else{
		    	  d3.select("#"+cl).attr("fill","gray");
			  }
		      d3.select("#"+cl).style("fill-opacity","1");
	          
		  });
			  
		  legend.append("svg:circle") 
			    .attr("id", function(d){return "class_"+d.color})
		  		.attr("class", function(d){return "legend_rect class_"+d.color})
		  		.attr("cx",12)
		  		.attr("cy",12)
		  		.attr('r', 8)
		    	//.attr('height', 20)
		  		.attr("fill", function(d){return color(d.color)})
			  
		  legend.append("svg:text")
		  		.attr("x",25)
		  		.attr("y",18)
				.attr("class", function(d){return "legend_text class_"+d.color+"_label"})
				.text(function(d) { return d.catagory.trim(); });
		  
		  legend_all.exit().remove();
		  
		  //刷新legend视图
		  d3.selectAll(".legend").select(".legend_rect")
		  	.attr("id", function(d){return "class_"+d.color})
	  		.attr("class", function(d){return "legend_rect class_"+d.color})
	  		.attr("fill", function(d){return color(d.color)});
		  d3.selectAll(".legend").select(".legend_text")
		  	.attr("class", function(d){return "legend_text class_"+d.color+"_label"})
			.text(function(d) { return d.catagory.trim(); });
		  
		  
	    link = link.data(links);
	    
	    link.enter().insert("line", ".node_group")
	        .attr("class", function(d){return "link classs_"+d.source.color+"_"+d.target.color})
	        .attr("stroke-width",function(d) {
					//return Math.sqrt(d.weight+1); 
	        	return d.weight; 
		     })
	        .on("mousedown", 
	          function(d) { 
	             mousedown_link = d;
	             if (mousedown_link == selected_link) selected_link = null;
	             else selected_link = mousedown_link; 
	             selected_node = null; 
	             redraw(); 
	          })
	        .on("dblclick",function(d){
	        	edit_link = d;
				var ss = easyDialog.open({
					  container : {
						    header : '修改宽度',
						    content : content_html_link,
						    noFn : bt_no,
						    yesFn : btnFn_crop_link
						  },
					  fixed : false,
				});
				$("#linkweight_before").val(d.weight);
				$("#easyDialogYesBtn").text("修改");
	        });

	    //确定按钮的点击回调事件
	    var btnFn_crop_link = function(){
	    	var linkweight_before = $("#linkweight_before").val();
	        var linkweight_after = $("#linkweight_after").val();
	        if(edit_link!=null && edit_link!=undefined){
	        	links.forEach(function(d){
	    			if(d==edit_link){
	    			//if(d.name==filename_before){
	    				d.weight = linkweight_after;
	    			}
	            });
	        	redraw();
	        }
	    	return true;
	    };

	    link.exit().remove();

	    //对重新绑定的数据进行绘制
	    link.attr("class", function(d){return "link classs_"+d.source.color+"_"+d.target.color})
	    	.attr("stroke-width",function(d) { 
		        if(d.weight!=undefined){
		        	return d.weight;
		        }
	      })
	     .style("stroke-opacity",function(d){
			if(d._stroke_opacity!=undefined && d._stroke_opacity!=null){
				return 0.1;
			}
			else{
				return 1;
			}
	     });

	    link.classed("link_selected", function(d) { return d === selected_link; });

	    node = node.data(nodes);

	    var node_group = node.enter()
			.insert("g","node_group")
			.attr("class",function(d){return "node_group classs_"+d.color})
			.on("mousedown", 
		          function(d) {
		            // disable zoom
		            vis.call(d3.behavior.zoom().on("zoom"), null);
		
		            mousedown_node = d;
		            if (mousedown_node == selected_node) selected_node = null;
		            else selected_node = mousedown_node; 
		            selected_link = null; 
		
		            // reposition drag line
		            drag_line
		                .attr("class", "drag_line")
		                .attr("x1", mousedown_node.x)
		                .attr("y1", mousedown_node.y)
		                .attr("x2", mousedown_node.x)
		                .attr("y2", mousedown_node.y);
		
		            redraw(); 
		          })
		        .on("mousedrag",
		          function(d) {
		            // redraw();
		          })
		        .on("mouseup", 
		          function(d) { 
		            if (mousedown_node) {
		              mouseup_node = d; 
		              if (mouseup_node == mousedown_node) { resetMouseVars(); return; }
		
		              // add link
		              var link = {source: mousedown_node, target: mouseup_node};
		              links.push(link);
		
		              // select new link
		              selected_link = link;
		              selected_node = null;
		
		              // enable zoom
		              vis.call(d3.behavior.zoom().on("zoom"), rescale);
		              redraw();
		            } 
		          })
				.on("click",function(d){
					if(input_circle){//编辑图形
						alert("编辑图形");
					}
					else{//强调关系
						//alert("强调关系");
	
						//首先清楚原始信息
						links.forEach(function(p){
							p._stroke_opacity = undefined;
						});
						nodes.forEach(function(nq){
							nq._opacity = undefined;
						});
	
						//查看是否处于强调状态
						var flag = false;//默认非强调状态
						nodes.forEach(function(nq){
							if(nq._emp_circle!=undefined && nq._emp_circle!=null){
								flag = true;
							}
						});
						if(!flag){
							d._emp_circle = "emp";
							links.forEach(function(p){
								if(p.source!=d && p.target!=d){
									p._stroke_opacity = 0.1;
									nodes.forEach(function(nq){
										if(p.source==nq || p.target==nq){
											nq._opacity = 0.1;
										}
									});
								}
							});
							links.forEach(function(p){
								if(p._stroke_opacity==undefined || p._stroke_opacity==null){
									nodes.forEach(function(nq){
										if(p.source==nq || p.target==nq){
											nq._opacity = null;
										}
									});
								}
							});
						}
						else{
							nodes.forEach(function(nq){
								nq._emp_circle = null;
							});
						}
	
						redraw();
					}
		        });

	    d3.selectAll(".node_group")
	    	.attr("class",function(d){return "node_group classs_"+d.color})
	    	.style("opacity",function(d){
			if(d._opacity!=undefined && d._opacity!=null){
				return 0.1;
			}
			else{
				return 1;
			}
	     });
	    
	    node_group.insert("circle")
	        .attr("class", "node")
	        .style("fill", function(d) {
	            if(!d._color) d._color = color(d.color);
	            return d._color;
			 })
			 .on("dblclick",function(d){
		        	edit_node = d;
					var ss = easyDialog.open({
						  container : {
							    header : '修改半径和分类',
							    content : content_html_circle,
							    noFn : bt_no,
							    yesFn : btnFn_crop_circle
							  },
						  fixed : false,
					});
					$("#circle_r_before").val(d.r);
					$("#color_before").val(d.catagory);
					$("#easyDialogYesBtn").text("修改");
		     })
	        .transition()
	        .duration(750)
	        .ease("elastic")
	        .attr("r", function(d){return d.r;});

	    node.exit().transition().remove();

	    //确定按钮的点击回调事件
	    var btnFn_crop_circle = function(){
	    	var circle_r_before = $("#circle_r_before").val();
	        var circle_r_after = $("#circle_r_after").val();
	        var color_before = $("#color_before").val();
	        var color_after = $("#color_after").val();
	        if(edit_node!=null && edit_node!=undefined){
	        	nodes.forEach(function(d){
	    			if(d==edit_node){
	    			//if(d.name==filename_before){
	    				if(circle_r_after.trim()!="")d.r = parseFloat(circle_r_after);
	    				if(color_after.trim()!=""){
	    					d.catagory = color_after;
	    					//动态分配颜色值
	    					d.color = hashCode(color_after);
	    				}
	    				d._color = null;
	    			}
	            });
	        	redraw();
	        }
	    	return true;
	    };

	    //对重新绑定的数据进行绘制
	    //nodes = force.nodes();
	    //console.log(nodes);
	    d3.selectAll(".node_group").select(".node").attr("r", function(d){return d.r;})
			.style("fill", function(d) {
				if(!d._color) d._color = color(d.color);
				return d._color;
			});
	    

	    d3.selectAll(".node").classed("node_selected", function(d) { return d === selected_node; });

	    //********加入名字*****************************************************************************************************
	    node_group.append("svg:text")
			.attr("class","node_name")
			.text(function(d) { return d.name })
			.attr("dx",function(d){return d.r+5})
			.attr("dy",function(d){return d.r/2})
			.on("dblclick",function(d){
				edit_node = d;
				var ss = easyDialog.open({
					  container : {
						    header : '修改节点名称',
						    content : content_html,
						    noFn : bt_no,
						    yesFn : btnFn_crop
						  },
					  fixed : false,
				});
				$("#filename_before").val(d.name);
				$("#easyDialogYesBtn").text("修改");
    	  });
		  
	    //对重新绑定的数据进行绘制
	    //nodes = force.nodes();
	    //console.log(nodes);
	    d3.selectAll(".node_group").select(".node_name")
		   .text(function(d){return d.name;})
		   .attr("dx",function(d){return d.r+5})
		   .attr("dy",function(d){return d.r/2});
		  
	  //取消按钮的点击回调事件
	    var bt_no = function(){
	    	return true;
	    };

	    //确定按钮的点击回调事件
	    var btnFn_crop = function(){
	    	var filename_before = $("#filename_before").val();
	        var filename_after = $("#filename_after").val();
	        if(edit_node!=null && edit_node!=undefined){
	        	nodes.forEach(function(d){
	    			if(d==edit_node){
	    			//if(d.name==filename_before){
	    				d.name = filename_after;
	    			}
	            });
	        	redraw();
	        }
	    	return true;
	    };

	    //********加入图片*****************************************************************************************************
	    node_group.append("svg:image")
			.attr("class","node_images")
		    .attr("xlink:href", function(d){
		    	if(d.headImg!="headImg.png"){
		    		return spath+"/resources/headimg/"+d.headImg;
		    	}
		    	else{
		    		return spath+"/resources/headimg/"+d.name+".jpg";
		    	}
		    })
		    .attr("x", function(d){
				return -(1/Math.sqrt(2))*d.r;
			 })
		    .attr("y",  function(d){
				return -(1/Math.sqrt(2))*d.r;
			 })
		    .attr("width", function(d){
		    	if(image_show_flag==true){
		    		return Math.sqrt(2)*d.r;
				}
				else{
					return 0;
				}
			})
		    .attr("height", function(d){
		    	if(image_show_flag==true){
		    		return Math.sqrt(2)*d.r;
				}
				else{
					return 0;
				}
			}).on("dblclick",function(d){
				dblclick_node = d;
				var ss = easyDialog.open({
					  container : {
						    header : '上传图片',
						    content : pop_string
						  },
					  fixed : false,
				});
				send();
    	    });
		   // .attr("pointer-events", "all");

	  //对重新绑定的数据进行绘制
	    d3.selectAll(".node_group").select(".node_images")
		   .attr("xlink:href", function(d){
			   if(d.headImg!="headImg.png"){
		    		return spath+"/resources/headimg/"+d.headImg;
		    	}
		    	else{
		    		return spath+"/resources/headimg/"+d.name+".jpg";
		    	}
		    })
		    .attr("x", function(d){
				return -(1/Math.sqrt(2))*d.r;
			 })
		    .attr("y",  function(d){
				return -(1/Math.sqrt(2))*d.r;
			 })
		    .attr("width", function(d){
		    	if(image_show_flag==true){
		    		return Math.sqrt(2)*d.r;
				}
				else{
					return 0;
				}
			})
		    .attr("height", function(d){
		    	if(image_show_flag==true){
		    		return Math.sqrt(2)*d.r;
				}
				else{
					return 0;
				}
			}).on("dblclick",function(d){
				dblclick_node = d;
				var ss = easyDialog.open({
					  container : {
						    header : '上传图片',
						    content : pop_string
						  },
					  fixed : false,
				});
				send();
			});

	    if (d3.event) {
	      // prevent browser's default behavior
	      d3.event.preventDefault();
	    }

	    force.start();
	    
	    if(firstDraw){
	    	inputToCodeArea();
	    	firstDraw = false;
	    }

	  }

	  function spliceLinksForNode(node) {
	    toSplice = links.filter(
	      function(l) { 
	        return (l.source === node) || (l.target === node); });
	    toSplice.map(
	      function(l) {
	        links.splice(links.indexOf(l), 1); });
	  }

	  function keydown() {
	    if (!selected_node && !selected_link) return;
	    switch (d3.event.keyCode) {
	      case 8: // backspace
	      case 46: { // delete
	        if (selected_node) {
	          nodes.splice(nodes.indexOf(selected_node), 1);
	          spliceLinksForNode(selected_node);
	        }
	        else if (selected_link) {
	          links.splice(links.indexOf(selected_link), 1);
	        }
	        selected_link = null;
	        selected_node = null;
	        redraw();
	        break;
	      }
	    }
	  }

	function getNodeAndLink(){
		var node_link = {};
		node_link.nodes = [];
		node_link.edges = [];
		console.log(nodes);
		console.log(links);
		var obj = {};
		for(var i=0;i<nodes.length;i++){
			obj = {};
			obj.name = nodes[i].name;
			obj.special = nodes[i].special;
			obj.r = nodes[i].r;
			obj.color = nodes[i].color;
			obj.catagory = nodes[i].catagory;
			obj.headImg = nodes[i].headImg;
			node_link.nodes[i] = obj;
		}
		for(var i=0;i<links.length;i++){
			obj = {};
			obj.source = links[i].source.index;
			obj.target = links[i].target.index;
			obj.weight = links[i].weight;
			node_link.edges[i] = obj;
		}
		return node_link;
	}
	
	//填充代码域
	var inputToCodeArea = function(){
		var nl = getNodeAndLink();
		$("#code").text("option = "+JsonUti.convertToString(nl));
		cvtToCode();
	}
	
	//哈希码
	function hashCode(str){
        var h = 0, off = 0;  
        var len = str.length;  
        for(var i = 0; i < len; i++){  
            h = 31 * h + str.charCodeAt(off++);  
        }  
	    var t=-2147483648*2;  
	    while(h>2147483647){  
	      h+=t  
	    }
        return h;  
	    //return str; 
    } 
	
	//上传头像
	var callbackF = function(filename){
		nodes.forEach(function(p){
			if(p==dblclick_node){
				p.headImg = filename;
			}
		});
		redraw();
	}
	
		
