/*Button widget*/
Nedil.Widget.button = function(el,prop) {
	var obj = new Nedil.Objs([el]);
	obj.css("active button_N text_def_N unselect");
	var sel = this;
	obj.on("mouseover", function() { if(sel.enabled) obj.css("hover") } );
	obj.on("mouseout", function() { if(sel.enabled) obj.css("-hover") } );               
	obj.on("mousedown", function() { if(sel.enabled) obj.css("pressed") } );
	obj.on("mouseup", function() { if(sel.enabled) obj.css("-pressed") } );
	this.enabled = true;
	var tex = obj.text();
	obj.text("");
	var t;
	var i;

	var setText = function() {
		t = obj.addChild("span"); 
		if(prop && prop.text) {
			t.text(prop.text);
			obj.element().value=prop.text;
		} else {
			t.text(tex);
			obj.element().value = tex;
		}
	}

	var setIcon = function() {
		if(prop.icon) {                   
			ic = obj.addChild("img",{src: prop.icon.src, align:"middle"});                                          
			if(prop.icon.wid) {
				ic.element().setAttribute("width",prop.icon.wid);
			}
			if(prop.icon.ht) {
				ic.element().setAttribute("height",prop.icon.ht);
			}                     
		}
	}   
	
	if(prop) {
		if(prop.dim) {
			obj.dim(prop.dim);
		}	
		if(prop.enabled == false) {
			this.enabled = false;
			obj.css("disabled");
		}

		var re = prop.icon ? (prop.icon.pos ? prop.icon.pos : "left") : false;
		if(re) {
			if(re == "right" || re == "bottom") { 
				setText(); setIcon(); 
			} else { 
				setIcon(); 
				setText();
			}

			if(re == "top" || re == "bottom") {
				t.style("display","block");
			}
		} else {
			setText();
		}
		
		if(prop.event) {
			for(var ev in prop.event) {
				var list = function() {if(sel.enabled) { prop.event[ev](); }};
				obj.on(ev,list);                     
			}
		}                  
	}  else {
		setText();
	}

	this.enable = function() {
		obj.css("-disabled");
		this.enabled = true;
	}

	this.disable = function() {
		this.enabled = false;
		obj.css("disabled");
	}

	return this;
}

/*Checkbox widget*/
Nedil.Widget.checkbox = function(el,prop,layout) {
	var obj = new Nedil.Objs([el]);
	obj.html("");
	obj.style("display","inline-block");
	layout = layout ? (layout=="vertical" ? "block" : "inline-block") : "block";
	
	var changeStyle = function(ch,b,sty) {
		if(ch.enabled) { 
			b.css(sty); 
		}
	}

	var factory = function(ch,sty) {
		return function() {
			if(ch.enabled) { 
				changeStyle(ch,ch.b,sty);
			}
		}
	}

	var clicked = function(ch,sty) {     
		return function() {
			if(ch.enabled) { 
				if(ch.cb.element().checked) {
					ch.cb.element().checked = false;
					changeStyle(ch,ch.b,"-checkbox_N_selected");
				} else {
					changeStyle(ch,ch.b,sty);
					ch.cb.element().checked = true;
				}
			}
		}
	}

	this.chklist = [];
	
	for(var i=0,len = prop.length; i<len; i++) {
		var chkbox = prop[i];
		var ch = obj.addChild("span", {"class" : "unselect"}) ;
		ch.enabled = chkbox.enabled == null ? true : chkbox.enabled;
		ch.css({
			"display" : layout,
			"margin" : "5px"
		});
		var cbprop = { type: "checkbox", style : "display:none", name : chkbox["name"], value : (chkbox["value"] ? chkbox["value"] : "on")};
		if(chkbox.id) {
			cbprop["id"] = chkbox.id;
		}
		
		ch.cb = ch.addChild("input",cbprop);      
		ch.b = ch.addChild("span",{"class" : "active checkbox_N"});
		ch.t = ch.addChild("span",{"id" : "box", "class" : "text_def_N checkbox_text_N"});
		
		if(!ch.enabled) {
			ch.b.css("disabled disabled_text");
			ch.t.css("disabled_text");
		}
		
		ch.t.text(chkbox["text"] ? chkbox["text"]  : "");
		ch.on("mouseover", factory(ch, "hover") );
		ch.on("mouseout", factory(ch, "-hover") );               
		ch.on("mousedown", factory(ch, "pressed") );
		ch.on("mouseup", factory(ch, "-pressed") );
		ch.on("click", clicked(ch, "checkbox_N_selected") );
	
	if(chkbox.select) {
		var t = ch.enabled;
		ch.enabled = true;
		ch.trigger("click");
		ch.enabled = t;
	}
	
		this.chklist.push(ch);
	}

	this.enable = function(pos) {
		this.chklist[pos].enabled = true;
		this.chklist[pos].b.css("-disabled -disabled_text");
		this.chklist[pos].t.css("-disabled_text");            
	}

	this.disable = function(pos) {
		this.chklist[pos].enabled = false;
		this.chklist[pos].b.css("disabled disabled_text");
		this.chklist[pos].t.css("disabled_text");          
	}

	this.select = function(pos) {
		this.chklist[pos].trigger("click");
	}

	return this;
}

/*Radio button widget*/
Nedil.Widget.radio = function(el,prop,layout) {
	var obj = new Nedil.Objs([el]);
	obj.html("");
	obj.style("display","inline-block");
	layout = layout ? (layout=="vertical" ? "block" : "inline-block") : "block";
	var changeStyle = function(ch,b,sty) {
		b.css(sty); 
	}

	var factory = function(ch,sty) {
		return function() {
			if(ch.enabled) { 
				changeStyle(ch,ch.b,sty);
			}
		}
	}

	var clicked = function(list, ch) {     
		return function() {
			if(ch.enabled) {
				ch.cb.element().checked = true;
			}
			for(var i=0, len = list.length; i<len; i++) {
				if(list[i].cb.element().checked) {
					changeStyle(list[i],list[i].b,"radio_N_selected");
				} else {
					changeStyle(list[i],list[i].b,"-radio_N_selected");
				}
			}         
		}
	}

	this.chklist = [];
	for(var i=0,len = prop.length; i<len; i++) {
		var chkbox = prop[i];
		var ch = obj.addChild("span", {"class" : "unselect"});
		ch.enabled = chkbox.enabled == null ? true : chkbox.enabled;
		ch.css({
			"display" : layout,
			"margin" : "5px"
		});
		var cbprop = { type: "radio", style : "display:none", name : chkbox["name"], value : (chkbox["value"] ? chkbox["value"] : "on")};
		if(chkbox.id) {
			cbprop["id"] = chkbox.id;
		}
		ch.cb = ch.addChild("input",cbprop);
		ch.b = ch.addChild("span",{"class" : "active radio_N"});
		ch.t = ch.addChild("span",{ "id" : "box", "class": "text_def_N checkbox_text_N"});
		if(!ch.enabled) {
			ch.b.css("disabled disabled_text");
			ch.t.css("disabled_text");
		}
		ch.t.text(chkbox["text"] ? chkbox["text"]  : "");
		ch.on("mouseover", factory(ch, "radio_N_hover") );
		ch.on("mouseout", factory(ch, "-radio_N_hover") );               
		ch.on("mousedown", factory(ch, "pressed") );
		ch.on("mouseup", factory(ch, "-pressed") );
		ch.on("click", clicked(this.chklist, ch) );
		this.chklist.push(ch);         
		if(chkbox.select) {
			var t = ch.enabled;
			ch.enabled = true;
			ch.trigger("click");
			ch.enabled = t;
		}
	}

	this.enable = function(pos) {
		this.chklist[pos].enabled = true;
		this.chklist[pos].b.css("-disabled -disabled_text");
		this.chklist[pos].t.css("-disabled_text");            
	}

	this.disable = function(pos) {
		this.chklist[pos].enabled = false;
		this.chklist[pos].b.css("disabled disabled_text");
		this.chklist[pos].t.css("disabled_text");          
	}

	this.select = function(pos) {
		this.chklist[pos].trigger("click");
	}

	return this;
}

/*Textbox widget*/
Nedil.Widget.textbox = function(el,prop) {
	var obj = new Nedil.Objs([el]);
	obj.css("active text_def_N textbox_N");
	var sel = this;
	var limitString = function(str, limit) {
		if(limit) {
			return str.substr(0,limit);
		}
		return str;
	}

	var errorAlert = function(obj) {
		obj.animate({
			from : "#f00", 	  
			to :  "#52A3CC", 	  
			anim : "Color.quad", 
			duration : 500, 
			prop : "border-color",
			oncomplete : function() {
				if(obj.element().style.removeProperty) {
					obj.element().style.removeProperty("border-color");
				} else {
					obj.element().style.borderColor = "";
				}
			}
		});
	}   

	var valid = {
		"email" : "^[0-9a-zA-Z\\._]+$|^[0-9a-zA-Z\\._]+\\@$|^[A-Z0-9a-z\\._%+-]+\\@[A-Za-z0-9.-]+$|^[A-Z0-9a-z\\._%+-]+\\@[A-Za-z0-9.-]+\\.[A-Za-z]+$",
		"alpha" : "^[A-Za-z\\s]+$",
		"numeric" : "^[0-9\\s]+$",
		"alphanumeric" : "^[A-Za-z0-9\\s]+$",
		"decimal" : "^[0-9]+$|^[0-9]+\\.[0-9]+$|^\\.[0-9]+$|^[0-9]+\\.$|^\\.$"
	}

	obj.on("focus", function() {
		if(sel.enabled) {
			obj.css("textbox_N_focussed");
			if(obj.element().value.trim() == sel.watermark) {
				obj.element().value = "";
				obj.css("-textbox_N_watermark");
			}
			obj.css("-error_N");         
		} 
	});
	
	obj.on("blur", function() {
		if(sel.enabled) {
			obj.css("-textbox_N_focussed")
				if(obj.element().value.trim() == "") {
					obj.element().value = sel.watermark ? sel.watermark : "";
					obj.css("textbox_N_watermark");
				} else {
					if(sel.validation == "email") {
						var reg = new RegExp("^[A-Z0-9a-z\\._%+-]+\\@[A-Za-z0-9.-]+\\.[A-Za-z]+$","g");
						if(!obj.element().value.match(reg)) {
							obj.css("error_N");
						}
					}
				}
		}
	});
	
	obj.on("keypress", function() {
		var elem = obj.element();
		var pos = obj.selection();
		if(!sel.enabled){
			return false;
		} else {
			var res = true;
			var evt = Nedil.currentEvent;
			var code = evt.charCode;
			var text = elem.value;
			if(typeof code == "undefined") {
				code = evt.keyCode || evt.which;
			}
			if(code == 0) {
				return true; // for FF
			}
			if(code) {
				var newStr =  String.fromCharCode(code);
				if (!evt.ctrlKey && !evt.metaKey && !evt.altKey) {
					text = text.substr(0,pos.start) + newStr + text.substr(pos.end);
				}
				if(sel.limit && text.length > sel.limit) {
					res = false;
				}

			if(sel.validation && res) {
				var regStr = valid[sel.validation] ? valid[sel.validation] : sel.validation;
				var reg = new RegExp(regStr,"g");
				if(!text.match(reg)) {
					res = false;
				}
			}
			if(!res) errorAlert(obj);
			} else {
				res = false;
			}
			return res;         
		}
	});

	if(prop) {
		if(prop.dim) {
			obj.dim(prop.dim);
		}	

		this.limit = prop.limit ? prop.limit : false;
		if(!(prop.enabled == undefined)) {
			this.enabled = prop.enabled;
			if(!this.enabled) {
				obj.element().disabled = true;
				obj.css("disabled textbox_N_disabled unselect");
			}
		} else {
			this.enabled = true;
		}	
		if(prop.watermark) {
			obj.element().value = prop.watermark;
			this.watermark = prop.watermark;
			obj.css("textbox_N_watermark");         
		} else {
			this.watermark = false;
		}

		if(prop.text) {
			obj.element().value = limitString(prop.text, this.limit);
			obj.css("-textbox_N_watermark");  
		}
		if(prop.validation) {
			this.validation = prop.validation;
		}		
	} else {
		this.enabled = true;
		this.watermark = false;
		this.limit = false;
		this.validation = false;
	}

	this.enable = function() {
		obj.css("-disabled -textbox_N_disabled -unselect");
		obj.element().disabled = false;
		this.enabled = true;
	}

	this.disable = function() {
		this.enabled = false;
		obj.element().disabled = true;
		obj.css("disabled textbox_N_disabled unselect");
	}

	this.setText = function(str) {
		if(this.enabled) {
			obj.element().value = limitString(str, this.limit);
			obj.css("-textbox_N_watermark");
		}
	}

	this.getText = function() {
		return obj.element().value;
	}
	
	if(prop && typeof prop.value != "undefined") {
		this.setText(prop.value);
	}

	return this;
}

