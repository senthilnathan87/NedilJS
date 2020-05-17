$.domLoaded( function() {
	var url = encodeURIComponent(document.URL);
	var title = encodeURIComponent($.get('title').html());
	$.get("#fbshare").element().setAttribute("href","https://www.facebook.com/sharer/sharer.php?u="+url+"&t="+title);
	$.get("#twshare").element().setAttribute("href","https://twitter.com/share?url="+url+"&text="+title);
	$.get("#gpshare").element().setAttribute("href","https://plus.google.com/share?url="+url);
	$.get("#linshare").element().setAttribute("href","http://www.linkedin.com/shareArticle?mini=true&url="+url+"&title="+title+"&summary="+title+"&source=NedilJS");
	
	$.get(".menu").on("mouseover", function() {
		$.self().animate({ 
			from : [255,255,255],
			to :  [100,100,100], 	  
			anim : "Color.smooth", 
			duration : 300, 
			prop : "background-color"
		});
		$.self().animate({ 
			from :  [100,100,100], 
			to :  [255,255,255], 	  
			anim : "Color.smooth", 
			duration : 300, 
			prop : "color"
		});				
	});
	
	$.get(".menu").on("mouseout", function() {
		$.self().animate({ 
			from :  [100,100,100], 
			to : [255,255,255], 	  
			anim : "Color.smooth", 
			duration : 300, 
			prop : "background-color"
		});
		$.self().animate({ 
			from : [255,255,255],
			to :  [100,100,100], 	  
			anim : "Color.smooth", 
			duration : 300, 
			prop : "color"
		});					
	});

	$.get(".share_ic").style("opacity","0.5");
	$.get(".share_ic").on("mouseover", function() {
		$.self().animate({ 
			from :  0.5, 
			to : 1, 	  
			anim : "CSS.smooth", 
			duration : 300, 
			prop : "opacity"
		});
	});
	$.get(".share_ic").on("mouseout", function() {
		$.self().animate({ 
			from :  1, 
			to : 0.5, 	  
			anim : "CSS.smooth", 
			duration : 300, 
			prop : "opacity"
		});
	});	

	$.get("#op_license").on("click", function() {
		window.open("http://www.nediljs.com/license.html","_blank","status=no, menubar=no, toolbar=no, scrollbars=no, resizable=no, top=100, left=300, width=700, height=500");
	});
	
	
	var gitfork = $.get("body").addChild("span");
	gitfork.element().innerHTML = "<a target=\"_blank\" href=\"https://github.com/senthilnathan87/NedilJS\"><img style=\"position: absolute; top: 0; right: 0; border: 0;\" src=\"https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67\" alt=\"Fork me on GitHub\" data-canonical-src=\"https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png\"></a>";
	
});