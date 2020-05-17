		$.domLoaded( function() {
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
		});