/*Panel widget*/
Nedil.Widget.panel = function(el,prop) {
	var obj = new Nedil.Objs([el]);
	
	//FOR SOME REASONS
	var immC;
	if(prop.exception) {
		 immC = obj;
	} else {
		//obj.style("display","inline-block");
		//immC = obj.wrapChildren("div", { "style" : "position:relative; margin:0px; width : 100%; height : 100%; background-color: red"});
		immC = obj;
	}
	//FOR SOME REASONS
	
	obj.css("active text_def_N panel_N");
	//obj.css("active text_def_N panel_N unselect");

	var sel = this;
	var rBar = 7;
	var rHand;
	sel.drag = true;
	sel.res = true;
	sel.pressed = false;
	sel.resPress = false;
	sel.curPos = {};
	if(prop) {	

		if(prop.layout) {
			if(prop.layout == "horizontal") {
				immC.css("panel_N_hor");
			} else {
				immC.css("-panel_N_hor");
			}
		}
		if(prop.nostyle) {
			obj.css("-active -text_def_N -panel_N");
		}
		
		if(prop.detach) {
			obj.style("position","absolute");
		}
		
		if(prop.dim) {
			obj.dim(prop.dim);
		}
		
		if(prop.draggable == "parent") {
			var pos = new Nedil.Objs([el.parentNode]).posAbs();
			var pardim = new Nedil.Objs([el.parentNode]).dim();	
			prop.dragRangeX = { "min" : pos.x, "max" : pos.x + pardim.wid};
			prop.dragRangeY = { "min" : pos.y, "max" : pos.y + pardim.ht};
			if(prop.maxSize) {
				prop.maxSize.wid = prop.maxSize.wid ? (prop.maxSize.wid > pardim.wid ? pardim.wid : prop.maxSize.wid) : pardim.wid;
				prop.maxSize.ht = prop.maxSize.ht ? (prop.maxSize.ht > pardim.ht ? pardim.ht : prop.maxSize.ht) : pardim.ht;
			} else  {
				prop.maxSize = pardim;
			}
		}	
		
		var defS = obj.dim();
		if(prop.minSize) {
			defS.wid = prop.minSize.wid ? (defS.wid < prop.minSize.wid ? prop.minSize.wid : defS.wid ): defS.wid;
			defS.ht = prop.minSize.ht ? (defS.ht < prop.minSize.ht ? prop.minSize.ht : defS.ht ): defS.ht;
		}
		if(prop.maxSize) {
			defS.wid = prop.maxSize.wid ? (defS.wid > prop.maxSize.wid ? prop.maxSize.wid : defS.wid ): defS.wid;
			defS.ht = prop.maxSize.ht ? (defS.ht > prop.maxSize.ht ? prop.maxSize.ht : defS.ht ): defS.ht;
		}
		obj.dim(defS);		

		if(prop.dragRangeX) {
			sel.Xmax = prop.dragRangeX.max ? prop.dragRangeX.max - obj.dim().wid : false;
		}		
		if(prop.dragRangeY) {
			sel.Ymax = prop.dragRangeY.max ? prop.dragRangeY.max - obj.dim().ht : false;
		}
		
		if(prop.pos) {
			obj.pos(prop.pos);
		}
		
		if(prop.draggable) {
			Nedil.get(document).on("mousemove", function() {
				if(sel.pressed && !sel.resPress && sel.drag) {
					if(prop.handle) {
						prop.handle.css("move");
					} else {
						obj.css("move");
					}
					var abs = obj.mouseAbs();
					if(abs.x > -1 && abs.y > -1) {
						abs.x -= sel.curPos.x;
						abs.y -= sel.curPos.y;
						if(prop.dragRangeX) {
							abs.x = prop.dragRangeX.min ? ( abs.x < prop.dragRangeX.min ? prop.dragRangeX.min : abs.x ) : abs.x;
							abs.x = sel.Xmax ? ( abs.x > sel.Xmax ? sel.Xmax : abs.x ) : abs.x;							
						}
						if(prop.dragRangeY) {
							abs.y = prop.dragRangeY.min ? ( abs.y < prop.dragRangeY.min ? prop.dragRangeY.min : abs.y ) : abs.y;
							abs.y = sel.Ymax ? ( abs.y > sel.Ymax ? sel.Ymax : abs.y ) : abs.y;							
						}
						if(prop.draggable === "x") {
							obj.posAbs({x: abs.x});
						} else if(prop.draggable === "y") {
							obj.posAbs({y: abs.y});
						} else {
							obj.posAbs(abs);
						}						
					} 
				}
			});		
		}
		
		if(prop.resizable) {
			rHand = obj.addChild("div", { "class" : "colorp_arrow", "style" : "position: absolute; margin : 0px"});
			rHand.pos({ x : obj.dim().wid - rBar*2, y : obj.dim().ht - rBar*2});
			rHand.pos({ x : obj.dim().wid - rBar*2, y : obj.dim().ht - rBar*2});
			//rHand.pos({ x : 93, y : 93});
			rHand.on("mousemove", function() {
				//obj.trigger("mousemove");
			});
			rHand.on("mousedown", function() {
				//obj.trigger("mousedown");
			});			
			Nedil.get(document).on("mousemove", function() {
				if(sel.res) {
					var ms = obj.mouse();
					var dim = obj.dim();
					if(typeof prop.resizable == "object") {

					} else {
					}
					if((dim.wid - ms.x < rBar*2) && (dim.ht - ms.y) < rBar*2) {
						obj.css("se-resize");
					} else {
						obj.css("-se-resize");
					}
					if(sel.resPress) {
						if(prop.minSize) {
							ms.x = prop.minSize.wid ? (ms.x < prop.minSize.wid ? prop.minSize.wid : ms.x ): ms.x;
							ms.y = prop.minSize.ht ? (ms.y < prop.minSize.ht ? prop.minSize.ht : ms.y ): ms.y;
						}
						if(prop.maxSize) {
							ms.x = prop.maxSize.wid ? (ms.x > prop.maxSize.wid ? prop.maxSize.wid : ms.x ): ms.x;
							ms.y = prop.maxSize.ht ? (ms.y > prop.maxSize.ht ? prop.maxSize.ht : ms.y ): ms.y;
						}
						obj.dim({ "wid" : ms.x , "ht" : ms.y});
						if(prop.resizable == "resize") {
							sel.setContentHeight();
						}
						rHand.pos({ x : ms.x - rBar*2, y : ms.y - rBar*2});
					}
				}
			});	
		}		
		
		obj.on("mousedown", function() {
			var cur = Nedil.self().element();
			if(prop.handle && prop.handle.element() == cur) {
				sel.pressed = true;
				sel.curPos = Nedil.self().mouse();
			}
			if(sel.element() == cur) {
				if(!prop.handle) {
					sel.pressed = true;
					sel.curPos = obj.mouse();
				}
			}
			if(prop.resizable) {
				var ms = obj.mouse();
				var dim = obj.dim();
				if((dim.wid - ms.x < rBar*2) && (dim.ht - ms.y) < rBar*2) {
					sel.resPress = true;
				}
			}			
			
		});
		
		Nedil.get(document).on("mouseup", function() {
			if(sel.pressed || sel.resPress) {
				if(prop.dragRangeX) {
					sel.Xmax = prop.dragRangeX.max ? prop.dragRangeX.max - obj.dim().wid : false;
				}		
				if(prop.dragRangeY) {
					sel.Ymax = prop.dragRangeY.max ? prop.dragRangeY.max - obj.dim().ht : false;
				}			
				sel.curPos = {};	
				if(prop.handle) {
					prop.handle.css("-move");
				} else {
					obj.css("-move");
				}	
			}
			sel.pressed = false;	
			sel.resPress = false;
		});		

		

	}

	var children = Nedil.Dom.getChildren(immC.element(), true);
	//children.css("+panel_N_child +panel_N_hor"); FOR SOME REASONS
	children.css("+panel_N_child +panel_child_mar");
	if(!prop.exception) {
		//immC.css("+panel_child_mar");
	}
	
	this.changeProperty = function(newProp) {
		for(var pr in newProp) {
			prop[pr] = newProp[pr];
		}
	}
	
	this.updatePanelDesign = function() {
	}
	
	this.toggleDrag = function() {
		this.drag = !this.drag;
	}
	
	this.toggleResize = function() {
		this.res = !this.res;
		if(rHand) {
			if(this.res) {
				rHand.css("-hide");
			} else {
				rHand.css("hide");
			}
		}
	}
	
	return this;
} 

/*Dialog widget*/
Nedil.Widget.dialog = function(el,prop) {
	if(prop.modal) {
		Nedil.get("body").element().appendChild(el);
	}
	var obj = Nedil.get(el);
	obj = obj.addParent("div");
	el = obj.element();
	var sel = obj;
	var selObj = this;
	sel.modal = prop.modal;
	sel.visible = true;
	if(sel.modal) {
		if(Nedil.get("#dialog_NedilModal").elems.length == 0) {
			var mod = Nedil.get("body").addChild("div",{id : "dialog_NedilModal"});
			mod.css("dialog_NedilModal_back");
		}
		obj.css("dialog_Modal");
	}
	sel.wrap = obj.wrapChildren("div",{"class" : "dialog_content"});
	sel.head = obj.addChild("div",0);
	
	selObj.max;	// true - maximized
	selObj.defSize = {}	// default size
	prop["handle"] = sel.head;
	prop.minSize = prop.minSize ? prop.minSize : { wid: 100, ht: 100 };	

	obj.css("dialog");		
	obj.posAbs(prop.pos);
	sel.head.text(prop.head ? (prop.head.title ? prop.head.title : ""): "");
	sel.head.css("dialog_head active unselect");
	obj.style("border-top-width","0px");
	
	prop.resizable = prop.resizable ? "resize" : false;
	prop.exception = true;
	Nedil.Widget.panel.apply(sel,[el, prop]);	
	
	var children = Nedil.Dom.getChildren(sel.wrap.element(), true);
	children.css("+panel_N_child +panel_child_mar");
	sel.setContentHeight = function() {
		var ob = selObj;
		sel.wrap.dim({ht: obj.dim().ht - sel.head.dim().ht});
	}
	
	sel.setContentHeight();
	
	if(prop.show == false) {
		sel.visible = false;
		obj.css("hide");
		if(sel.modal) {		
			Nedil.get("#dialog_NedilModal").css("hide");
		}
	}	
	
	var closeDial = function() {
		if(sel.visible) {
			if(sel.modal) {
				if(Nedil.get("#dialog_NedilModal").elems.length) {
					Nedil.get("#dialog_NedilModal").animate({
						from : 0.7,
						to : 0,
						anim : "CSS.smooth",
						prop : "opacity",
						duration : 200,
						oncomplete : function() {
							Nedil.self().css("hide");
						}
					});
					obj.css("-dialog_Modal");			
				}	
			}
			obj.animate({
				from : 1,
				to : 0,
				anim : "CSS.smooth",
				prop : "opacity",
				duration : 200,
				oncomplete : function() {
					obj.dim(prop.dim);
					obj.css("hide");
				}
			});
			sel.visible = false;
		}
		
	}
	
	var maxDial = function(force) {
		if((prop.maximize || force) && sel.visible) {
			var newDim = {};
			var newLoc = {};			
			if(selObj.max) {
				newDim = selObj.defSize;
				newLoc = selObj.defLoc;
				selObj.max = false;
			} else {
				if(prop.maximize == "parent" || force) {
					newDim = new Nedil.Objs([el.parentNode]).dim();
					newLoc = new Nedil.Objs([el.parentNode]).posAbs();
				} else if(prop.maximize == "document") {
					newDim = Nedil.get(document).dim();
					newLoc = Nedil.get("body").posAbs();
				} 
				selObj.defSize = obj.dim();
				selObj.defLoc = obj.posAbs();
				selObj.max = true;
			}
			obj.animate({
				to : newDim,
				anim : "Dimension.smooth",
				duration : 400, 
				onframe : function() {
					sel.setContentHeight();
				}
			});
			obj.animate({
				to : newLoc,
				anim : "Location.smooth",
				absolute : true,
				duration : 400
			});	
			sel.toggleDrag();
			sel.toggleResize();
		}
		
	}
	
	sel.maximize = function(force) {
		maxDial(force);
	}
	
	sel.close = function() {
		closeDial();
	}
	
	sel.show = function(forceMax) {
		if(!sel.visible) {
			sel.visible = true;
			if(sel.modal) {		
				var el = Nedil.get("#dialog_NedilModal");
				el.css("-hide");
				el.animate({
					from : 0,
					to : 0.7,
					anim : "CSS.smooth",
					prop : "opacity",
					duration : 200
				});
				obj.css("dialog_Modal");			
			}				
			obj.css("-hide");
			obj.pos(prop.pos);
			obj.animate({
				from : 0,
				to : 1,
				anim : "CSS.smooth",
				prop : "opacity",
				duration : 200,
				oncomplete :  function() {
					if(forceMax) {	
						sel.maximize(true);
					}
				}
			});	
		}
		if(Nedil.Widget.constants["dialog_active"]) {
			Nedil.Widget.constants["dialog_active"].css("-dialog_order");
		}

		Nedil.Widget.constants["dialog_active"] = obj;
		obj.css("dialog_order");		
	}
	
	if(prop.close) {
		var close = sel.head.addChild("div");
		Nedil.Widget.button(close.element(), {text: "&#10006;", event : { "click" : closeDial } });
		close.css("dialog_close");
		close.on("mouseover", function() { close.css("dialog_close_hover"); });
		close.on("mouseout", function() { close.css("-dialog_close_hover"); });
	}
		
	if(prop.maximize) {
		var max = sel.head.addChild("div");
		Nedil.Widget.button(max.element(), {text: "&#10065", event : { "click" : maxDial } });
		max.style("float","right");
	}
	
	obj.on("mousedown", function() {
		Nedil.Widget.constants["dialog_active"].css("-dialog_order");
		Nedil.Widget.constants["dialog_active"] = obj;
		obj.css("dialog_order");
	});		
		
	if(Nedil.Widget.constants["dialog_active"]) {
		Nedil.Widget.constants["dialog_active"].css("-dialog_order");
	}
	
	Nedil.Widget.constants["dialog_id"] = Nedil.Widget.constants["dialog_id"] ? (parseInt(Nedil.Widget.constants["dialog_id"]) + 1) : 1;
	Nedil.Widget.constants["dialog_active"] = obj;
	obj.css("dialog_order");
	
	return sel;

} 

/*Tabs widget*/
Nedil.Widget.tabs = function(el,prop) {
	var obj = new Nedil.Objs([el]);
	var sel = this;
	obj.wrap = obj.wrapChildren("div", {"class" : "tab_content"});
	var act = "";
	if(!prop.position || prop.position == "top" || prop.position == "left") {
		obj.head = obj.addChild("div",{"class" : "tab_head"},0);
		obj.wrap.css("tab_top");
		act = "tab_btn_top_active";
	} else {
		obj.head = obj.addChild("div",{"class" : "tab_head"});
		obj.wrap.css("tab_bottom");
		act = "tab_btn_bottom_active";
	}
	obj.childTabs = [];
	obj.childActive;
	prop.align = prop.align ? prop.align : "left";
	var ev = prop.trigger ? prop.trigger : "click";
	Nedil.Util.forEach(prop.tabs, function(tb) {
		var tabchild = Nedil.get(tb.id);
		if(!obj.isParent(tabchild.element())) {
			obj.wrap.appendChild(tabchild.element());			
		}
		var hbtn;
		if(!prop.position || prop.position == "top" || prop.position == "left") {
			hbtn = obj.head.addChild("span",{ "class" : "tab_head_button tab_btn_top", "text" : tb.title });
		} else if(prop.position == "bottom") {
			hbtn = obj.head.addChild("span",{ "class" : "tab_head_button tab_btn_bottom", "text" : tb.title });
		} else if(prop.position == "left") {	// TODO : for future
			//hbtn = obj.head.addChild("span",{ "class" : "tab_head_button tab_btn_top", "text" : tb.title });
			//obj.head.css("vertical_text_bottomtop");
		}
		
		hbtn.widget("button", {});
				
		tabchild.css("hide");
		obj.childTabs.push({"tab" : tabchild, "btn" : hbtn, "enable" : tb.enabled == false ? false : true, "close" : tb.close == true ? true : false});
		var id = obj.childTabs.length - 1;
		if(tb.close) {
			var cl = hbtn.addChild("span");
			cl.widget("button", { text: "&#10006;", event : { "click" : function() {
				sel.close(id);
			} } });
			cl.css("tab_head_button_close");
		}		
		hbtn.on(ev, function() {
			sel.show(id);
		});
		if(tb.enabled == false) {
			hbtn.css("disabled");
		} else {
			if(tb.def) {
				if(obj.childActive) {
					obj.childTabs[obj.childActive].tab.css("hide");
					obj.childTabs[obj.childActive].btn.css("-tab_head_button_active -" + act);
				}
				obj.childActive = id;			
				tabchild.css("-hide");
				hbtn.css("tab_head_button_active "+act);
			}
		}
	});

	if(prop.align) {
		obj.head.style("text-align",prop.align);
	}
	if(!obj.childActive) {
		obj.childTabs[0].tab.css("-hide");
		obj.childTabs[0].btn.css("tab_head_button_active "+act);
		obj.childActive = 0;
	}	
	
	this.show = function(id) {
		showTab(id);
	}
	
	this.close = function(id) {
		closeTab(id);
	}
	
	var showTab = function(id) {
		if(obj.childTabs[id].enable) {
			obj.childTabs[obj.childActive].tab.css("hide");
			obj.childTabs[obj.childActive].btn.css("-tab_head_button_active -"+act);	
			obj.childTabs[id].tab.css("-hide");
			obj.childTabs[id].btn.css("tab_head_button_active "+act);
			obj.childActive = id;
		}
	}
	
	var closeTab = function(id) {
		if(obj.childTabs[id].close == true) {
			obj.childTabs[id].btn.css("hide");
			obj.childTabs[id].tab.css("hide");
			obj.childTabs[id].enable = false;
			obj.childTabs[id].close = "closed";
			if(obj.childActive == id) {
				nextTab();
			}
		}
	}
	
	var nextTab = function() {
		for(var i = 0, len = obj.childTabs.length; i < len; i++) {
			if(obj.childTabs[i].enable && obj.childTabs[i].close != "closed") {				
				showTab(i);
				break;
			}
		};
	}
		
	
	this.enable = function(id) {
		enableDisable(id, true);
	}
	
	this.disable = function(id) {
		enableDisable(id, false);
	}
		
	
	var enableDisable = function(id, type) {
		if(type) {
			obj.childTabs[id].btn.css("-disabled");
		} else {
			obj.childTabs[id].btn.css("disabled");
		}
		obj.childTabs[id].enable = type;
	}	

	Nedil.Widget.panel.apply(obj, [el, prop]);
	obj.style("background-color","transparent");
	obj.style("border-width","0px");
	obj.style("overflow", "hidden");
	obj.css("-active");
	obj.wrap.css("text_def_N unselect panel_N active");
	obj.wrap.dim({wid : obj.dim().wid, ht : obj.dim().ht - 39});
	
	return this;
} 

