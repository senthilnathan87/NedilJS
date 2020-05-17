		$.domLoaded( function() {
			var api = ["general","css selector", "event handling", "DOM manipulation", "AJAX","animation","data structures","utility"];
			var wid = ["general","button","textbox","radio","checkbox","dropdown","autocomplete","roll","dialog","panel","accordion","slideshow","calendar","colorpicker","tabs","menu", "progressbar", "slider", "tree", "data grid"];
			var bugMod = $.get("#api");
			
			function change(arr) {
				bugMod.html("");
				for(var i =0, len = arr.length; i < len; i++) {
					bugMod.addChild("option", { "id" : arr[i], "text" : arr[i], "value" : arr[i]});
				}
			}
			change(api);
			
			$.get("form input[type='radio']").on("change", function() {
				if($.self().element().id == "bugon1") {
					change(api);
				} else if($.self().element().id == "bugon2") {
					change(wid);
				}
			});
			
			
			function errorStop(el) {
				var col = "#444444";
				el.animate({
					from : "#dd6655",
					to : col,
					anim : "Color.quad",
					duration : 500, 
					prop : "background-color"
				});
			}
			
			function validateReport() {
				var el1 = $.get("#bug_form #name");
				var el2 = $.get("#bug_form #email");
				var el3 = $.get("#bug_form #msg");
				var suc = true;
				if((el1.element().value).trim() === "") {
					errorStop(el1);
					suc = false;
				}
				if((el2.element().value).trim() === "" || !((el2.element().value).trim()).match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/g) ) {
					errorStop(el2);
					suc = false;
				}
				if((el3.element().value).trim() === "") {
					errorStop(el3);
					suc = false;
				}				
				if(!suc) {
					return false;
				}			
			}
			
			function validateContact() {
				var el1 = $.get("#contact_form #name");
				var el2 = $.get("#contact_form #email");
				var el3 = $.get("#contact_form #msg");
				var suc = true;
				if((el1.element().value).trim() === "") {
					errorStop(el1);
					suc = false;
				}
				if((el2.element().value).trim() === "" || !((el2.element().value).trim()).match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/g) ) {
					errorStop(el2);
					suc = false;
				}
				if((el3.element().value).trim() === "") {
					errorStop(el3);
					suc = false;
				}				
				if(!suc) {
					return false;
				}
			}
			
			$.get("#contact_form").on("submit", function() {
				return validateContact(); 
			});
			
			$.get("#bug_form").on("submit", function() {
				return validateReport(); 
			});
				
			var tab_c = $.get("#tab_cont");
			var roll = $.get("#roller");
			var defPos = roll.pos();
			var hgt = $.get(".content").dim().ht;
			$.get(".about_tab div").on("click", function() {
				var from = tab_c.style("background-color");
				var to = $.self().style("background-color");
				if(from.match(/rgb/gi)) {
					from = from.match(/\d+/g)
				}
				if(to.match(/rgb/gi)) {
					to = to.match(/\d+/g)
				}				

				tab_c.animate({ 
					from :  from, 
					to : to, 	  
					anim : "Color.smooth", 
					duration : 1000, 
					prop : "background-color"
				});
				
				var p =  - (parseInt($.self().element().id.slice(-1)) - 1) * hgt;
				roll.animate({ 
					from :  {y : defPos.y}, 
					to : { y : p }, 	  
					anim : "Location.smooth", 
					duration : 1000,
					oncomplete : function() {
						defPos.y = p;
					}
				});
				
			});
			
			var msgIn = $.get("#msg_info");
			
			if(msgIn.elems.length) {
				msgIn.animate({ 
					from :  1, 
					to : 0, 	  
					anim : "CSS.quint", 
					duration : 7000,
					prop : "opacity",
					oncomplete : function() {
						msgIn.style("display", "none");
					}
				});			
			}
			
			if(show_bug) {
				tab_c.style("background-color", $.get("#tab2").style("background-color"));
				roll.pos({y : -1 * hgt});
				defPos.y = -1 * hgt;
			}
		});
	