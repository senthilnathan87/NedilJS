$.domLoaded( function() {
	$.get("#slideshow .text").style("opacity","0.5");
	
	var slidPos = $.get("#slideshow").posAbs().x;
	$.get(window).on("resize", function() {
		slidPos = $.get("#slideshow").posAbs().x;
	});
	$.get(".slides").style("display", "none");

	var slides = [{ "name" : "slide1", "from" : [75,230,100], "col" : [159,199,28] },
				  { "name" : "slide2", "from" : [159,199,28], "col" : [255,199,28] },
				  { "name" : "slide3", "from" : [255,199,28], "col" : [255,75,28] },
				  { "name" : "slide4", "from" : [255,75,28], "col" : [75,240,100] },
				  { "name" : "slide5", "from" : [75,240,100], "col" : [75,50,250] },						 
				  { "name" : "slide6", "from" : [75,50,250], "col" : [75,200,250] },
				  { "name" : "slide7", "from" : [75,200,250], "col" : [75,230,100] }
				];
	
	var cur = -1;
	$.get(".images").pos({ x: 1000});
	$.get(".text").pos({ x: -800});
	
	function slideShow() {
		var pre = cur;
		cur++;
		cur = cur < slides.length ? cur : 0

		if(pre >= 0) {			
			var simg = "#" + slides[pre]["name"] + " .images";
			$.get(simg).animate({ 
				from : { x : slidPos + 350  },
				to : { x: 1000}, 	  
				anim : "Location.bounce.easeout", 
				duration : 500
			});
			
			simg = "#" + slides[pre]["name"] + " .text";
			$.get(simg).animate({ 
				from : { x : slidPos + 30 },
				to : { x: -800}, 	  
				anim : "Location.smooth", 
				duration : 500,
				oncomplete : function() {
					$.get("#" + slides[pre]["name"]).style("display", "none");
					nextSlide(slides[cur]["name"], slides[cur]["from"], slides[cur]["col"]);
				}
			});	

		} else {
			nextSlide(slides[cur]["name"], slides[cur]["from"], slides[cur]["col"]);
		}
		
	}
	slideShow();
	setInterval(slideShow, 6000);

	function nextSlide(slid, frm, col) {
		$.get("#" + slid).style("display", "inline-block");
		$.get("#slideshow").animate({ 
				from :  frm, 
				to : col, 	  
				anim : "Color.smooth", 
				duration : 500, 
				prop : "background-color"
			});
		
		var simg = "#" + slid + " .images";
		$.get(simg).animate({ 
			from : { x : 1000 },
			to : { x: slidPos + 320 }, 	  
			anim : "Location.bounce.easeout", 
			duration : 1000
		});
		
		simg = "#" + slid + " .text";
		$.get(simg).animate({ 
			from : { x : -800 },
			to : { x: slidPos }, 	  
			anim : "Location.smooth", 
			duration : 1000
		});	
	}
	
});