/*DropDown widget*/
Nedil.Widget.dropdown = function(el,prop) {
	var obj = new Nedil.Objs([el]);
	obj.css("unselect");
	if(typeof prop.source == "string") {
		var src = Nedil.get(prop.source);
		//src.css("hide");
		var children = src.getChildren(true);
		prop.source = [];
		for(var i = 0, len = children.elems.length; i < len; i++) {
			var newel = {};
			var opt = new Nedil.Objs([children.elems[i]]);
			newel["text"] = opt.html();
			newel["value"] = opt.element().getAttribute("value");
			if(typeof opt.element().getAttribute("selected") == "string") {
				newel["selected"] = true;
			}
			prop.source.push(newel);
		}
		src.style("display","none");
		
	} 	
	var value = obj.addChild("input", { type : "hidden", name : prop.name ? prop.name : "" });	
	var sel = obj.addChild("div");
	sel.css("active text_def_N textbox_N dropdown");
	var txt = sel.addChild("span");
	txt.css("drop_text");	
	var ic = sel.addChild("span", {"class" : "dropdown_icon"});
	ic.style("float", "right");
	var drop = obj.addChild("div", {"class" : "hide"});
	drop.css("text_def_N drop");
	obj.enabled = (typeof prop.enabled == "undefined") ? true : prop.enabled;

	if(prop.dim) {
		sel.dim(prop.dim);
		obj.dim(prop.dim);
		drop.dim(prop.dim);
	}
	
	var hgt;
	hgt = prop.source.length * 27;
	hgt = hgt > parseInt(drop.style("max-height")) ? parseInt(drop.style("max-height")) : hgt;
	
	var active;
	if(prop.pos) {
		obj.pos(prop.pos);
		sel.pos(prop.pos);
		drop.pos({ x : 0, y : sel.dim().ht});
	}
	

	Nedil.Util.forEach(prop.source, function(el) {
		//var el = prop.source[i];
		var del = drop.addChild("span", { "class" : "drop_element", "text" : el.text});
		del.value = el.value;

		if(el.selected) {
			active = del;
			txt.text(el.text);	
			value.element().value = el.value;
		}
		del.pos({x: 1});
		del.on("mouseover", function() {
			Nedil.self().css("active");
		});
		del.on("mouseout", function() {
			Nedil.self().css("-active");
		});	
		del.on("click", function() {
			if(active) {
				active.css("-active");								
			}
			if(obj.enabled)  {
				var nel = Nedil.self();
				txt.text(nel.text());	
				value.element().value = del.value;
				if(prop.onchange) {
					prop.onchange(del.value);
				}
				active = Nedil.self();
			}
			drop.css("-drop_scroll");
			drop.animate({
				from : {ht : hgt},
				to : {ht : 0},
				anim : "Dimension.bounce.easeout",
				duration : 500,
				oncomplete : function() {
					drop.dim({ht : 1});
					sel.css("-dropdown_bord");						
					drop.css("hide");	
				}				
			});
		});				
	});


	sel.on("click", function() {
		if(obj.enabled) {
			if(active) {
				active.css("active");	
			}						
			drop.dim({ht : 0});
			drop.css("-hide");	
			sel.css("dropdown_bord");
			drop.animate({
				from : {ht : 0},
				to : {ht : hgt},
				anim : "Dimension.bounce.easeout",
				duration : 500,
				oncomplete : function() {
					if(active) {	
						active.element().scrollTop = active.pos().y;
					}				
					drop.css("-hide drop_scroll");	
				}				
			});
		}
	});	
	
	this.enable = function() {
		obj.enabled = true;
		sel.css("-disabled");
	}	
	
	this.disable = function() {
		obj.enabled = false;
		sel.css("disabled");
	}
	
	drop.dim({ht : 1});
	if(!obj.enabled) {
		sel.css("disabled");
	}
	
	return this;
}

/*Menu widget*/
Nedil.Widget.menu = function(el,prop) {
	var obj = new Nedil.Objs([el]);
	obj.css("unselect menubar_holder");
	var appender = obj.addChild("div", {});
	
	var sel = this;
	sel.openMenus = [];
	sel.menus  = [];
	
	this.menuFactory = function(el) {
		var nEl = new Nedil.Objs([el]);
		if(nEl.hasCSSClass("menubar") || nEl.hasCSSClass("menu")) {			
			var children = nEl.getChildren(true);			
			if(children.elems.length) {
				var men = {};
				var wrap = nEl.wrapChildren("div",{"class" : "text_def_N textbox_N menuwrap"});
				men.trig = nEl;
				men.menu = wrap;
				var id = sel.menus.length;
				if(nEl.hasCSSClass("menubar")) {
					men.type = 1;
					nEl.css("active text_def_N textbox_N");		
					nEl.on("click", function() {					
						sel.appear(id);			
					});						
				} else {
					men.type = 2;
					nEl.addChild("span", {"class" : "menu_icon"}, 0);
					nEl.on("mouseover", function() {					
						sel.appear(id);			
					});	
				}
				men.posSet = false;
				sel.menus.push(men);				
			} else {
				if(nEl.hasCSSClass("menubar")) {
					nEl.css("active text_def_N textbox_N");		
					nEl.on("click", function() {					
						sel.hideMenus(nEl);			
					});						
				} else {
					nEl.on("mouseover", function() {					
						sel.hideMenus(nEl);			
					});	
				}
			}
			nEl.dim(nEl.dim());
		}
	}

	this.positionMenus = function(menEl) {

	}

	var children = obj.getChildren();
	for(var i = 0 ; i < children.elems.length ; i++) {
		this.menuFactory(children.elems[i]);
	}
	
	// for(var i = 0 ; i < sel.menus.length; i++) {
		// this.positionMenus(sel.menus[i]);
	// }
	
	for(var i = 0 ; i < sel.menus.length; i++) {
		sel.menus[i].menu.css("hide");
	}
	
	this.appear = function(id) {
		var par = sel.menus[id].trig;
		var menu = sel.menus[id].menu;
		var type = sel.menus[id].type;
		if(!sel.alreadyOpen(menu)) {
			if(!sel.menus[id].posSet) {
				sel.menus[id].posSet = true;
				var parPa = par.pos();
				var parD = par.dim();
				if(type == 1) {	
					menu.pos({ x : 0, y: parPa.y + parD.ht});					
				} else {
					menu.posAbs({ x : parD.wid - 2, y: parPa.y + 5 });		
				}	
			}			
			var chil = menu.getChildren(true);
			sel.hideMenus(menu);
			sel.openMenus.push(menu);	
			par.css("menuwrap_over");
			menu.css("-hide");				
			menu.animate({
				from : 0,
				to : 1,
				anim : "CSS.smooth",
				prop : "opacity",
				duration : 500				
			});	
		}
	}
	
	var disappear = function(menu) {
		var par = new Nedil.Objs([menu.element().parentNode]);
		par.css("-menuwrap_over");	
		menu.style("opacity","0");
		menu.css("hide");		
	}
	
	this.hideMenus = function (menu) {
		for(var i = 0; i < sel.openMenus.length; i++) {			
			if(!menu || !Nedil.Dom.isParent(sel.openMenus[i].element(), menu.element())) {				
				disappear(sel.openMenus[i]);
				sel.openMenus.splice(i,1);
			}
		}
	}
	
	this.alreadyOpen = function(menu) {
		for(var i = 0, len = sel.openMenus.length; i < len; i++) {	
			if(sel.openMenus[i].element() == menu.element()) {		
				return true;
			}
		}
		return false;
	}
	
	return this;
}

/*AutoComplete widget*/
Nedil.Widget.autocomplete = function(el,prop) {
	var obj = new Nedil.Objs([el]);
	var selObj = this;
	var ajaxParam = {};
	var ajaxCall;
	prop.dim.wid = prop && prop.dim && prop.dim.wid ? prop.dim.wid : 200;
	if(!prop.source.length) {
		ajaxCall = prop.source;
		ajaxParam["data"] = prop.param;
		ajaxParam["type"] = "GET";
		ajaxParam["datatype"] = "json",
		ajaxParam["success"] = function(data) {
			var mat = data.NedilResponse;
			if(prop.strict && !mat.length) {
				selObj.txt.setText(selObj.old);	
			} else {
				selObj.update(mat);			
				if(obj.enabled) {		
					drop.dim({ht : 0});
					drop.css("-hide");	
					sel.css("dropdown_bord");
					drop.animate({
						to : {ht : mat.length * 27},
						anim : "Dimension.bounce.easeout",
						duration : 500,
						oncomplete : function() {			
							drop.css("-hide drop_scroll");	
						}				
					});
				}
			}			
		}
		
	} 	
	
	var sel = obj.addChild("input" , {"type" : "text",  name : prop.name ? prop.name : "" });
	var prp = {}
	prp.enabled = typeof prop.enabled == "boolean" ? prop.enabled : true;
	prp.watermark = prop.watermark ? prop.watermark : "";
	selObj.txt = sel.widget("textbox", prp);
	selObj.curr = -1;
	selObj.old = "";
	
	var ic = sel.addChild("span", {"class" : "dropdown_icon"});
	ic.style("float", "right");
	var drop = obj.addChild("div", {"class" : "hide"});
	drop.css("text_def_N drop");
	obj.enabled = (typeof prop.enabled == "undefined") ? true : prop.enabled;

	if(prop.dim) {
		sel.dim(prop.dim);
		obj.dim(prop.dim);
		drop.dim( { wid : prop.dim.wid });
	}
	
	var hgt;
	hgt = prop.source.length ? prop.source.length * 27 : 0;
	hgt = hgt > parseInt(drop.style("max-height")) ? parseInt(drop.style("max-height")) : hgt;
	
	if(prop.pos) {
		obj.pos(prop.pos);
		sel.pos(prop.pos);		
	} 
	drop.pos({ x : 0, y : obj.dim().ht - 2});	
	
	this.update = function(source) {
		var chil = drop.getChildren(true);
		if(chil.elems.length) {
			drop.removeChild(chil);
		}	
		Nedil.Util.forEach(source, function(el) {
			var del = drop.addChild("span", { "class" : "drop_element", "text" : el});
			
			del.on("mouseover", function() {
				if(selObj.curr > -1) {
					var chil = drop.getChildren(true);
					new Nedil.Objs([chil.elems[selObj.curr]]).css("-active");	
				}			
				Nedil.self().css("active");
			});
			del.on("mouseout", function() {
				Nedil.self().css("-active");
			});	
			del.on("click", function() {
				var nel = Nedil.self();
				selObj.old = selObj.txt.getText();
				selObj.txt.setText(nel.text());
				drop.css("-drop_scroll");
				drop.animate({
					to : {ht : 0},
					anim : "Dimension.bounce.easeout",
					duration : 500,
					oncomplete : function() {
						drop.dim({ht : 1});
						sel.css("-dropdown_bord");						
						drop.css("hide");	
					}				
				});
			});				
		});
	}


	sel.on("keyup", function() {
		if(Nedil.currentEvent.keyCode == 40) {
			var chil = drop.getChildren(true);
			if(selObj.curr > -1) {
				new Nedil.Objs([chil.elems[selObj.curr]]).css("-active");	
			}
			selObj.curr++;
			if(chil.elems.length-1 < selObj.curr) {
				selObj.curr = 0;
			}
			new Nedil.Objs([chil.elems[selObj.curr]]).css("active");	
		} else if (Nedil.currentEvent.keyCode == 38) {
			var chil = drop.getChildren(true);
			if(selObj.curr > -1) {
				new Nedil.Objs([chil.elems[selObj.curr]]).css("-active");	
			}
			selObj.curr--;
			if(selObj.curr < 0 ) {
				selObj.curr = chil.elems.length-1;
			}
			new Nedil.Objs([chil.elems[selObj.curr]]).css("active");
		} else if (Nedil.currentEvent.keyCode == 13) {
			var chil = drop.getChildren(true);
			if(selObj.curr > -1) {
				var el = new Nedil.Objs([chil.elems[selObj.curr]]);
				selObj.curr = -1;
				el.css("-active");	
				selObj.old = selObj.txt.getText();
				selObj.txt.setText(el.text());
				drop.css("-drop_scroll");
				drop.animate({
					to : {ht : 0},
					anim : "Dimension.bounce.easeout",
					duration : 500,
					oncomplete : function() {
						drop.dim({ht : 1});
						sel.css("-dropdown_bord");						
						drop.css("hide");	
					}				
				});
			}

		} else {
			if(ajaxCall) {
				ajaxParam["data"][prop.name ? prop.name : "search"] = sel.element().value;
				ajaxCall.send(ajaxParam);
			} else {
				var mat = findMatch(sel.element().value, prop.source);
				if(prop.strict && !mat.length) {
					selObj.txt.setText(selObj.old);	
				} else {
					selObj.update(mat);
					if(obj.enabled) {		
						drop.dim({ht : 0});
						drop.css("-hide");	
						sel.css("dropdown_bord");
						drop.animate({
							to : {ht : mat.length * 27},
							anim : "Dimension.bounce.easeout",
							duration : 500,
							oncomplete : function() {			
								drop.css("-hide drop_scroll");	
							}				
						});
					}
				}				
			}

		}
		selObj.old = selObj.txt.getText();
	});	
	
	sel.on("click", function() {
		if(!drop.hasCSSClass("hide")) {			
			drop.css("-drop_scroll");
			drop.animate({
				to : {ht : 0},
				anim : "Dimension.bounce.easeout",
				duration : 500,
				oncomplete : function() {
					drop.dim({ht : 1});
					sel.css("-dropdown_bord");						
					drop.css("hide");	
				}				
			});
		}
	});	
	
	var findMatch = function(srch, source) {
		var res = [];
		for(var i = 0, len = source.length; i < len; i++) {
			if(source[i].match(new RegExp("^"+srch+"|\\s"+srch,"gi"))) {
				res.push(source[i]);
			}
		}
		return res;
	}
	
	this.enable = function() {
		selObj.txt.enable();
		obj.enabled = true;
		sel.css("-disabled");
	}	
	
	this.disable = function() {
		selObj.txt.disable();
		obj.enabled = false;
		sel.css("disabled");
	}

	drop.dim({ht : 1});
	if(!obj.enabled) {
		sel.css("disabled");
	}
	
	return this;
}

