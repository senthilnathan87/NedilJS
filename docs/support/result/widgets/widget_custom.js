/*ToolTip widget*/
Nedil.Widget.tooltip = function(el, prop) {

	// widget reference variable
	var self = this;
	
	// set enabled property to true
	self.enabled = true;

	// get tooltip text from element attribute
	var tooltip_text = el.getAttribute("nedil-tooltip");
	
	// convert el to Nedil Object
	var ned_element = $.get(el);
	
	// create tooltip box with tooltip text and attach it to body
	var tooltip = $.get("body").addChild("div", { 
		"class" : "tooltip_box",
		"text"  : tooltip_text
	});
	
	// position the tooltip
	el_pos = ned_element.posAbs();
	tooltip.posAbs({ x : el_pos.x, y : el_pos.y + ned_element.dim().ht});		
	
	// config color
	prop = prop ? prop : {};
	var color = prop.color ? prop.color : "#000";
	tooltip.style("color", color);
	
	// hide tooltip
	tooltip.style("opacity", 0.1);
	tooltip.style("display","none");
	
	// on mouseover, show tooltip	
	ned_element.on("mouseover", function() {
		if(self.enabled) {
			showToolTip();
		}
	});

	// on mouseout, hide tooltip	
	ned_element.on("mouseout", function() {
		if(self.enabled) {
			hideToolTip();
		}
	});
	
	var showToolTip = function() {
	
		// show tooltip
		tooltip.style("display","inline-block");
		
		// position the tooltip
		el_pos = ned_element.posAbs();
		tooltip.posAbs({ x : el_pos.x, y : el_pos.y + ned_element.dim().ht});	
	
		// animate tooltip's opacity to 1
        tooltip.animate({
            from : 0.1,
            to : 1,
            anim : "CSS.smooth",
            prop : "opacity",
            duration : 1000
        });  
	}
	
	var hideToolTip = function() {
	
		// animate tooltip's to blur out
        tooltip.animate({
            from : 1,
            to : 0.1,
            anim : "CSS.smooth",
            prop : "opacity",
            duration : 500,
			oncomplete : function() {
				// hide tooltip
				tooltip.style("display","none");
			}
        });  
	}	
	
	// access apis
	self.disable = function() {
		self.enabled = false;
	}
	
	self.enable = function() {
		self.enabled = true;
	}	
	
	// return self instead of this	
	return self;	
}