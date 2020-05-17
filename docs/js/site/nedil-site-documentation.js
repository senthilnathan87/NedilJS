$.domLoaded( function() {
	$.get(".sub").dim({ht : 0});
	
	$.get(".main").on("click", function() {
		var id = $.self().element().id;
		var chil = $.get("#sub_"+id);
		var count = $.get("#sub_"+id+" a").elems.length;

		if(count>0) {
			if(chil.hasCSSClass("shown")) {
				chil.animate({
					to : { ht : 0 }, 	  
					anim : "Dimension.smooth", 
					duration : 500,
					oncomplete : function() {
						chil.css("-shown");
					}
				});
			} else {
				chil.animate({
					to : { ht : 28 * count }, 	  
					anim : "Dimension.smooth", 
					duration : 500,
					oncomplete : function() {
						chil.css("shown");
					}
				});
			}
		}
	});
		
	$.get("span .arrow").on("click", function() {
		$.get($.self().element().parentNode).trigger("click");
	});
	
	if($.get(".head .selected").elems.length) {
		var ids = $.get(".head .selected").element().parentNode.id.split("_");
		$.get("#" + ids[1] + "_" + ids[2]).trigger("click");
	}			
	
	$.get(".tabtitle").on("click", function() {
		var id = $.self().element().id;
		var par = $.self().element().parentNode.id;
		$.get("#"+par+" .tabtitle").css("-tabtitle_sel");
		$.self().css("tabtitle_sel");
		$.get("#"+par+" .nedil_code").css("hide");
		var chil = $.get("#"+id+"_pre");
		chil.css("-hide");
		
	});
	
});