/*Roll widget*/
Nedil.Widget.roll = function(el,prop) {
	var inp = Nedil.get(el);
	var selObj = this;
	var prp = {}
	prp.enabled = typeof prop.enabled == "boolean" ? prop.enabled : true;
	prp.validation = ":";
	selObj.txt = inp.widget("textbox", prp);
	inp.css("unselect");
	inp.on("keydown", function() {
		var evt = Nedil.currentEvent;
		code = evt.keyCode || evt.which;
		if(code == 38) {
			selObj.incr();
		} else if (code == 40) {
			selObj.decr();
		}		
	});	
	var txt = inp.addParent("span", {"class" : "roll_txt"});
	var obj = txt.addParent("div", {"class" : "roll"});
	var btns = obj.addChild("span", {"class" : "roll_btns"});
	var up = btns.addChild("span", { "style" : "font-size : 15px"});
	var down = btns.addChild("span", { "style" : "font-size : 15px"});
	up.widget("button", {
		"event" : { "click" : function() {
				el.focus();
				selObj.incr();
			}
		}		
	});
	down.widget("button", {
		"event" : { "click" : function() {
				el.focus();
				selObj.decr();
			}
		}		
	});	
	up.addChild("span",{"class" : "roll_up"});
	down.addChild("span",{"class" : "roll_down"});
	//down.style("border-top","0px");
	down.style("margin-top","-20px");
	//down.dim({"ht" : "+1"});
	//up.dim({"ht" : "+1"});
	up.css("remove_padding");
	down.css("remove_padding");
	this.enabled = typeof prop.enabled != "undefined" ? prop.enabled : true;
	this.un = prop.unit ? prop.unit : 1;
	this.rTo = prop.range ? prop.range.to : prop.range;
	this.rFrom = prop.range ? prop.range.from : prop.range;
	this.isInt = (this.un + "").match(/\./g) ? false : true;
	
	if(!this.isInt) {
		this.precision = (this.un + "").match(/\.\d*/g)[0].length - 1;
	}

	if(prop.dim && prop.dim.wid) {
		txt.dim({wid : prop.dim.wid - 18});
		inp.dim({wid : prop.dim.wid - 18});
		inp.style("margin","0px");
		obj.dim({wid : prop.dim.wid});
	}

	if(prop.pos) {
		obj.pos(prop.pos);
	}
	
	if(typeof prop.def != "undefined") {
		selObj.txt.setText(prop.def);
	}
	
	this.incr = function() {
		var rs = getValue() + this.un;
		if(typeof this.rTo == "number" && rs > this.rTo) {
			rs = this.rTo;
		}
		if(!this.isInt) {
			rs = Number((rs).toFixed(this.precision));
		}
		selObj.txt.setText(rs);
	}
	
	this.decr = function() {
		var rs = getValue() - this.un;
		if(typeof this.rFrom == "number" && rs < this.rFrom) {
			rs = this.rFrom;
		}
		if(!this.isInt) {
			rs = Number((rs).toFixed(this.precision));
		}		
		selObj.txt.setText(rs);
	}
	
	var getValue = function() {
		var r;
		if(this.isInt) {
			r = parseInt(selObj.txt.getText());
		} else {
			r = parseFloat(selObj.txt.getText());
		}
		return isNaN(r) ? 0 : r;
	}
	
	this.enable = function() {
		selObj.txt.enable();
		up.css("-disabled");
		down.css("-disabled");
	}	
	
	this.disable = function() {
		selObj.txt.disable();
		up.css("disabled");
		down.css("disabled");
	}

	if(!this.enabled) {
		up.css("disabled");
		down.css("disabled");
	}
	
	return this;
}

/*Slider widget*/
Nedil.Widget.slider = function(el,prop) {
	var inp = Nedil.get(el);
	var selObj = this;
	var anId;
	inp.css("slider");
	
	var bar = inp.addChild("div", { "class" : "active" });
	var handle = bar.addChild("div", { "class" : "active slider_handle panel_N" });
	var disp = bar.addChild("div", { "class" : "slid_disp" });
	
	prop.layout = prop.layout ? prop.layout : "horizontal";
	var hd_prop = {}
	if(prop.layout == "horizontal") {
		bar.css("slider_bar_hor");
	} else {
		bar.css("slider_bar_ver");
		handle.css("slider_handle_ver");
		disp.css("slid_disp_ver");
	}
	
	selObj.from = 0;
	selObj.to = 100;
	if(prop.range) {
		selObj.from = prop.range.from ? prop.range.from : 0;
		selObj.to = prop.range.to ? prop.range.to : 100;
	}

	var def = prop.def ? prop.def : selObj.from;
	selObj.onmove = prop.onmove ? prop.onmove : function() {};
	selObj.value = prop.def ? prop.def  : selObj.from;
	selObj.unit = prop.unit ? prop.unit : 1;
	if(prop.dim) {
		bar.dim(prop.dim);
	}
	
	selObj.enabled = typeof prop.enabled != "undefined" ? prop.enabled : true;
	
	handle.on("mousedown", function() {
		if(selObj.enabled) { 
			selObj.pressed = true;
			if(anId) {
				Nedil.Animator.stop(anId);
				disp.style("opacity", 0.5);	
				anId = null;
			}
			disp.css("-hide");
		}
	});
	
	bar.on("mousedown", function() {
		if(selObj.enabled) {
			var abs = handle.mouseAbs();
			disp.css("-hide");	
			if(abs.x > -1 && abs.y > -1) {
				var pos = {};
				var ax = "y";
				var di = "ht";
				var st = "top";
				if(prop.layout == "horizontal") {
					ax = "x";
					di = "wid";
					st = "left";
				}
				pos[ax] = abs[ax];
				if(pos[ax] < bar.posAbs()[ax]) {
					pos[ax] = bar.posAbs()[ax];
				}
				if(pos[ax] > bar.posAbs()[ax] + bar.dim()[di]) {
					pos[ax] = bar.posAbs()[ax] + bar.dim()[di];
				}	
				pos[ax] -= 5;
				
				disp.posAbs(pos);
				handle.posAbs(pos);
				var res =  (((pos[ax] + 5) - bar.posAbs()[ax]) / bar.dim()[di]) * 100;
				res =  selObj.from + parseInt(((selObj.to - selObj.from) * res ) / 100);
				selObj.value = Math.round(res / selObj.unit) * selObj.unit;
				disp.html(selObj.value);
				selObj.onmove(selObj.value);
			} 
		}
	});
	
	Nedil.get(document).on("mouseup", function() {
		selObj.pressed = false;
		//anId = hideDisp();
	});
	
	var hideDisp = function() {
		var id = disp.animate({
			from : 0.5, 	  
			to : 0, 	  
			anim : "CSS.smooth", 
			prop : "opacity",
			duration : 500,
			oncomplete : function() {
				disp.style("opacity", 0.5);
				disp.css("hide");
			}
		});
		return id;
	}
	
	Nedil.get(document).on("mousemove", function() {	
		if(selObj.enabled) {	
			if(selObj.pressed) {
				var abs = handle.mouseAbs();
				if(abs.x > -1 && abs.y > -1) {
					var pos = {};
					var ax = "y";
					var di = "ht";
					if(prop.layout == "horizontal") {
						ax = "x";
						di = "wid";
					}
					pos[ax] = abs[ax];
					if(pos[ax] < bar.posAbs()[ax]) {
						pos[ax] = bar.posAbs()[ax];
					}
					if(pos[ax] > bar.posAbs()[ax] + bar.dim()[di]) {
						pos[ax] = bar.posAbs()[ax] + bar.dim()[di];
					}	
					pos[ax] -= 5;
					handle.posAbs(pos);							
					var res =  (((pos[ax] + 5) - bar.posAbs()[ax]) / bar.dim()[di]) * 100;
					res =  selObj.from + parseInt(((selObj.to - selObj.from) * res ) / 100);
					selObj.value = Math.round(res / selObj.unit) * selObj.unit;
					disp.html(selObj.value);
					disp.posAbs(pos);
					selObj.onmove(selObj.value);
				} 
			}
		}
	});		
			
	this.enable = function() {
		selObj.enabled = true;
		bar.css("-disabled");
		handle.css("-disabled");		
	}	
	
	this.disable = function() {
		selObj.enabled = false;
		bar.css("disabled");
		handle.css("disabled");		
	}
	
	this.getValue = function() {
		return selObj.value;
	}
	
	this.setValue = function(val) {
		if(selObj.enabled) {
			if(val >= selObj.from && val <= selObj.to) {
				disp.css("-hide");
				val = Math.round(val / selObj.unit) * selObj.unit;
				selObj.value = val;
				var pos = {};
				var ax = "y";
				var di = "ht";
				if(prop.layout == "horizontal") {
					ax = "x";
					di = "wid";
				}				
				var res = (val - selObj.from) / (selObj.to - selObj.from) * 100;
				res = parseInt(res/100 *  bar.dim()[di]);
				pos[ax] = bar.posAbs()[ax] + res - 5;
				
				handle.posAbs(pos);
				disp.html(selObj.value);
				disp.posAbs(pos);			
				//anId = hideDisp();
			}
		}						
	}

	this.setValue(def);
	disp.html(selObj.value);
	
	if(!selObj.enabled) {
		bar.css("disabled");
		handle.css("disabled");
	}

	return this;
}

/*Progress bar widget*/
Nedil.Widget.progressbar = function(el,prop) {
	var inp = Nedil.get(el);
	var selObj = this;
	
	selObj.percent = prop.def ? prop.def : 0;
	selObj.showPer = typeof prop.showPercent != "undefined" ? prop.showPercent : true;
	
	inp.css("bar");
	var prog = inp.addChild("div", {"class" : "progress_N active"});
	
			
	this.incr = function(val) {
		this.set(selObj.percent + val);
	}	
	
	this.decr = function(val) {
		this.set(selObj.percent - val);	
	}
	
	this.set = function(val) {
		if(typeof val == "number" && !isNaN(val)) {
			val = val < 0 ? 0 : val;
			val = val > 100 ? 100 : val;
			selObj.percent = val;
			prog.style("width", val + "%");
			if(selObj.showPer) {
				prog.html(selObj.percent+"%");
			}
		}
	}
	
	if(prop.dim && prop.dim.wid) {
		inp.dim({"wid" : prop.dim.wid});
	}
	
	this.set(selObj.percent);
	
	this.get = function() {
		return selObj.percent;
	}

	if(prop.pos){ 
		inp.posAbs(prop.pos);
	}
	
	return this;
}

/*Calendar widget*/
Nedil.Widget.calendar = function(el,prop) {
	var inp = Nedil.get(el);
	var inpEl;
	var selObj = this;
	prop = prop ? prop : {};	
	selObj.input = typeof prop.input != "undefined" ? prop.input : false;	
	if(selObj.input) {
		prop.display = false;
		inpEl = Nedil.get(el);
		var par = inpEl.addParent("div", { "style" : "position: relative"});
		inp = par.addChild("div");
		el = inp.element();
		
	}
	
	Nedil.Widget.constants["calendar_unique"] = Nedil.Widget.constants["calendar_unique"] ? Nedil.Widget.constants["calendar_unique"] + 1 : 1;
	selObj.unique = Nedil.Widget.constants["calendar_unique"];
	inp.css("calendar_N unselect");
	var cal = inp.addChild("div", { "class" : "cal_orig", "id" : "Nedil_cal_"+selObj.unique});
	var dumm = inp.addChild("span", { "class" : "cal_dummy"});
	var calStrforDum = "";
	var defdt = prop.def ?  prop.def : "";
	if(typeof defdt == "string") {
		defdt = defdt.split("/");
		if(defdt.length > 1) {
			defdt = new Date (parseInt(defdt[2]), parseInt(defdt[0])-1, parseInt(defdt[1]));
		} else {
			defdt = new Date();
		}
	}
	
	selObj.disdt = prop.disable ?  prop.disable : "";
	if(typeof selObj.disdt == "string") {
		selObj.disdt = selObj.disdt.split("/");
		if(selObj.disdt.length > 1) {
			selObj.disdt = new Date (parseInt(selObj.disdt[2]), parseInt(selObj.disdt[0])-1, parseInt(selObj.disdt[1]));
		} else {
			selObj.disdt = false;
		}	
	}
	selObj.sel = {
		YR : defdt.getFullYear(),
		MT : defdt.getMonth(),
		DT : defdt.getDate()
	}
	
	selObj.selEnd = {
		YR : new Date().getFullYear(),
		MT : new Date().getMonth(),
		DT : new Date().getDate()
	}

	selObj.nCals = prop.calendars ? prop.calendars : 1;
	selObj.dayFst = prop.first ? prop.first : 0;
	selObj.range = prop.range ? prop.range : 0;
	selObj.rangeSt = 0;
	selObj.defDisp = typeof prop.display != "undefined" ? prop.display : true;
	selObj.curr = false;
	
	this.showMonth = function(year, month, noMonths) {
		var calStr = "";
		cal.style("opacity", 0);
		for(var k = 0; k < noMonths; k++ ) {
			var days = new Date(year, month + 1, 0).getDate();
			var fstDy = new Date(year, month, 1).getDay();
			var dayBeg = selObj.dayFst;	//sunday by default
			var wkdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var rows = parseInt((fstDy - dayBeg + days) / 7) + ((fstDy - dayBeg + days) % 7 ? 1 : 0);

			calStr += "<table id='cal_tab' cellpadding='0' cellspacing='0'>";
			calStr += "<tr class='cal_head'><td><span class='active cal_left' -data-value='"+new Date(year, month, 1).getFullYear()+"_"+new Date(year, month, 1).getMonth()+"_"+k+"' ></span></td><td colspan='5' align='center'><span class='month_year_N' -data-value='"+new Date(year, month, 1).getFullYear()+"' >"+months[new Date(year, month, 1).getMonth()]+" , "+new Date(year, month, 1).getFullYear()+"</span></td><td><span class='active cal_right' -data-value='"+new Date(year, month, 1).getFullYear()+"_"+new Date(year, month, 1).getMonth()+"_"+k+"'></span></td></tr>";
			calStr += "<tr class='wkdays'>";
			var fdy = dayBeg;
			for(var j = 0; j < 7; j++) {
				if(fdy > 6) {
					fdy = 0;
				}
				calStr += "<td align='center'>"+wkdays[fdy]+"</td>";	
				fdy++;
			}
			calStr += "</tr>";
			
			fstDy = fstDy < dayBeg ? 7 + fstDy : fstDy;
			var dys = (fstDy - dayBeg);

			dys = dys < 0 ? dys : -1 * dys;
			
			for(var i = 0; i < 6; i++) {
				calStr += "<tr>"
				for(var j = 0; j < 7; j++) {
					dys++;
					if(dys > 0 && dys <= days) {
						if(selObj.disdt && new Date(year, month, dys) <= selObj.disdt) {
							calStr +=  "<td align='center' class='active day_disabled' -data-value='nothing'>";
						} else if(year == selObj.sel.YR && month == selObj.sel.MT && dys == selObj.sel.DT) {
							calStr +=  "<td align='center' class='active day_select day_selected' -data-value='"+new Date(year, month, 1).getFullYear()+"_"+new Date(year, month, 1).getMonth()+"_"+dys+"'>";
						} else if(selObj.range && selObj.rangeSt == 1) {
							var st = new Date(selObj.sel.YR, selObj.sel.MT, selObj.sel.DT);
							var dt = new Date(year, month, dys);
							if(dt < st) { 
								calStr +=  "<td align='center' class='active day_disabled' -data-value='nothing'>";
							} else {
								calStr +=  "<td align='center' class='active day_select' -data-value='"+new Date(year, month, 1).getFullYear()+"_"+new Date(year, month, 1).getMonth()+"_"+dys+"'>";
							}
						}else if(selObj.range && selObj.rangeSt == 2) {
							var st = new Date(selObj.sel.YR, selObj.sel.MT, selObj.sel.DT);
							var ed = new Date(selObj.selEnd.YR, selObj.selEnd.MT, selObj.selEnd.DT);
							var dt = new Date(year, month, dys);
							if(dt >= st && dt <= ed) {
								calStr +=  "<td align='center' class='active day_select day_selected' -data-value='"+new Date(year, month, 1).getFullYear()+"_"+new Date(year, month, 1).getMonth()+"_"+dys+"'>";
							} else {
								calStr +=  "<td align='center' class='active day_select' -data-value='"+new Date(year, month, 1).getFullYear()+"_"+new Date(year, month, 1).getMonth()+"_"+dys+"'>";
							}
						} else {
							calStr +=  "<td align='center' class='active day_select' -data-value='"+new Date(year, month, 1).getFullYear()+"_"+new Date(year, month, 1).getMonth()+"_"+dys+"'>";
						}
						calStr += dys;
					} else {
						calStr += "<td align='center' class='disabled'>";
					}
					calStr += "</td>";			
				}
				calStr += "</tr>"
			}
			month++;
		}	
		cal.html(calStr);
		Nedil.get("#Nedil_cal_"+selObj.unique+" span.cal_left").on("click", function() {
			var val = Nedil.self().element().getAttribute("-data-value").split("_");
			selObj.move(1, parseInt(val[1]), parseInt(val[0]), parseInt(val[2]));
			
		});
		
		Nedil.get("#Nedil_cal_"+selObj.unique+" span.cal_right").on("click", function() {
			var val = Nedil.self().element().getAttribute("-data-value").split("_");
			selObj.move(2, parseInt(val[1]), parseInt(val[0]), parseInt(val[2]));
			
		});	
		
		
		Nedil.get("#Nedil_cal_"+selObj.unique+" td.day_select").on("click", function() {
			var val = Nedil.self().element().getAttribute("-data-value").split("_");
			if(val != "nothing") {
				if(selObj.range) {
					if(selObj.rangeSt == 0 || selObj.rangeSt == 2) {
						selObj.sel.YR = parseInt(val[0]);
						selObj.sel.MT = parseInt(val[1]);
						selObj.sel.DT = parseInt(val[2]);
						selObj.rangeSt = 1;
						selObj.showMonth(selObj.sel.YR, selObj.sel.MT, selObj.nCals);	
					} else if(selObj.rangeSt == 1) {					
						selObj.selEnd.YR = parseInt(val[0]);
						selObj.selEnd.MT = parseInt(val[1]);
						selObj.selEnd.DT = parseInt(val[2]);
						selObj.rangeSt = 2;
						selObj.showMonth(selObj.sel.YR, selObj.sel.MT, selObj.nCals);
						if(selObj.input) {					
							var st = (selObj.sel.MT + 1) + "/" + selObj.sel.DT + "/" + selObj.sel.YR;
							st += " - " +(selObj.selEnd.MT + 1) + "/" + selObj.selEnd.DT + "/" + selObj.selEnd.YR;
							inpEl.element().value = st;
							selObj.hide();
						}						
					}
				} else {
					selObj.sel.YR = parseInt(val[0]);
					selObj.sel.MT = parseInt(val[1]);
					selObj.sel.DT = parseInt(val[2]);
					selObj.showMonth(selObj.sel.YR, selObj.sel.MT, selObj.nCals);	
					if(selObj.input) {					
						inpEl.element().value = (selObj.sel.MT + 1) + "/" + selObj.sel.DT + "/" + selObj.sel.YR;
						selObj.hide();
					}
				}
			}
		});	
		
		Nedil.get("#Nedil_cal_"+selObj.unique+" span.month_year_N").on("click", function() {
			var val = Nedil.self().element().getAttribute("-data-value").split("_");
			var str = "<table id='mnth_sel' class='mnth_N' cellpadding='0' cellspacing='0'>";
			str += "<tr class='cal_head'><td><span class='active cal_left_yr' ></span></td><td colspan='2' align='center'><span id='year_only_N' class='month_year_N'>"+new Date(year, month, 1).getFullYear()+"</span></td><td><span class='active cal_right_yr'></span></td></tr>";			
			for(var i = 0; i < 12 ; i++) {
				if((i+1)%4 == 1) {
					str += "<tr>"
				}
				str += "<td class='mths' align='center' -data-value='"+i+"'>"+months[i]+"</td>";
				if((i+1)%4 == 0) {
					str += "</tr>"
				}				
			}
			
			cal.html(str);
			if(selObj.nCals == 1) {
				var el = Nedil.get("#Nedil_cal_"+selObj.unique+" table");	
				dumm.posAbs(el.posAbs());	
				var tar = { y : el.posAbs().y};
				var from = {y : el.posAbs().y - 150};					
				el.animate({
					from : from, 	  
					to : tar, 	  
					anim : "Location.smooth", 
					duration : 500,
					absolute : true,
					oncomplete : function() {
						dumm.html("");				
					}
				});	
				dumm.html(calStrforDum);	
			}	

			Nedil.get("#Nedil_cal_"+selObj.unique+" span.cal_left_yr").on("click", function() {
				 var val = parseInt(Nedil.get("#Nedil_cal_"+selObj.unique+" #year_only_N").html()) - 1;
				 Nedil.get("#Nedil_cal_"+selObj.unique+" #year_only_N").html(""+val);
			});
			
			Nedil.get("#Nedil_cal_"+selObj.unique+" span.cal_right_yr").on("click", function() {
				 var val = parseInt(Nedil.get("#Nedil_cal_"+selObj.unique+" #year_only_N").html()) + 1;
				 Nedil.get("#Nedil_cal_"+selObj.unique+" #year_only_N").html(""+val);
			});

			Nedil.get("#Nedil_cal_"+selObj.unique+" .mths").on("click", function() {
				var mt = Nedil.self().element().getAttribute("-data-value");
				var yr = Nedil.get("#Nedil_cal_"+selObj.unique+" #year_only_N").html();
				selObj.showMonth(yr, mt, selObj.nCals);
			});	
			
		});	
	}
	
	
	this.showMonth(defdt.getFullYear(), defdt.getMonth(), selObj.nCals);
	calStrforDum = cal.html();
	
	this.move = function(dir, month, year, caln) {	// dir - 1 left, 2 right
		var dt, frm;

		if(dir == 1) {
			dt = new Date(year, month  - 1 - caln);
			frm = -150;
		} else if(dir == 2) {
			frm = 150;
			dt = new Date(year, month + 1 - caln);
		}
		calStrforDum = cal.html();	
		this.showMonth(dt.getFullYear(), dt.getMonth(), selObj.nCals);
		
		if(selObj.nCals == 1) {
			var el = Nedil.get("#Nedil_cal_"+selObj.unique+" table");
			var tar = { x : el.pos().x + 10};
			var from = {x : el.pos().x + frm};		
			dumm.pos(el.pos());						
			el.animate({	
				from : from,
				to : tar, 	  
				anim : "Location.cubic.easeout", 
				duration : 500,
				absolute : true,
				oncomplete : function() {
					dumm.html("");				
				}
			});		
			dumm.html(calStrforDum);
		}
		
	}

	this.getDate = function() {
		return new Date(selObj.sel.YR, selObj.sel.MT, selObj.sel.DT);
	}
	
	this.rangeStart = function() {
		return this.getDate();
	}
	
	this.rangeEnd = function() {
		return new Date(selObj.selEnd.YR, selObj.selEnd.MT, selObj.selEnd.DT);
	}	
	
	this.noOfSelectedDays = function() {
		var dif = this.rangeEnd() - this.rangeStart();
		return (dif/(24*60*60*1000) + 1);
	}	
	
	this.show = function() {
		if(!selObj.curr) {
			if(selObj.input && !selObj.range) {
				var val = inpEl.element().value.split("/");
				if(val.length == 3) {
					var mt = parseInt(val[0]);
					var dt = parseInt(val[1]);
					var yr = parseInt(val[2]);
					if(mt > 0 && mt < 13 && dt > 0 && dt < 32 && yr > 1800) {
						selObj.sel.YR = yr;
						selObj.sel.DT = dt;
						selObj.sel.MT = mt - 1;
						selObj.showMonth(selObj.sel.YR, selObj.sel.MT, selObj.nCals);	
					} else {
						inpEl.element().value = "";
					}
				} else {
					inpEl.element().value = "";
				}
			}
			inp.css("-hide");
			if(selObj.input) {	
				var ps = inpEl.pos();
				ps.y += inpEl.dim().ht;
				inp.pos(ps);
			}
			inp.animate({	
				from : {ht : 1},
				to : {ht : 217}, 	  
				anim : "Dimension.smooth", 
				duration : 300,
				oncomplete : function() {
					selObj.curr = true;
				}
			});	
		}
	}
	
	this.hide = function() {
		inp.animate({	
			from : {ht : 217},
			to : {ht : 1}, 	  
			anim : "Dimension.smooth", 
			duration : 300,
			oncomplete : function() {
				inp.style("position", "absolute");	
				inp.css("hide");
				selObj.curr = false;
			}
		});	
	}
	
	if(prop.pos){ 
		inp.pos(prop.pos);
	}
	
	if(!selObj.defDisp) {
		inp.style("position", "absolute");
		inp.style("z-Index", "10");
		inp.css("hide");
	}
	
	if(selObj.input) {	
		var ps = inpEl.posAbs();
		ps.y += inpEl.dim().ht;
		inp.posAbs(ps);
		inpEl.on("focus", function() {
			selObj.show();
		});
		inpEl.on("blur", function() {
			//selObj.hide();
		});		
	}
	
	return this;
}

/*Text Editor widget*/
Nedil.Widget.texteditor = function(el,prop) {
	var inp = Nedil.get(el);
	var selObj = this;
	selObj.selection = "";
	var par = inp.addParent("div", { "class" : "active texteditor_N" });
	var menu = par.addChild("div", { "class" : "editor_menu" }, 0);
	inp.element().setAttribute("contentEditable", "true");
	inp.css("editor_N select_N")
	
	var bold = menu.addChild("div");
	bold.widget("button", { text : "<b>B</b>" ,
		event : {
			"click" : function() {
				var newSt = "<b>" + selObj.selection.text + "</b>";
				console.log(selObj.selection.range);
				Nedil.Util.pasteHTML(selObj.selection, newSt);
				Nedil.Util.selectHTML(selObj.selection);
			}
		}
	});
	var italic = menu.addChild("div");
	italic.widget("button", { text : "<i>I</i>" ,
		event : {
			"click" : function() {
				var newSt = "<i>" + selObj.selection.text + "</i>";
				Nedil.Util.pasteHTML(selObj.selection, newSt);
				Nedil.Util.selectHTML(selObj.selection);
			}
		}
	});
	var underline = menu.addChild("div");
	underline.widget("button", { text : "<span style='text-decoration:underline'>U<span>" });

	menu.addChild("span", {"class" : "te_spacer"});
	
	var bold = menu.addChild("div");
	bold.widget("button", { text : "<span style='font-weight:bold'>B<span>" });
	var italic = menu.addChild("div");
	italic.widget("button", { text : "<span style='text-decoration:italic'>I<span>" });
	var underline = menu.addChild("div");
	underline.widget("button", { text : "<span style='text-decoration:underline'>U<span>" });	
	
	
	inp.on("mouseup", function() {
		selObj.selection = Nedil.Util.getSelectedHTML();
	});
	
	prop = prop ? prop : {};
	
	inp.dim( { ht : par.dim().ht - 40});
	
	// if(prop.pos){ 
		// inp.posAbs(prop.pos);
	// }
	
	if(prop.dim){ 
		par.dim(prop.dim);
		inp.dim( { ht : par.dim().ht - 40});
	}
	
	return this;
}

/*Slide Show widget*/
Nedil.Widget.slideshow = function(el,prop) {
	var frame = Nedil.get(el);
	frame.css("slideshow_frame");
	var inp = frame.wrapChildren("div");
	var selObj = this;
	var prop = prop ? prop : {};
	inp.css("slideshow_wrap");
	var images = inp.getChildren();
	selObj.maxImage = images.elems.length;
	inp.style("position", "absolute");
	images.style("position", "absolute");
	var title = inp.addChild("div", { "class" : "slideshow_title text_def_N"});
	var right = inp.addChild("div", { "class" : "slideshow_arrow text_def_N unselect"});
	right.html("&gt;")
	var left = inp.addChild("div", { "class" : "slideshow_arrow text_def_N unselect"});
	left.html("&lt;")
	var dim = (prop.dim && prop.dim.wid && prop.dim.ht) ? prop.dim : { wid : 400, ht : 300};
	inp.dim(dim);
	frame.dim({ wid : dim.wid + 8, ht: dim.ht + 8});
	var timer;
	
	title.style("opacity", 0.7);
	right.css("hide");
	left.css("hide");
	
	var animT = prop.animTime ? prop.animTime : 1000;
	var slideT = prop.pauseTime ? prop.pauseTime : 3000;
	var titlePos = prop.titlePos ? prop.titlePos : "bottom";
	var arrow = typeof prop.arrow != "undefined" ? prop.arrow : true;
	var autoPlay = typeof prop.autoPlay != "undefined" ? prop.autoPlay : true;
	
	var slideAnimation = ["smoothLeft","smoothRight","bounceLeft", "bounceRight", "smoothTop", "smoothBottom", "bounceTop", "bounceBottom", "blur"];
	var animType = prop.animType ? (slideAnimation.indexOf(prop.animType) ? slideAnimation.indexOf(prop.animType) : -1): -1;
	if(arrow) {
		frame.on("mouseover", function() {
			right.css("-hide");
			left.css("-hide");
			var y = inp.pos().y + inp.dim().ht/2 - right.dim().ht/2;
			var lefx = inp.pos().x + 20;
			var rigx = inp.pos().x + inp.dim().wid - right.dim().wid - 20;
			left.pos({"x" : lefx, "y" : y });
			right.pos({"x" : rigx, "y" : y });
			right.animate({
				from : 0.1,
				to : 0.5,
				anim : "CSS.smooth",
				prop : "opacity",
				duration : 200
			});		
			left.animate({
				from : 0.1,
				to : 0.5,
				anim : "CSS.smooth",
				prop : "opacity",
				duration : 200
			});			
		});
		
		frame.on("mouseout", function() {
			right.css("hide");
			left.css("hide");
		});
		
		right.on("click", function() {
			clearInterval(timer);
			var newn = selObj.currNo + 1;
			newn = newn >= selObj.maxImage ? 0 : newn;
			var dir = animType;
			if(animType == 0 || animType == 2 || animType == 4 || animType == 6) {
				dir++;
			}
			selObj.slide(newn, dir);
			if(autoPlay) {
				timer = setInterval(selObj.next, slideT); 
			}			
		});
		
		left.on("click", function() {
			clearInterval(timer);
			var newn = selObj.currNo - 1;
			newn = newn < 0 ? selObj.maxImage-1 : newn ;
			var dir = animType;
			if(animType == 1 || animType == 3 || animType == 5 || animType == 7) {
				dir--;
			}	
			selObj.slide(newn, dir);
			if(autoPlay) {
				timer = setInterval(selObj.next, slideT); 
			}			
		});		
	}
	
	for(var i = 0; i < selObj.maxImage ; i++) {
		var el = images.elems[i];
		var di = inp.dim();
		el.setAttribute("width", di.wid+"px");
		el.setAttribute("height", di.ht+"px");
	}
	images.css("hide unselect");
	selObj.currNo = 0;
	selObj.currImage = Nedil.get(images.elems[selObj.currNo]);
	var ti = images.elems[selObj.currNo].getAttribute("title");
	if(titlePos == "bottom") {
		if(ti && ti.trim() != "") {
			title.html(ti);
			title.pos({ x : 0, y : inp.pos().y + inp.dim().ht - title.dim().ht});
		} else {
			title.pos({ x : 0, y : inp.pos().y - title.dim().ht});
		}	
	} else {
		if(ti && ti.trim() != "") {
			title.html(ti);
		} else {
			title.pos({ x : 0, y : inp.pos().y - title.dim().ht});
		}	
	}
	Nedil.get(images.elems[selObj.currNo]).css("-hide");
	
	selObj.next = function() {
		var newn = selObj.currNo + 1;
		newn = newn >= selObj.maxImage ? 0 : newn;
		selObj.slide(newn);
	}
	
	selObj.slide = function(newNo, slAnim) {
		var old = Nedil.get(images.elems[selObj.currNo]);
		selObj.currNo = newNo;
		var newSlid = Nedil.get(images.elems[selObj.currNo]);
		var im  = images.elems[selObj.currNo];
		if(im.complete) {
			var wrpPos = {x: 0, y: 0} ;
			if((typeof slAnim == "undefined" && animType < 0) || (typeof slAnim != "undefined" && slAnim < 0)) {
				slAnim = Math.floor(Math.random()*slideAnimation.length) ;
			} else if(typeof slAnim == "undefined") {
				slAnim = animType;
			} 
			
			if(slideAnimation[slAnim] === "bounceRight") { 
				var frm = { x : wrpPos.x + inp.dim().wid, y : wrpPos.y};
				var top = wrpPos;
				old.css("-slideshow_top");
				newSlid.css("-hide slideshow_top");
				newSlid.animate({
					from : frm,
					to : top,
					anim : "Location.bounce.easeout",
					duration : animT
				});
			} else 	if(slideAnimation[slAnim] === "smoothRight") { 
				var frm = { x : wrpPos.x + inp.dim().wid, y : wrpPos.y};
				var top = wrpPos;
				old.css("-slideshow_top");
				newSlid.css("-hide slideshow_top");
				newSlid.animate({
					from : frm,
					to : top,
					anim : "Location.smooth",
					duration : animT
				});
			} else 	if(slideAnimation[slAnim] === "bounceLeft") { 
				var frm = { x : wrpPos.x - inp.dim().wid, y : wrpPos.y};
				var top = wrpPos;
				console.log(top);
				old.css("-slideshow_top");
				newSlid.css("-hide slideshow_top");
				newSlid.animate({
					from : frm,
					to : top,
					anim : "Location.bounce.easeout",
					duration : animT
				});
			} else 	if(slideAnimation[slAnim] === "smoothLeft") { 
				var frm = { x : wrpPos.x - inp.dim().wid, y : wrpPos.y};
				var top = wrpPos;
				old.css("-slideshow_top");
				newSlid.css("-hide slideshow_top");
				newSlid.animate({
					from : frm,
					to : top,
					anim : "Location.smooth",
					duration : animT
				});
			} else 	if(slideAnimation[slAnim] === "bounceTop") { 
				var frm = { x : wrpPos.x, y : wrpPos.y - inp.dim().ht};
				var top = wrpPos;
				old.css("-slideshow_top");
				newSlid.css("-hide slideshow_top");
				newSlid.animate({
					from : frm,
					to : top,
					anim : "Location.bounce.easeout",
					duration : animT
				});
			} else 	if(slideAnimation[slAnim] === "smoothTop") { 
				var frm = { x : wrpPos.x, y : wrpPos.y - inp.dim().ht};
				var top = wrpPos;
				old.css("-slideshow_top");
				newSlid.css("-hide slideshow_top");
				newSlid.animate({
					from : frm,
					to : top,
					anim : "Location.smooth",
					duration : animT
				});
			} else 	if(slideAnimation[slAnim] === "bounceBottom") { 
				var frm = { x : wrpPos.x, y : wrpPos.y + inp.dim().ht};
				var top = wrpPos;
				old.css("-slideshow_top");
				newSlid.css("-hide slideshow_top");
				newSlid.animate({
					from : frm,
					to : top,
					anim : "Location.bounce.easeout",
					duration : animT
				});
			} else 	if(slideAnimation[slAnim] === "smoothBottom") { 
				var frm = { x : wrpPos.x, y : wrpPos.y + inp.dim().ht};
				var top = wrpPos;
				old.css("-slideshow_top");
				newSlid.css("-hide slideshow_top");
				newSlid.animate({
					from : frm,
					to : top,
					anim : "Location.smooth",
					duration : animT
				});
			} else 	if(slideAnimation[slAnim] === "blur") { 
				var frm = { x : wrpPos.x, y : wrpPos.y };
				newSlid.css("-hide");
				newSlid.style("opacity", 0);
				old.css("-slideshow_top");		
				newSlid.css("slideshow_top");
				newSlid.pos(frm);
				newSlid.animate({
					from : 0.1,
					to : 1,
					anim : "CSS.smooth",
					prop : "opacity",
					duration : animT, 
					oncomplete : function() {
						newSlid.pos({x : 0, y : 0});
					}
				});
			}
			
			if(titlePos == "bottom") {
				var ti = images.elems[selObj.currNo].getAttribute("title");
				if(ti && ti.trim() != "") {
					title.html(ti);
					var frm = { x : 0, y : wrpPos.y + inp.dim().ht };
					var top = { x : 0, y : wrpPos.y + inp.dim().ht - title.dim().ht};
					title.animate({
						from : frm,
						to :  top,
						anim : "Location.smooth",
						duration : animT/2
					});	
				} else {
					title.pos({ x : 0, y : wrpPos.y - title.dim().ht});
				}		
			} else {
				var ti = images.elems[selObj.currNo].getAttribute("title");
				if(ti && ti.trim() != "") {
					title.html(ti);
					var frm = { x : 0, y : wrpPos.y - title.dim().ht};
					var top = { x : 0, y : 0};					
					title.animate({
						from : frm,
						to :  top,
						anim : "Location.smooth",
						duration : animT/2
					});	
				} else {
					title.pos({ x : 0, y : wrpPos.y - title.dim().ht});
				}
			}
				
			old.animate({
				from : 0.9,
				to : 0.1,
				anim : "CSS.smooth",
				prop : "opacity",
				duration : animT,
				oncomplete : function() {
					old.style("opacity", 1);
					old.css("hide");
				}
			});	
		}
		
	}
	
	selObj.play = function() {
		timer = setInterval(selObj.next, slideT);
	}
	
	selObj.pause = function() {
		clearInterval(timer);
	}	
	
	if(autoPlay) {
		timer = setInterval(selObj.next, slideT); 
	}

	return this;
}

/*Accordion widget*/
Nedil.Widget.accordion = function(el,prop) {
	var obj = Nedil.get(el);
	var selObj = this;
	obj.addParent("div").style("position", "relative");
	obj.css("accordion_N");
	prop = prop ? prop : {};

	var collapseAll = typeof prop.collapse != "undefined" ? prop.collapse : true;
	var defaultclose = typeof prop.multi != "undefined" ? !prop.multi : true;
	
	prop.dim = (prop.dim && prop.dim.wid && prop.dim.ht )? prop.dim : { wid : 300, ht : 400};
	if(defaultclose) {
		obj.dim(prop.dim);
	} else {
		obj.dim({wid : prop.dim.wid});
	}
	

	if(prop.pos) {
		obj.pos(prop.pos);
	}
	
	var chil = obj.getChildren(true);
	var noCh = chil.elems.length;
	var chilHead = [];
	var currOpen;
	var currHead;
	
	for(var i = 0; i< noCh; i++) {
		var content = Nedil.get(chil.elems[i]);
		content.css("accordion_content");
		var par = content.addParent("div", { "class" : "accordion_parent" });
		par.style("z-Index",i+1);
		par.dim({ wid : prop.dim.wid});
		var head = par.addChild("span", { "class" : "active unselect accordion_head"}, 0 );
		head.dim({ wid : prop.dim.wid});
		head.html(content.element().getAttribute("title"));
		var hd = head.dim().ht * noCh;
		var contHout = prop.dim.ht - hd;
		if(!defaultclose) {
			contHout = content.dim().ht;
			content.style("max-height", (prop.dim.ht - head.dim().ht) + "px");
		}
		var headP = i * head.dim().ht;		
		content.dim({ht : contHout});
		var contOrg = content;
		content = content.addParent("div");
		content.style("overflow", "hidden");
		content.dim({ht : 0});
		content.style("max-height", prop.dim.ht + "px");
		content.css("hide");
		var currH;
		var def;
		if(typeof prop.def == "number" && prop.def == i) {
			def = head;
		}
		(function() {
			var h = head;
			var c = content;
			var pPos = headP;
			var p = par;
			var cOr = contOrg;
			var contH = contHout;
			h.on("click", function() {
				if(c.dim().ht > 20) {
					if(collapseAll) {
						c.style("overflow-y","hidden");
						h.css("-accordion_head_selected");
						c.animate({
							from : { ht : contH},
							to : { ht : 0},
							anim : "Dimension.smooth",
							duration : 500,
							oncomplete : function() {
								currH = null;
								currHead = null;
							}					
						});
					}					
				} else {
					h.css("accordion_head_selected");
					c.css("-hide");
					c.animate({
						from : { ht : 1},
						to : { ht : contH},
						anim : "Dimension.smooth",
						duration : 500,
						oncomplete : function() {	
							cOr.style("overflow-y","auto");
						}					
					});	
					if(defaultclose && currH) {
						currH.style("overflow-y","hidden");
						currHead.css("-accordion_head_selected");
						currH.animate({
							from : { ht : contH},
							to : { ht : 0},
							anim : "Dimension.smooth",
							duration : 500,
							oncomplete : function() {							
							}					
						});	
					}
					
					currH = c;
					currHead = h;
				}
			});
			
		})();
		
	}
		
	if(def) {
		def.trigger("click");
	}
	
	return this;
} 

/*Tree Widget*/
Nedil.Widget.tree = function(el,prop) {
	var obj = Nedil.get(el);
	var selObj = this;
	prop = prop ? prop : {};
	
	obj.css("tree_N unselect text_def_N");
	
	var allCh = obj.getChildren();
	var child = obj.getChildren(true);
	
	var rootId = "Nedil_Tree_"+ obj.element().getAttribute("id") + "_";
	
	if(prop.dim) {
		//obj.dim(prop.dim);
	}
	
	var createNode = function(par, ang, elId) {
		for(var j = 0, lent = par.elems.length; j < lent; j++) {
			var li = Nedil.get(par.elems[j]);
			var eld  = elId + j;
			var child = li.getChildren(true);	
			var hasC = false;
			var spPar, arro, arrCo;			
			for(var i = 0, len = child.elems.length; i < len; i++) {
				var ch = child.elems[i];
				var nCh = Nedil.get(ch);
				if(ch.nodeName.toLowerCase() == 'span' || ch.tagName.toLowerCase() == 'span')  {
					spPar = nCh.addParent("span", { "class" : "li_par_span"});
					spPar.element().setAttribute("id", eld);
				} else if(ch.nodeName.toLowerCase() == 'ul' || ch.tagName.toLowerCase() == 'ul')  {
					hasC = true;
					createNode(nCh.getChildren(true), true, eld);
					arro = spPar.addChild("span", { "class" : "li_child"} , 0);
					arrCo = arro.addParent("span", { "class" : "li_child_cont li_child_cont_hov"});
					nCh.css("hide");
					(function() {
						var spP = spPar;
						var nc = nCh;
						var arr = arro;
						var arC = arrCo;
						arC.on("click", function() {
							if(nc.hasCSSClass("hide")) {
								nc.css("-hide");
								arr.css("openChild");
							} else {
								nc.css("hide");
								arr.css("-openChild");
							}
						});
						arC.on("mouseover", function() {
							arC.css("-li_child_cont_hov");
							arC.css("active");
						});	
						arC.on("mouseout", function() {
							arC.css("-active");
							arC.css("li_child_cont_hov");
						});							
					})();
				}	
			}
			if(hasC) {
				arro.css("li_child hasChild");
			} else {
				arro = spPar.addChild("span", { "class" : "li_child"} , 0);
				arrCo = arro.addParent("span", { "class" : "li_child_cont li_child_cont_hov"});
			}			
			var el = spPar.addChild("span", { "class" : "li_ang"} , 0);
			if(ang) {
				el.css("li_ang_child");
			}
		}			
	}
	
	createNode(child, false,rootId);
	
	var selectImmediateChild = function(parId) {
		var res = [];
		var id = "#"+rootId+parId;
		var el = Nedil.get(id);

		
		var i = -1;
		while(true) {
			i++;
			var nId = id + i;
			var el = Nedil.get(nId);
			if(el.elems.length ) {
				res.push(el);
			} else {
				break ; 
			}
		}
		
		return res;
	}
	
	var selectAllChild = function(parId) {
		var res = [];
		res = res.concat(selectImmediateChild(parId));
		for(var i = 0, len = res.length; i < len; i++) {
			var nId = "#"+rootId+parId + i;
			var el = Nedil.get(nId);
			if(el.elems.length ) {
				res = res.concat(selectAllChild(parId+""+i));
			}
		}
		return res
	}
	
	selObj.getChild = function(parId, imm) {
		var res = [];
		var id = "#"+rootId+parId;
		var el = Nedil.get(id);
		res.push(el);
		if(imm) {
			return res.concat(selectImmediateChild(parId)); 
		} else {
			return res.concat(selectAllChild(parId));
		}
	}
	
	var insertChildren = function(parId, tag) {
		var id, spP, el;
		var pos = 0;
		var ul, ang = true;
		if(parId.trim() == "-1") {
			id = "#"+rootId;
			spP = Nedil.get(id);
			el = Nedil.get(spP.element().parentNode);
			pos = obj.getChildren(true).elems.length;
			ul = obj;
			ang = false;
		} else {
			id = "#"+rootId+parId;
			spP = Nedil.get(id);
			el = Nedil.get(spP.element().parentNode);
			var child = el.getChildren(true);	
	
			for(var i = 0, len = child.elems.length; i < len; i++) {
				var ch = child.elems[i];
				var nCh = Nedil.get(ch);
				if(ch.nodeName.toLowerCase() == 'ul' || ch.tagName.toLowerCase() == 'ul')  {
					pos = nCh.getChildren(true).elems.length;
					ul = nCh;
					break;
				}	
			}
		}

		id += pos;
		if(!ul) {
			ul = el.addChild("ul");
			var arrCo = Nedil.get(spP.getChildren(true).elems[1]);
			var arro = arrCo.getChildren(true);
			arro.css("hasChild");
			
			(function() {
				var arC = arrCo;
				var ul1 = ul;
				var arr = arro;
				arC.on("click", function() {
					if(ul.hasCSSClass("hide")) {
						ul1.css("-hide");
						arr.css("openChild");
					} else {
						ul1.css("hide");
						arr.css("-openChild");
					}
				});
				arC.on("mouseover", function() {
					arC.css("-li_child_cont_hov");
					arC.css("active");
				});	
				arC.on("mouseout", function() {
					arC.css("-active");
					arC.css("li_child_cont_hov");
					
				});	
			})();

			ul.css("hide");
		}
		var newN = ul.addChild("li");
		var sp = newN.addChild("span");
		var spPar = sp.addParent("span", { "class" : "li_par_span"});
		spPar.element().setAttribute("id", id.substr(1));
		sp.html(tag);
		
		var arro = spPar.addChild("span", { "class" : "li_child"} , 0);
		var arrCo = arro.addParent("span", { "class" : "li_child_cont li_child_cont_hov"});
		if(ang) {
			var el = spPar.addChild("span", { "class" : "li_ang li_ang_child"} , 0);
		} else {
			var el = spPar.addChild("span", { "class" : "li_ang"} , 0);
		}
	}

	selObj.insert = function(parId, tags) {
		for(var i = 0, len = tags.length; i < len ; i++ ) {
			insertChildren(parId, tags[i]);
		}
	}
	
	return this;
} 

/*ColorPicker Widget*/
Nedil.Widget.colorpicker = function(el,prop) {
	var obj = Nedil.get(el);
	var selObj = this;
	prop = prop ? prop : {};
	
	selObj.selected = prop.def ? prop.def.toUpperCase() : "#FFFFFF";
	var onsel = prop.onselect ? prop.onselect : function(col) {};
	var oncha = prop.onchange ? prop.onchange : function(col) {};
	var fulldisp = typeof prop.fulldisplay != "undefined" ? prop.fulldisplay : false;
	var hide = typeof prop.hide != "undefined" ? prop.hide : false;
	
	var hgt = prop.type ? (prop.type == "mini" ? 30 : 100) : 100;
	var input = typeof prop.input != "undefined" ? prop.input : false;
	selObj.start = false;
	selObj.gradstart = false;
	var colP;
	if(!input && !fulldisp) {
		obj.css("colorpicker_N_source unselect text_def_N");
		obj.style("background-color", selObj.selected);
		obj.addChild("span", { "class" : "colorp_arrow"});
	}
	
	if(fulldisp) {
		colP = obj.addChild("div", { "class" : "colorpicker_N active"});
	} else {
		colP = Nedil.get(obj.element().parentNode).addChild("div", { "class" : "colorpicker_N active"});
	}
	
	var rgbImg;
	if(hgt > 30) {
		rgbImg = colP.addChild("div", { "class" : "colorP_RGB_max unselect"});
	} else {
		rgbImg = colP.addChild("div", { "class" : "colorP_RGB_mini unselect"});
	}
	var gradWrap = colP.addChild("div", { "class" : "colorP_gradWrap unselect"});
	
	var bottom = colP.addChild("div");
	bottom.addChild("div", {"class" : "colorP_disp text_def_N unselect", "style" : "border: 0px; width : 88px; "}).text("Selected Color");
	var selcolordisp = bottom.addChild("div", {"class" : "colorP_disp text_def_N unselect", "style" : " height : 15px; "});
	selcolordisp.dim({wid : 95 });
	var colordisp = bottom.addChild("div", { "class" : "colorP_disp text_def_N"});
	colordisp.style("background-color", selObj.selected);
	selcolordisp.style("background-color", selObj.selected);
	var ar = Nedil.Util.colorRGB(colordisp.style("background-color"));
	colordisp.text(selObj.selected);
	
	var okbtn = bottom.addChild("div", { "style" : "margin-top : 4px; "});
	okbtn.widget("button", {
		text : "&#10004;",
		event : {
			"click" : function() {
				selObj.selected = colordisp.text();
				if(input) {
					obj.element().value = selObj.selected;
				} else {
					if(!fulldisp) {
						obj.style("background-color", selObj.selected);
					}
				}
				selcolordisp.style("background-color", selObj.selected);				
				onsel(selObj.selected);
				close();
			}
		}
	});
	
	selObj.gradArr = []
	for(var i = 0 ; i < (hgt / 2); i++) {
		var grd = gradWrap.addChild("div", { "class" : "colorP_grad"});
		(function() {
			var gr = grd;
			var per = (i / (hgt / 2)) * 100;
			grd.on("mousedown", function() {
				selObj.gradstart = true;
				gradWrap.css("crosshair");
				var col = gr.style("background-color");
				colordisp.style("background-color", col);	
				var revcol = per > 20 ? "#000" : "#fff";
				colordisp.style("color", revcol);
				var colAr = Nedil.Util.colorRGB(gr.style("background-color"));
				var hex = "#" + ("0" + parseInt(colAr[0]).toString(16)).substr(-2).toUpperCase() + ("0" + parseInt(colAr[1]).toString(16)).substr(-2).toUpperCase() + ("0" + parseInt(colAr[2]).toString(16)).substr(-2).toUpperCase();
				colordisp.text(hex);
				oncha(hex);
			});
			grd.on("mousemove", function() {
				if(selObj.gradstart) {
					var col = gr.style("background-color");
					colordisp.style("background-color", col);	
					var revcol = per > 20 ? "#000" : "#fff";
					colordisp.style("color", revcol);
					var colAr = Nedil.Util.colorRGB(gr.style("background-color"));
					var hex = "#" + ("0" + parseInt(colAr[0]).toString(16)).substr(-2).toUpperCase() + ("0" + parseInt(colAr[1]).toString(16)).substr(-2).toUpperCase() + ("0" + parseInt(colAr[2]).toString(16)).substr(-2).toUpperCase();
					colordisp.text(hex);
					oncha(hex);
				}
			});			
		})();
		selObj.gradArr.push(grd);
	}

	if(fulldisp) {
		colP.style("position", "relative");
		colP.dim({ ht : hgt + 40});
		colP.pos({ x : obj.pos().x, y : 0 });
		if(hide) {
			colP.css("hide");
		}
	} else {
		colP.css("no_size");
		colP.dim({ ht : 0});	
		colP.pos({ x : obj.pos().x, y : obj.dim().ht });	
		colP.css("hide");
	}
	
	selObj.show = function() {
		if(!fulldisp) {
			colP.css("-no_size");
			colP.css("-hide");
			colP.pos({ x : obj.pos().x, y : obj.pos().y + obj.dim().ht });
			colP.animate({
				from : {ht : 1},
				to : {ht : hgt + 40}, 	  
				anim : "Dimension.smooth", 
				duration : 500	
			});
		} else if(fulldisp && hide) {
			colP.css("-hide");
		}
	}	
	
	selObj.hide = function() {
		close();
	}	
	
	
	obj.on("click", function() {
		selObj.show();
	});
	
	rgbImg.on("mousedown", function() {
		selObj.start = true;
		rgbImg.css("crosshair");
		if(selObj.start) {
			changeColor(rgbImg.mouse());
		}
	});
	
	Nedil.get(document).on("mouseup", function() {
		selObj.start = false;
		selObj.gradstart = false;
		rgbImg.css("-crosshair");
		gradWrap.css("-crosshair");
	});
	
	rgbImg.on("mousemove", function() {
		if(selObj.start) {
			changeColor(rgbImg.mouse());
		}
	});
	
	var close = function() {
		if(!fulldisp) {
			colP.animate({
				from : {ht : hgt + 40},
				to : {ht : 1}, 	  
				anim : "Dimension.smooth", 
				duration : 500,
				oncomplete : function() {
					colP.css("hide");
					colP.css("no_size");
				}
			});
		}else if(fulldisp && hide) {
			colP.css("hide");
		}
	}
	
	var changeColor = function(pos) {	
	
		pos.x -= 3;
		pos.y -= 1;
		var step = Math.ceil((pos.x+1)/51);
		var itr = pos.x % 51;
		var inc = itr * 5;
		var dec = 255 - inc;
		var per = (hgt - (pos.y+1))/hgt;
		var r,g,b;
		if(step == 1) {
			r = 255; g = inc; b = 0;
		} else if (step == 2) {
			r = dec; g = 255; b = 0;
		} else if (step == 3) {
			r = 0; g = 255; b = inc;
		} else if (step == 4) {
			r = 0; g = dec; b = 255;
		} else if (step == 5) {
			r = inc; g = 0; b = 255;
		} else if (step == 6) {
			r = 255; g = 0; b = dec;
		}
		
		r = Math.round(r * per);
		g = Math.round(g * per);
		b = Math.round(b * per);
		
		var col = "rgb("+ r +","+ g +","+ b +")";
		updateGradient(r, g, b);
		colordisp.style("background-color", col);
		var revcol = "#000";
		if(per < 0.8) {
			var revcol = "#FFF";
		}
		colordisp.style("color", revcol);
		
		var hex = "#" + ("0" + parseInt(r).toString(16)).substr(-2).toUpperCase() + ("0" + parseInt(g).toString(16)).substr(-2).toUpperCase() + ("0" + parseInt(b).toString(16)).substr(-2).toUpperCase();
		colordisp.text(hex);
		oncha(hex);
	}
	
	var updateGradient = function(r, g, b) {
		var rc = Math.round((255 - r)/(hgt/2)).toFixed(0);
		var gc = Math.round((255 - g)/(hgt/2)).toFixed(0);
		var bc = Math.round((255 - b)/(hgt/2)).toFixed(0);
		
		for(var i = 1; i < (hgt/2) ; i++) {
			var grEl = selObj.gradArr[i-1];
			var col = "rgb("+ (r + rc * i) +","+ (g + gc * i) +","+ (b + bc * i) +")";
			grEl.style("background-color", col);
		}
		
			var grEl = selObj.gradArr[(hgt/2)-1];
			grEl.style("background-color", "#ffffff");		
	}

	updateGradient(parseInt(ar[0]), parseInt(ar[1]), parseInt(ar[2]));
	
	selObj.getColor = function() {
		return selObj.selected;
	}
	
	return this;
} 

/*Grid Widget*/
Nedil.Widget.grid = function(el,prop) {
	var obj = Nedil.get(el);
	var selObj = this;
	selObj.server = Nedil.Ajax({url: prop.serverURL, cache: false});
	selObj.firstTime = true;
	selObj.first = 0;
	selObj.records = 0;
	selObj.request = {
		current : "",
		page : 1,
		sort : "",
		order : "asc",
		limit : prop.pages.limit,
		search : "",
		reqtype : "fetch",
		selectRows : [],
		selectKeys : []
	};
	
	selObj.lastSort;
	
	if(prop.data) {
		for(var dt in prop.data) {
			if(prop.data.hasOwnProperty(dt)) {
				selObj.request[dt] = prop.data[dt];
			}
		}
	}
	
	selObj.setData = function(data) {	
		for(var dt in data) {
			if(data.hasOwnProperty(dt)) {
				selObj.request[dt] = data[dt];
			}
		}
	}

	var ref = Nedil.Widget.constants["grid"] ? parseInt(Nedil.Widget.constants["grid"])+1 : 1;
	Nedil.Widget.constants["grid"] = ref;
	var gridRef = "NedilGrid_"+Nedil.Widget.constants["grid"];
	obj = obj.wrapChildren("div", {"id" : gridRef});
	var dil = obj.addChild("div");
	var message = dil.addChild("div" , {"style" : "text-align:center"});
	var dialWid = Nedil.Widget.dialog(dil.element(), {
		head : { 
				title : "Delete ?"
			},
		draggable : true,
		dim : { wid : 300, ht : 150},
		pos : { x : Nedil.get(window).dim().wid/2 - 150, y : Nedil.get(window).dim().ht/2 - 75},	
		modal : true,
		show : false
	});
	
	var addF, editF, addFel, editFel;
	if(Nedil.get("#"+gridRef+" .addform").elems.length) {
	Nedil.get("#"+gridRef+" .addform").style("width", "100%");
		addFel = Nedil.get("#"+gridRef+" .addform").addParent("div");
			var act = addFel.addChild("div", { "style" : "text-align:center; width:100%; background-color: #aaa; padding-top:10px; padding-bottom:10px"});
			var conf = act.addChild("div").element();
			Nedil.Widget.button(conf, {
				text : "Add",
				event : {
					"click" : function() {
						selObj.request.reqtype = "add";
						if(prop.onadd) {
							selObj.request.current = "";
							prop.onadd(selObj.request);
						}
						addF.maximize(true);
						addF.close();
						makeAjaxCall();
					}
				}
			});
			var can = act.addChild("div", {"style" : "margin-left: 20px;"}).element();
			Nedil.Widget.button(can, {
				text : "Cancel",
				event : {
					"click" : function() {
						addF.maximize(true);
						addF.close();
					}
				}
			});
			
		addF = Nedil.Widget.dialog(addFel.element(), {
			head : { 
					title : "Add a New Record"
				},
			dim : { wid : 300, ht : 150},
			pos : { x : 100, y : 0},	
			show : false
		});		

		Nedil.get("#"+gridRef+" .dialog_content .panel_N_child").css("-panel_N_hor");
		Nedil.get("#"+gridRef+" .dialog_content .panel_N_child").style("display", "block");		
		
	}
	
	if(Nedil.get("#"+gridRef+" .editform").elems.length) {
		Nedil.get("#"+gridRef+" .editform").style("width", "100%");
		editFel = Nedil.get("#"+gridRef+" .editform").addParent("div");
			var act = editFel.addChild("div", { "style" : "text-align:center; width:100%; background-color: #aaa; padding-top:10px; padding-bottom:10px"});
			var conf = act.addChild("div").element();
			Nedil.Widget.button(conf, {
				text : "Save",
				event : {
					"click" : function() {
						selObj.request.reqtype = "save";
						if(prop.onsave) {
							prop.onsave(selObj.request);
						}
						editF.maximize(true);
						editF.close();
						makeAjaxCall();
					}
				}
			});
			var can = act.addChild("div", {"style" : "margin-left: 20px;"}).element();
			Nedil.Widget.button(can, {
				text : "Cancel",
				event : {
					"click" : function() {
						editF.maximize(true);
						editF.close();
					}
				}
			});
			
		editF = Nedil.Widget.dialog(editFel.element(), {
			head : { 
					title : "Edit"
				},
			dim : { wid : 300, ht : 150},
			pos : { x : 0, y : 0},	
			show : false,
			layout : "vertical"
		});		

		Nedil.get("#"+gridRef+" .dialog_content .panel_N_child").css("-panel_N_hor");
		Nedil.get("#"+gridRef+" .dialog_content .panel_N_child").style("display", "block");		
	}
	
	prop = prop ? prop : {};
	prop.pages = prop.pages ? prop.pages : {};
	
	prop.search = typeof prop.search != "undefined" ? prop.search : true;

	obj.css("grid_N");
	
	if(prop.dim) {
		obj.dim(prop.dim);
	}
	
	var titl = obj.addChild("div", { "class" : "grid_title active text_def_N"});
	var ti = titl.addChild("span", { "class" : " text_sp unselect"});
	if(prop.title) {
		ti.text(prop.title);
	}
	
	if(prop.search) {
		var srcbtn = titl.addChild("div", { "class" : "grid_title_search"});
		var src = titl.addChild("input", { "type" : "text"});
		var tsrc = src.widget("textbox", {
			watermark : "Search"
		});
		
		srcbtn.on("click", function() {
			selObj.request.search = tsrc.getText();
			selObj.request.reqtype = "fetch";
			makeAjaxCall();	
		});
	}
	
	if(prop.add) {
		var add = titl.addChild("div", { "class" : "grid_add"});
		add.on("click", function() {		
			addF.show(true);
			//addF.maximize(true);
		});
	}

	var tab = obj.addChild("div", { "class" : "grid_table" });
	var footer = obj.addChild("div", { "class" : "grid_footer active" });
	var pageInfo, recordInfo;
	if(prop.pages.limit_option) {
		var drp = titl.addChild("div", { "class" : "grid_drp"});
		titl.addChild("span", { "style" : "float:right; font-weight: normal; font-size : 11px;", "class" : "text_sp unselect", "text" : "Rows / Page"});
		var sour = [];
		
		for(var i = 0, len = prop.pages.limit_option.length; i < len; i++) {
			var el = { value : prop.pages.limit_option[i], text : prop.pages.limit_option[i]};
			if(prop.pages.limit) {
				if(prop.pages.limit == prop.pages.limit_option[i]) {
					el["selected"] = true;
				}
			}
			sour.push(el);
		}

		drp.widget("dropdown", {
			source : sour,		
			dim : { wid : 50},
			onchange : function(val) {
				selObj.request.limit = val;
				selObj.request.page = 1;
				selObj.request.reqtype = "fetch";
				makeAjaxCall();
			}
		});	
		
		recordInfo =  footer.addChild("div", { "class" : "text_def_N unselect grid_record"});
		var las = footer.addChild("div", { "class" : "grid_Last"});
		var nex = footer.addChild("div", { "class" : "grid_Next"});		
		pageInfo =  footer.addChild("div", { "class" : "text_def_N unselect grid_page"});
		var pre = footer.addChild("div", { "class" : "grid_Prev"});
		var fir = footer.addChild("div", { "class" : "grid_First"});		
		
		nex.on("click", function() {
			if(parseInt(selObj.request.page) < parseInt(pageInfo.html().split("/")[1])) {
				selObj.request.page = parseInt(selObj.request.page) + 1;
				selObj.request.reqtype = "fetch";
				makeAjaxCall();
			}
		});
		
		pre.on("click", function() {
			if(parseInt(selObj.request.page) > 1) {
				selObj.request.page = parseInt(selObj.request.page) - 1;
				selObj.request.reqtype = "fetch";
				makeAjaxCall();
			}
		});
		
		fir.on("click", function() {
			selObj.request.page = 1;
			selObj.request.reqtype = "fetch";
			makeAjaxCall();			
		});	

		las.on("click", function() {
			selObj.request.page = parseInt(pageInfo.html().split("/")[1]);
			selObj.request.reqtype = "fetch";
			makeAjaxCall();			
		});			

	}		
		
	tab.dim({ht : obj.dim().ht - (titl.dim().ht + footer.dim().ht) - 4});
	
	var hdDi = tab.addChild("div", {"style" : "overflow:hidden; height : 23px;"});
	var hdDiv = hdDi.addChild("div", {"class" : "head_div"});
	var dtDiv = tab.addChild("div", {"class" : "data_div"});
	
	var len = prop.header.length;
	
	var createHeader = function() {
		var tabhtml = "<table cellpadding='0' cellspacing='0' class='head_table'><tr class='active text_def_N unselect head_th'>";
		
		if(prop.select) {
			tabhtml += "<th  style='width:30px; padding-top: 0px'><input type='checkbox' id='"+gridRef+"_check' /></th>";
		}
		if(prop.edit) {
			tabhtml += "<th  style='width:25px; padding-top: 0px'><div class=''></div></th>";
		}
		if(prop.remove) {
			tabhtml += "<th  style='width:25px; padding-top: 0px'><div class='grid_remove'></div></th>";
		}		
		for(var i = 0; i < len; i++) {
			tabhtml += "<th  style='padding-top: 0px;width:";
			if(prop.header[i]["wid"]) {
				tabhtml += prop.header[i]["wid"]+"px' ";
			} else {	
				tabhtml += "100px' ";				
			}
			if(i == len - 1) {
				tabhtml += "id='"+gridRef+"HeadLast'";
			}			
			if(prop.header[i]["align"]) {
				tabhtml += " align='center' ";
			}
			if(prop.header[i]["sortable"]) {
				tabhtml += " class='grid_sort_head' ";
			}				
			tabhtml += "> <div id='"+gridRef+"_sort_"+prop.header[i]["text"]+"'";
			if(prop.header[i]["sortable"]) {
				tabhtml += "  class='grid_sort_size'><span class='grid_arrow' id='"+gridRef+"_sort_"+prop.header[i]["text"]+"_span'></span";
			}	

			tabhtml += ">"+ prop.header[i]["text"]+"</div></th>";
		}
			
		tabhtml += "</tr></table>";
		hdDiv.html(tabhtml);
		Nedil.get("#"+gridRef+" .grid_sort_size").on("click", function() {
			if(Nedil.self().element().nodeName.toLowerCase() == 'div' || Nedil.self().element().tagName.toLowerCase() == 'div') {
				var id = Nedil.self().element().id;
				var el = id.split("_");
				var headT = el[el.length - 1];
				if(headT === selObj.request.sort) {
					if(selObj.request.order == "asc") {
						selObj.request.order = "desc";
						Nedil.get("#"+id+"_span").css("-arrow_up");
						Nedil.get("#"+id+"_span").css("arrow_down");
					} else {
						selObj.request.order = "asc";
						Nedil.get("#"+id+"_span").css("-arrow_down");
						Nedil.get("#"+id+"_span").css("arrow_up");
					}
				} else {
					selObj.request.sort = headT;
					selObj.request.order = "asc";
					Nedil.get("#"+id+"_span").css("-arrow_down");
					Nedil.get("#"+id+"_span").css("arrow_up");
					if(selObj.lastSort) {
						selObj.lastSort.css("-arrow_down -arrow_up");
					}
				}
				selObj.lastSort = Nedil.get("#"+id+"_span");
				selObj.request.reqtype = "fetch";
				makeAjaxCall();
			}
		});
		return tabhtml;
	}
	
	var createRows = function(data) {
		var tabhtml = "<div><table cellpadding='0' cellspacing='0' class='data_table'>";
		
		var ro = (!selObj.request.limit || data.length < selObj.request.limit) ? data.length : selObj.request.limit;
		for(j = 0; j < ro; j++) {
			tabhtml += "<tr id='"+gridRef+"_"+j+"' class='text_def_N unselect tab_rows";
			
			if( (j % 2) == 0) {
				tabhtml += " tab_odd'>";
			} else {
				tabhtml += " tab_even'>";
			}
			
			if(prop.select) {
				tabhtml += "<td align='center' style='width:30px'><input type='checkbox' id='"+gridRef+"_"+j+"_check'/></td>";
			}
			if(prop.edit) {
				tabhtml += "<td align='center' style='width:25px'><div class='grid_edit'></div></td>";
			}
			if(prop.remove) {
				tabhtml += "<td align='center' style='width:25px'><div class='grid_remove'></div></td>";
			}			
			for(var i = 0; i < len; i++) {
				tabhtml += "<td   style='width:";
				if(prop.header[i]["wid"]) {
					tabhtml += prop.header[i]["wid"]+"px' ";
				} else {
					tabhtml += "100px' ";
				}				
				if(prop.header[i]["align"]) {
					tabhtml += " align='center' ";
				}			
				tabhtml += "><input id='"+gridRef+"_"+j+"HID' type='hidden' value='"+j+"_"+data[j]["key"]+"'/>"+ data[j][prop.header[i]["text"]] + "</td>";
			}				
			tabhtml += "</tr>";
		}
		tabhtml += "</table></div>";
		dtDiv.html(tabhtml);
		Nedil.get("#"+gridRef+" .tab_rows input[type='checkbox']").on("click", function() {
			var clel = Nedil.get(Nedil.self().element().parentNode.parentNode);
			var id = clel.element().getAttribute("id");
			var val = Nedil.get("#"+id+"HID").element().value.split("_");
			var rowId = parseInt(val[0]) + 1;
			var key = val[1];
			if(clel.hasCSSClass("row_selected")) {
				clel.css("-row_selected");
				var pos = selObj.request.selectRows.indexOf(rowId);
				selObj.request.selectRows.splice(pos,1);
				selObj.request.selectKeys.splice(pos,1);
			} else {
				clel.css("row_selected");
				selObj.request.selectRows.push(rowId);
				selObj.request.selectKeys.push(key);
			}
		});

		Nedil.get("#"+gridRef+" .grid_remove").on("click", function() {
			var clel = Nedil.get(Nedil.self().element().parentNode.parentNode);
			var id = clel.element().getAttribute("id");
			var msg;
			var hid = Nedil.get("#"+id+"HID");
			if(hid.elems.length) {
				var val = hid.element().value.split("_");
				var rowId = parseInt(val[0]) + 1;
				var key = val[1];
				clel.css("row_selected");
				msg = "<div> Are you sure you want to delete this record?</div>";
			} else {
				msg = "<div> Are you sure you want to delete the selected records? Please confirm</div>";
			}
			message.html(msg);
			var conf = message.addChild("div", {"style" : "margin:5px; margin-top: 20px;"}).element();
			Nedil.Widget.button(conf, {
				text : "Delete",
				event : {
					"click" : function() {
						if(hid.elems.length) {
							selObj.request.current = key;
						}
						selObj.request.reqtype = "delete";
						if(prop.ondelete) {
							clel.css("-row_selected");
							prop.ondelete(selObj.request);
						}
						//selObj.request.reqtype = "fetch";
						dialWid.close();
						//makeAjaxCall();
					}
				}
			});
			var can = message.addChild("div", {"style" : "margin:5px; margin-top: 20px;"}).element();
			Nedil.Widget.button(can, {
				text : "Cancel",
				event : {
					"click" : function() {
						if(hid.elems.length) {
							clel.css("-row_selected");
						}
						dialWid.close();
					}
				}
			});
			
			dialWid.show();
		});		
		
		Nedil.get("#"+gridRef+" .grid_edit").on("click", function() {
			var clel = Nedil.get(Nedil.self().element().parentNode.parentNode);
			var id = clel.element().getAttribute("id");

			var hid = Nedil.get("#"+id+"HID");
			var val = hid.element().value.split("_");
			var rowId = parseInt(val[0]) + 1;
			var key = val[1];

			selObj.request.current = key;
			if(prop.onedit) {
				prop.onedit(selObj.request);
			}		
			selObj.request.reqtype = "edit";			
			editF.show(true);
			
		});		
		
		
		return tabhtml;
	}
	
	
	createHeader();
	//var dtStr = createRows();

	dtDiv.dim({ht : tab.dim().ht - hdDi.dim().ht});
	//dtDiv.html(dtStr);
	
	selObj.load = function(data) {
		createRows(data);
		if(selObj.firstTime && dtDiv.element().scrollHeight > dtDiv.element().clientHeight) {
			var lasH = Nedil.get("#"+gridRef+"HeadLast");
			var wid = lasH.style("width");
			wid = parseInt(wid) + 15;
			lasH.style("width", wid + "px");
			selObj.firstTime = false;
		}		
	}
	
	dtDiv.on('scroll', function() {
		hdDiv.element().scrollLeft = Nedil.self().element().scrollLeft;
		Nedil.self().element().scrollLeft = hdDiv.element().scrollLeft;
	});
	
	var makeAjaxCall = function() {
		selObj.server.send({
			data : selObj.request, 
			type : "GET",
			datatype : "json",
			async : true,
			success : function(da) {
				selObj.load(da["NedilResponse"]);
				pageInfo.html(da.page + "/" + da.total);
				selObj.records = da["NedilResponse"].length <  selObj.request.limit ? da["NedilResponse"].length : selObj.request.limit;
				selObj.first = ((parseInt(da.page) - 1) * selObj.request.limit) + 1;
				recordInfo.html("Showing " + selObj.first + " - " + (selObj.first + selObj.records -1) + " records");
				selObj.request.selectRows = [];
				selObj.request.selectKeys = [];		
				var check = Nedil.get("#"+gridRef+"_check");
				if(check.elems.length) {
					check.element().checked = false;
				}	
			}, 
			fail : function() {
				dtDiv.html("Some Error has occured. Please retry");
			}
		});
	}
	
	var check = Nedil.get("#"+gridRef+"_check");
	if(check.elems.length) {
		check.on("click", function(){
			selObj.request.selectRows = [];
			selObj.request.selectKeys = []
			if(check.element().checked) {
				for(var i = 0; i < selObj.records; i++) {
					var ch = Nedil.get("#"+gridRef+"_"+i+"_check");	
					ch.element().checked = true;
					var clel = Nedil.get(ch.element().parentNode.parentNode);
					var id = clel.element().getAttribute("id");
					var val = Nedil.get("#"+id+"HID").element().value.split("_");
					var rowId = parseInt(val[0]) + 1;
					var key = val[1];
					selObj.request.selectRows.push(rowId);
					selObj.request.selectKeys.push(key);					
					clel.css("row_selected");
					
				}
			} else {
				for(var i = 0; i < selObj.records; i++) {
					var ch = Nedil.get("#"+gridRef+"_"+i+"_check");
					ch.element().checked = false;
					var clel = Nedil.get(ch.element().parentNode.parentNode);
					clel.css("-row_selected");					
				}			
			}
		});
	}
	makeAjaxCall();	
	return this;
} 



