/**
 * Nedil JS - Javascript Library and Framework
 * @author Senthilnathan,A meetsenthilnathan@gmail.com
 * @version 1.0
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014,2015 Senthilnathan,A (meetsenthilnathan@gmail.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* For self execution */
(function(global) {	
   
	/* Extending native objects/methods if not provided by the browsers by default */
	if (!String.prototype.trim) {
		/**
		* Cuts off the extra spaces in a String object
		*
		* @this {String}
		* @returns String with removed external space chars
		*/
		String.prototype.trim = function() {    
		
			return this.replace(/^\s+|\s+$/g, ''); /* Removing the starting and ending space chars */
			
		}
	}

	if (!Array.prototype.indexOf) {
		/**
		* Finds the index of an element in an Array object if there is a match
		*
		* @this {Array}
		* @param 'el' search element
		* @param {number} 'from' points the starting position - optional
		* @returns {number} search element position or -1
		*/
		Array.prototype.indexOf = function(el) {
		
			var arr = this;
			var len = arr.length; /* Fetching Array length and Starting 'from' position */
			var from = Number(arguments[1]) || 0; /* Optional, If from is not provided, defaulted to 0 */

			from = (from < 0) ? from + len : from;

			while(from < len) {
			
				if(from in arr && this[from] === el) {
					return from; /* Returns the position if match is found*/
				}
				
				from ++;
			}
			return -1; /* If no match is found */
			
		}
	  
	}

	/* Variable Nedil - referencing entire Nedil JS framework */
	var Nedil = {

		/* Nedil Global references */
		currentEvent : '', /* Current Event triggered */
		eListener : '',    /* Event Listeners */
		eObjMap : '',      /* Event Listeners and HTML/Objects Mapping */

		/**
		* Function to retrieve HTML elements using CSS selectors
		*
		* @this {Nedil}
		* @param {String} 'cssquery' CSS selector query string
		* @param {Boolean} 'useNative' set this as false to stop using native quesrySelectorAll method, if it exists. Default value is true
		* @returns {Nedil.Objs} Matched HTML elements wrapped by Nedil.Objs
		*/
		get : function(cssquery, useNative) {

			if(cssquery && typeof cssquery == "string" && cssquery.trim() != '') {  /* cssquery validation */
			 
				if(document.querySelectorAll && useNative != false) { /* Using browser default method - Using 'false' to debug get method */
					return new Nedil.Objs(Nedil.Util.Misc.nodeToArray(document.querySelectorAll(cssquery))); /* Returns Nedil.Objs by converting nodelist to array */
				} else {
					/* CSS Type Selectors - Formatter
						Step 1: Remove Spaces before and after [ = | ' " and before ]
						Step 2: Append spaces before and after * , ~ + >
						Step 3: Take characters inside [ ] and find the text between ' ' and replace the spaces with __ (double underscore) and remove the other spaces between []
						   Take characters inside [ ] and replace spaces within ' '(quotes) by __ and remove other spaces
						Step 4: Replace 'Space' characters like tab, space, formfeed, etc with single space
						Step 5: Split the string with 'space'
						CSSarray will have the individual css selectors separated from the querystring
					*/
					var   CSSarray = cssquery.replace(/(\s*(\[|\]|=|\||'|")\s*)/g, function(a){return a.trim()==']' ? a.replace(/^\s+/g,'') :  a.trim()})
											.replace(/(\*|,|~|\+|>)/g, ' $& ')
											.replace(/\[.*?\]/g, function(a){return a.replace(/\'.*\'/g, function(a){return a.replace(/\s+/g,'__');}).replace(/\s+/g,'')})
											.replace(/([\x20\t\r\n\f\v])+/g,' ').trim().split(' ');
				
					var prevnode = [document],  /* Contains Previous Nodes, initial value is [document] */
						finalelems = [],        /* Contains all the matched final elements */
						tree = "";              /* Refers to the parent - child elements tree */
				  
					/* Iterate through each element selector in CSSarray */
					for (var eln = 0, len = CSSarray.length; eln < len; eln++ ) {
						cssel = CSSarray[eln];  /* Each element selector */               
					   
						if(cssel == ',') {	/* If ',' then append prevnode to finalelems and reset prevnode to [document] */
							finalelems = finalelems.concat(prevnode);
							prevnode = [document];                  
						} else if(cssel == '>' || cssel =='~' || cssel =='+') {	/* if '>', '~','+', set tree */               
							tree = cssel;                   
						} else {	/* For remaining css tokens */
							var temp = [];	/* Temporary nodes/elements */
							
							/* Taking every element in prevnode as parent */
							for (var e = 0, l = prevnode.length; e < l; e++ ) {

								/* Finds for attribute selectors and child-selectors. Adds spaces before first [ and between ] and : 
									elems[0] - Has the main CSS selector
									elems[1] - Has the attributes selectors 
									elems[2] - Has the child selector */
								var elems = cssel.replace(/\[/,' $&').replace(/\]:/,'] :').split(' ');
								
								if(elems[1] != undefined) { /* If present, then there is Attribute selector*/
									elems[1] = Nedil.Util.Misc.parseAttr(elems[1]); /* Attributes selectors are converted to JSON and stored in elems[1]*/
								}
								
								/* child selector is appended to the main selector */
								var elm = elems[2] == undefined ? elems[0] : elems[0] + elems[2].trim();
								
								/* Nedil.getElements gets the HTML elements and appends to the already existing elements in temp */
								temp = temp.concat(Nedil.getElements(elm,prevnode[e],elems[1],tree, finalelems.concat(temp)));
							}
							
							/* Resetting the values */
							tree="";
							prevnode = temp; 
						}
						
					}
					
					/* Appending to final elements and returning the Nedil.Objs */
					finalelems = finalelems.concat(prevnode);
					return new Nedil.Objs(finalelems);
				}
			} else if(cssquery != undefined && typeof cssquery != "string"){ /* For document, window */
				return new Nedil.Objs([cssquery]);
			} 	

			/* ERROR condition */
			return null;
			
		},

		/**
		* Function to retrieve HTML elements using direct javascript functions
		*
		* @this {Nedil}
		* @param {String} 'sel' CSS selector query string without attributes
		* @param {HTMLElement} 'prevNode' represents the parent node
		* @param {JSON} 'attrib' lists the attributes in JSON
		* @param {String} 'tree' represents the tree character '>', '~','+'
		* @param {Array} 'finalelems' Array of already matched HTML elements
		* @returns {Array} Array of newly matched HTML elements
		*/
		getElements : function (sel, prevNode, attrib, tree, finalelems) {

			var retArr = [],		/* Contains return Elements */
				currNode = false; 	/* Current Node */
				
			var arr = sel.replace(/[#|\.:]/g,' $&').trim().split(' ');	/* Adds a space before #, . , : and splits them */
			/* Native get methods 0th position - function, 1st position - parameter*/
			var nativeGet = arr[0].match(/[#]/) ? ["getElementById",arr[0].replace(/[#]/,'')] : (arr[0].match(/[\.]/) ? ["getElementsByClassName",arr[0].replace(/[\.]/,'')] : ["getElementsByTagName",arr[0]]);
			var arrlen = arr[arr.length-1].match(/:/) ? arr.length-1 : arr.length;	/* Length excluding child attributes */
			
			/* Appending remaining IDs and Classes as attributes */
			for(var el = 1; el < arrlen; el++) {
				if(attrib == undefined) attrib = {};				
				if (arr[el].match(/[#]/) ) { /* for ID's */
					attrib['id'] = attrib['id'] ? attrib['id'] + " " + arr[el].replace(/[#]/,'') : arr[el].replace(/[#]/,'');
				} else if (arr[el].match(/[\.]/) ) { /* for Class's */
					attrib['class'] = attrib['class'] ? attrib['class'] + " " + arr[el].replace(/[\.]/,'') : arr[el].replace(/[\.]/,'');
				}
			}
			
			var first = false,	/* First child attribute flag */
				last = false,	/* Last child attribute flag */
				nth = -1, 		/* nTh child attribute position */
				coll = null;	/* HTML elements collection array */
				
			if(arrlen != arr.length) {	/* Checks for child attribute */
				if(arr[arr.length-1].match(/:first-child/i)) {
					first = true;
				} else if(arr[arr.length-1].match(/:last-child/i)) {
					last = true;
				} else {
					nth = 0+arr[arr.length-1].match(/:nth-child\((\d+)\)/)[1];
				}
			}
			
			if(tree == '~' || tree == '+') { /* if there is any adjacent/sibling selector, change prevNode to it parent */
				currNode = prevNode;
				prevNode = prevNode.parentNode;
			}
			
			/* get elements using Native Javascript functions */
			if(prevNode[nativeGet[0]]) {
				coll = prevNode[nativeGet[0]](nativeGet[1]);
				if(nativeGet[0] == 'getElementById') {	/* In case of JS get function through ID, change the outcome to Array */
					coll = new Array(coll);
				}
			} else { /* If getElementById and getElementsByClassName functions are unavailable */
				coll = prevNode["getElementsByTagName"]("*");	
				if(attrib == undefined) attrib = {};				
				if (nativeGet[1].match(/[#]/) ) { /* for ID's */
					attrib['id'] = attrib['id'] ? attrib['id'] + " " + nativeGet[1].replace(/[#]/,'') : nativeGet[1].replace(/[#]/,'');
				} else if (nativeGet[1].match(/[\.]/) ) { /* for Class's */
					attrib['class'] = attrib['class'] ? attrib['class'] + " " + nativeGet[1].replace(/[\.]/,'') :  nativeGet[1].replace(/[\.]/,'');
				}
			}

			/* Iterate through each element */
			for(var j = 0, len = coll.length; j < len; j++) {	
				var el = coll[j], 
					hit = true;	/* By default, consider the element as a hit. if there is any miss, hit is changed to false */	

				if(Nedil.Util.Misc.elemMatch(finalelems, el)) {	/* Checking with pre-existing elements */
					hit = false;
				}
				
				/* Look for a miss with the following conditions */
				if(hit && attrib && !Nedil.Util.Misc.matchAttr(el,attrib)) {	/* For attribute selector */
					hit = false;
				}
				if(hit && last && Nedil.Dom.nextSibling(el)) {	/* For last-child selector, check for nextElementSibling presence */
					hit = false;
				}
				if(hit && first && Nedil.Dom.previousSibling(el)) { /* For first-child selector, check for previousElementSibling */
					hit = false;
				}	
				if(hit && nth != -1 && nth != Nedil.Dom.childIndex(el)) {	/* For nth-child selector, find the element child index */
					hit = false;
				}
				if(hit && tree == '>' && el.parentNode != prevNode) {	/* For tree selector '>', check the parentNode */
					hit = false;
				}
				if(hit && tree == '+' && el != Nedil.Dom.nextSibling(currNode) ) { /* For adjacent sibling selector, check for nextElementSibling*/
					hit = false;
				}
				if(hit && tree == '~' && !Nedil.Dom.isSibling(currNode, el) ) { /* For sibling selector, check for elements parent*/
					hit = false;
				}
			
				if(hit) retArr.push(el); /* If no miss, then push the element into retArr */
			}
			
			/* Return retArr to the calling get function */
			return retArr;
		},
		
		/**
		* Function to verify the resultsets of the default css selector and Nedil css selector
		*
		* @this {Nedil}
		* @param {String} 'query' CSS selector query string
		* @returns {Boolean} 'true' - If the matches are equal
		*/
		equalityCheck : function(query) {
			/* If Default selector is unavailable */
			if(!document.querySelectorAll) {
				console.log("ISSUE: Default Selector is unavailable on this browser. Update to a modern browser");
				return false;
			}
			
			var def = Nedil.get(query);	/* Default selector */
			var ned = Nedil.get(query, false);	/* Nedil selector */
			if(def.elems.length != ned.elems.length) {	/* If difference in count */
				console.log("ISSUE: Difference in total elements found \nDefault: " + def.elems.length + "\nNedil: " + ned.elems.length);
				return false;
			}
			for(var i = 0, len = def.elems.length; i < len; i++) {
				if(def.elems[i] != ned.elems[i]) {	/* If mismatch in elements */
					console.log("ISSUE: Elements differ default is " + def.elems[i] + " Nedil is " + ned.elems[i]); 
				}
			}
			return true;
			
		},
				
		/**
		* Collection to create Nedil Objects
		*
		* @this {Nedil}
		* @param {Array} 'init' Array of HTML elements
		*/
		Objs : function(init) {
			
			this.elems = init;	/*	List of HTML elements */
		   
			/**
			* To attach HTML events to HTML elements
			*
			* @this {Nedil.Objs}
			* @param {String} 'ev' Event name
			* @param {function} 'method' Function / method which will be the listener for the events		
			* @returns {Number} Returns eId for refering the attachment of listener to HTML elements with events
			*/	   
			this.on = function(ev, method) {
			   
				if(Nedil.eListener === '') {
					Nedil.eListener = new Nedil.Data.Table({ref:[],fn:[],orig:[]});	/* Create new Table datastructure with reference, function, original fields */
					Nedil.eObjMap = new Nedil.Data.Table({obj:[],ev:[],eId:[]});	/* Create new Table datastructure with object, event, eventId fields */
				}
				
				/*	Listener function */
				var listener = function() {
					Nedil.currentEvent =  global.event || arguments[0];	/* Capture the current event */
					if(method() === false) {	/* Run listener and Incase the listener returns false */
						if (Nedil.currentEvent.preventDefault) {
							Nedil.currentEvent.preventDefault();	/* Prevent further execution, if preventDefault method is available */
						} else if (global.event) { 
							global.event.returnValue = false;	/*	For IE solution */
						}
						 Nedil.currentEvent.stopPropagation();	/* Stop propagating to parents */
					}
				}
				
				var len=this.elems.length;	/* Total selected HTML element */
				/* eListener - Insert ref as len, fn as listener and orig as Method, inserted record returns eId to map with eObjMap */
				var eId = Nedil.eListener.insert({ref:len,fn:listener,orig:method});	
				
				for(var i = 0; i < len; i++) { 
					Nedil.eObjMap.insert({obj:this.elems[i], ev: ev, eId: eId});	/* eObjMap - Insert obj as every HTML element, ev as Event and eId from previous insertion */
					Nedil.Util.addEvent(ev,this.elems[i],listener);	/*	Attach listener with element for the relevant event */
				}
				
				return eId;	/*	Returns the eId - for refering the HTML element events */
				
			}
			
			/**
			* To dettach HTML events from HTML elements
			*
			* @this {Nedil.Objs}
			* @param {String} 'ev' Event name
			* @param {function / Number} 'listener' Function reference / Event ID 		
			*/	  
			this.off = function(ev, listener) {
				
				/* For every element in the collection, dettach listeners from the HTML elements for corresponding events */
				for(var i = 0, len = this.elems.length; i < len; i++) {
					Nedil.Util.removeEvent(ev,this.elems[i],listener);
				} 
			   
			}

			/**
			* To trigger a Nedil JS event
			*
			* @this {Nedil.Objs}
			* @param {String} 'ev' Event name
			* @param {Boolean} 'bubble' If the event needs to be bubbled		
			* @param {Boolean} 'cancel' If the event is cancellable
			*/	 
			this.trigger = function(ev,bubble,cancel) {
			
				var event;
				bubble = bubble != undefined ? bubble : true;	/* default set bubble to true */
				cancel = cancel != undefined ? cancel : true;	/* default set cancel to true */
				
				if (document.createEvent) {	/* For modern browsers */
					event = document.createEvent("HTMLEvents");
					event.initEvent(ev, bubble, cancel);
					this.elems[0].dispatchEvent(event);	/* fire the event */
				} else {	/* For IE */
					event = document.createEventObject();
					event.eventType = ev;
					event.eventName = ev;
					event.memo = { };
					this.elems[0].fireEvent("on" + event.eventType, event); /* fire the event */
				}
				
			}
			
			/**
			* Returns the first element of collection
			*
			* @this {Nedil.Objs}	
			* @returns {HTMLElement} returns first element
			*/	
			this.element = function() {
			
				if(!this.elems.length || this.elems.length == 0) { 
					return this.elems;	
				}
				
				return this.elems[0];	/* Returns first element */
			   
			}
			
			/* Interface */
			var inter = ["pos","posAbs","style","hasCSSClass","css","dim","mouse", "mouseAbs", "html","text","selection","load","ajaxSubmit","toJSON","animate","widget",
						"addChild","addParent","wrapChildren","removeChild", "getChildren", "isChild", "isParent", "nextSibling", "previousSibling", "isSibling","childIndex"];
			/* Implementations Feature -> Function -> Number of parameters */
			var impl = { "Util" : [["pos","1"], ["posABS","1"],["style","2"],["hasCSSClass","1"],["applyCSS","1"],["dim","1"],["mouse","0"],["mouseABS","0"],["html","1"],["text","1"],["selection","2"],["load","0"],["ajaxSubmit","0"],["toJSON","0"]],
						 "Animator" : [["animate","1"]],
						 "Widget" : [["widget","2"]],
						 "Dom" : [["addChild","0"],["addParent","0"],["wrapChildren","0"],["removeChild","0"], ["getChildren","0"], ["isChild","0"], ["isParent","0"], ["nextSibling","0"], ["previousSibling","0"], ["isSibling",0], ["childIndex",0]]
						}					
			var it = 0;	/* Interface counter */
			
			for(var el in impl) {	/* For every feature */
			
				for(var i = 0, len = impl[el].length; i < len; i++) {	/* For every implementation */
					
					/* Appending implentations to the Nedil.Objs using self executing functions */
					this[inter[it]] = (function(ob, method, par, feature) {
						/* Return function */
						return function() {
							var widgRet = [];
						
							for(var j = 0, lenj = this.elems.length; j < lenj; j++) {	/* Executing the function to all elements in the collection */
								
								var arrg = Nedil.Util.Misc.argConvert(arguments,[this.elems[j]]);	/* Appending element to the arguments list */
								var res = "";
								if(feature === "Widget") {
									method = Nedil.Widget[arrg[1]];	/* Change the method to Widget name */
									arrg.splice(1,1);				/* Remove the widget name argument */	
									//arrg[1] = Nedil.Util.cloneJSON(arrg[1]);
								}
								
								if(feature === "Animator") {
									arrg[arrg.length] = (j == lenj - 1) ? true : false;
								}								
								
								res = method.apply(new Nedil.Objs(this.elems[j]),arrg);	/* Run the function with relevant object */
								/*TODO : REMOVED THIS CONDITION for STYLE: || (typeof res != "undefined" && feature != "Widget")*/
								/*UPDATE : added with extra condn */
								if(typeof arguments[par-1] == "undefined"  || (!(j < lenj-1) && typeof res != "undefined" && feature != "Widget") || ( feature == "Widget" && lenj < 2)) {	/* If the final argument is undefined, then return */
									return res;
								}
								
								if(feature == "Widget") {
									widgRet.push(res);
								}
								
							}
							
							if(feature == "Widget" && widgRet.length) {
								return widgRet;
							}							
							
						}
						
					})(this, Nedil[el][impl[el][i][0]], parseInt(impl[el][i][1],10), el); /* Call itself */
					
					it++;	/* Increment the interface counter */
				}
			}
			
		},

		/**
		* Pointer to current HTML element which triggered the event
		*
		* @this {Nedil}
		* @returns {Nedil.Objs} Nedil Object with current event triggered element
		*/
		self : function() {
		
			var evt = Nedil.currentEvent || global.event;	/* Get the current Event */
			var el =  evt.target || evt.srcElement;	/* Get the event source element */
			
			return new Nedil.Objs([el]);	/* Create new Nedil.Objs with selected element*/
			
		},
			
		/* Nedil.Dom - for DOM Manipulations */
		Dom : {
		
			/**
			* Function to add HTML child element to parent with/without child index
			*
			* @this {Nedil.Dom}
			* @param {HTMLElement} 'par' Parent element
			* @param {String} 'child' Child tag eg div or h2
			* @param {JSON} 'prop' JSON object refers to properties of the child. To create textnode use text property
			* @param {Number} 'pos' Index position at which the element has to be inserted
			* @returns {Nedil.Objs} Child Element
			*/
			addChild : function(par, child, prop, pos) {
				child = document.createElement(child);	/* Create element */
				
				if(typeof prop == "number") {
					pos = prop;
					prop = {};
				}
				
				for(pr in prop) {	/* for every property */
				
					if(pr == "text") {
						var t = document.createTextNode(prop[pr]);	/* Create and Attach text node*/
						child.appendChild(t);
					} else {
						child.setAttribute(pr,prop[pr]);	/* Attach other attributes */
					}
					
				}
				
				if(typeof pos == "number") {
					var children = Nedil.Dom.getChildren(par);
					if(pos <= children.elems.length) {
						par.insertBefore(child, children.elems[pos]);
						return new Nedil.Objs([child]);
					}
				} 
				
				par.appendChild(child);	/* Attach element as child to its parent */				
				return new Nedil.Objs([child]);	/* returns child */
			},

			/**
			* Function to add HTML parent element to an element with/without parent index
			*
			* @this {Nedil.Dom}
			* @param {HTMLElement} 'child' Child element
			* @param {String} 'par' Parent tag eg div or h2
			* @param {JSON} 'prop' JSON object refers to properties of the parent. To create textnode use text property
			* @param {Number} 'pos' Index position at which the element has to be inserted as parent
			* @returns {Nedil.Objs} Parent Element
			*/
			addParent : function(child, par, prop, pos) {
				par = document.createElement(par);	/* Create element */
				
				if(typeof prop == "number") {
					pos = prop;
					prop = {};
				}
				
				for(pr in prop) {	/* for every property */
				
					if(pr == "text") {
						var t = document.createTextNode(prop[pr]);	/* Create and Attach text node*/
						par.appendChild(t);
					} else {
						par.setAttribute(pr,prop[pr]);	/* Attach other attributes */
					}
					
				}
				
				pos = (typeof pos == "number") ? pos : 0;			
				
				while(child.parentNode && pos) {
					child = child.parentNode;
					pos--;
				}
				 				
				var suPar = child.parentNode;
				suPar.replaceChild(par, child);
				par.appendChild(child);											
				return new Nedil.Objs([par]);	/* returns parent */
			},
			
			/**
			* Function to add HTML wrapper element to wrap children
			*
			* @this {Nedil.Dom}
			* @param {HTMLElement} 'par' Child element
			* @param {String} 'wrap' wrapper tag eg div or h2
			* @param {JSON} 'prop' JSON object refers to properties of the parent. To create textnode use text property
			* @returns {Nedil.Objs} Wrapper Element
			*/
			wrapChildren : function(par, wrap, prop) {
				wrap = document.createElement(wrap);	/* Create element */
				
				for(pr in prop) {	/* for every property */
				
					if(pr == "text") {
						var t = document.createTextNode(prop[pr]);	/* Create and Attach text node*/
						wrap.appendChild(t);
					} else {
						wrap.setAttribute(pr,prop[pr]);	/* Attach other attributes */
					}
					
				}
				
				var children = Nedil.Dom.getChildren(par, true);
				Nedil.Util.forEach(children.elems, function( el ) {
					wrap.appendChild(el);
				});
						
				par.appendChild(wrap);		
				return new Nedil.Objs([wrap]);	/* returns wrappen element */
			},
			
			/**
			* Function to remove HTML child elements from parent
			*
			* @this {Nedil.Dom}
			* @param {HTMLElement} 'par' Parent element
			* @param {Nedil.Objs} 'child' Nedil Objs HTML elements
			* @returns {Number} Total number of child elements removed
			*/		
			removeChild : function(par, child) {
			
				var delCh = 0;	/* Counter for deleted children */
		
				for(var j = 0, lenj = child.elems.length; j < lenj; j++) {	/* for every child */
					
					if(Nedil.Dom.isChild(child.elems[j], par)) {	/* check child - parent bond */
						child.elems[j].parentNode.removeChild(child.elems[j]);	/* remove element */
						delCh++;	/* increment counter*/
					}
					
				}
				
				return delCh;	/* Return total number of removed child elements */
			},

			/**
			* Function to get all children of a HTML parent element
			*
			* @this {Nedil.Dom}
			* @param {HTMLElement} 'par' Parent element
			* @param {Boolean} 'direct' true says to fetch only immediate children
			* @returns {Nedil.Objs} All child elements
			*/	
			getChildren : function(par, direct) {
			
				direct = direct ? ">" : ""
				return new Nedil.Objs(Nedil.getElements("*", par, {}, direct, [])); /* get all child elements and return */
				
			},
			
			/**
			* Function to get next sibling of a HTML element
			*
			* @this {Nedil.Dom}
			* @param {HTMLElement} 'el' HTML element
			* @returns {HTMLElement} returns the next sibling element
			*/			
			nextSibling : function(el) {
			
				if(typeof el.nextElementSibling != "undefined") {	/* if nextElementSibling function is available */
					return el.nextElementSibling;
				} else {
					el = el.nextSibling;	/* iterate through nextSibling till it's nodetype is 1 */
					
					while(el && el.nodeType !== 1) {
						el = el.nextSibling; 
					}
					
					return el;
				}
				
			},

			/**
			* Function to get previous sibling of a HTML element
			*
			* @this {Nedil.Dom}
			* @param {HTMLElement} 'el' HTML element
			* @returns {HTMLElement} returns the previous sibling element
			*/			
			previousSibling : function(el) {
			
				if(typeof el.previousElementSibling != "undefined") {	/* if previousElementSibling function is available */
					return el.previousElementSibling;
				} else {
					el = el.previousSibling;	/* iterate through previousSibling till it's nodetype is 1 */
					
					while(el && el.nodeType !== 1) {
						el = el.previousSibling; 
					}
					
					return el;
				}
				
			},

			/**
			* Function to test whether two elements are sibling
			*
			* @this {Nedil.Dom}
			* @param {HTMLElement} 'el1' first HTML element
			* @param {HTMLElement} 'el2' second HTML element
			* @returns {Boolean} returns true if both elements are siblings
			*/		
			isSibling : function(el1, el2) {
			
				if(el1 && el2) {	/* if parents of the two elements are same, return true */
					return el1.parentNode == el2.parentNode;
				}
				return false;
			},

			/**
			* Function to find child position index
			*
			* @this {Nedil.Dom}
			* @param {HTMLElement} 'el' first HTML element
			* @returns {Number} returns child position starts from 1
			*/		
			childIndex : function(el) {
			
				var pos = 0;	/* position of the child */
				
				do {
					pos++;
					el = Nedil.Dom.previousSibling(el);	/* get previous HTML sibling */
				} while(el);	/* iterate till no sibling is found and increment the index counter*/
				
				return pos;	/* return position index */
				
			},
			
			/**
			* Function to test child parent link
			*
			* @this {Nedil.Dom}
			* @param {HTMLElement} 'child' child HTML element
			* @param {HTMLElement} 'par' parent HTML element		
			* @returns {Boolean} returns 'true' if child parent link is there
			*/			
			isChild : function(child, par) { 
			
				child = child.parentNode;
				
				do {	/* iterate though child's parent and if match found return as true */
					
					if(child == par) {
						return true;
					}
					
					child = child.parentNode;
				} while (child);
				
				return false;	/* if no match is found, return false*/
				
			},
			
			/**
			* Function to test parent child link
			*
			* @this {Nedil.Dom}
			* @param {HTMLElement} 'par' parent HTML element		
			* @param {HTMLElement} 'child' child HTML element		
			* @returns {Boolean} returns 'true' if parent child link is there
			*/			
			isParent : function(par, child) {
			
				return Nedil.Dom.isChild(child, par);	/* return isChild functions result */
				
			}
		},
		 
		/* Nedil.Util - Utility variable for all the support functions needed	*/
		Util : {
		 
			/**
			* Function to attach events and listeners to HTML element
			*
			* @this {Nedil.Util}
			* @param {String} 'ev' HTML Javascript events
			* @param {HTMLElement} 'ob' HTML element to which the events needs to be attached
			* @param {function} 'listener' Event Listener
			*/
			addEvent : function(ev, ob, listener) {
			
				if(ob.addEventListener) {	/* if addEventListener function is available*/
					ob.addEventListener(ev,listener,false);
				} else if(ob.attachEvent) {	/* for old IE browsers*/
					ob.attachEvent("on"+ev, listener);
				}
			
			},
		 
			/**
			* Function to remove event listeners from HTML element
			*
			* @this {Nedil.Util}
			* @param {String} 'ev' HTML Javascript events
			* @param {HTMLElement} 'ob' HTML element to which the events needs to be attached
			* @param {Number or function} 'listener' Event Id or Event Listener function - optional
			*/
			removeEvent : function(ev, ob, listener) {
			
				var lIds = [];	/* Listener IDs from Nedil.eListener */
				
				if(listener) {	/* if Listener is provided*/
				
					if(typeof listener == "number") {	/* if listener is number, push it to the lIds */
						lIds.push(listener);
					} else if(typeof listener == "function") {	/* if function */
					
						var lrs = Nedil.eListener.select(["id"],{orig:listener});	/* select id from eListener table where orig = listener */

						for(var i=0; i <lrs.length; i++) {
							lIds.push(lrs[i].getValue("id"));	/*	push all the mapped ids into lIds */
						}
					}
				   
				}
				/* select id, eId from eObjMap where obj = ob and ev = ev */
				var rs = Nedil.eObjMap.select(["id","eId"],{obj:ob, ev:ev});

				for(var i=0; i <rs.length; i++) {	/* for each row */
					/* If lIds, then check for lIds in eId of rs, then proceed. If no lIds, the proceed */
					var proceed = lIds.length > 0 ? ( lIds.indexOf(rs[i].getValue("eId"))>-1 ? true : false ) : true;
					
					if(proceed) {
						var eRs = Nedil.eListener.select(["ref", "fn"],{id:rs[i].getValue("eId")});	/* select ref, fn from eListener where id = eId in rs[i] */
						var ref = eRs[0].getValue("ref")-1;	/* decrease the reference by 1 */
						var fn = eRs[0].getValue("fn");
						
						if(ob.removeEventListener) {	/* remove the event listener */
							ob.removeEventListener(ev,fn,false);
						} else if(ob.detachEvent) {	/* for old IE */
							ob.detachEvent("on"+ev, fn);
						}
						
						if(ref > 0) { /* if any reference is left, update new ref */
							Nedil.eListener.update({ref:ref},{id:rs[i].getValue("eId")}); 
						} else {	/* else, remove from eListener */
							Nedil.eListener.remove({id:rs[i].getValue("eId")});
						}
						
						Nedil.eObjMap.remove({id:rs[i].getValue("id")});	/* remove from event and object map table */
					}
				}

			},
		 
			/**
			* Function to iterate over the elements of an array and runs a function using each element
			*
			* @this {Nedil.Util}
			* @param {Array} 'ar' source array
			* @param {function} 'fn' function to be executed for each array element
			* @param {Array} Returns the updated array
			*/
			forEach : function(ar, fn) {
			
				for(var i = 0,len = ar.length, res; i < len; i++) {
					res = fn(ar[i]);	/* run the function using every array element as argument */
					
					if(typeof res != "undefined") {
						ar[i] = res;	/* store the return value into the array */
					}
				}
				return ar;	/* return the array */
			},

			/**
			* Function to return or change innerHTML of an element
			*
			* @this {Nedil.Util}
			* @param {HTMLElement} 'el' HTML source element
			* @param {String} 'cont' new innerHTML content - Optional
			* @returns {String} Returns innerHTML
			*/
			html : function (el, cont) {
			
				if(el) {
				
					if(typeof cont === "string" || typeof cont === "number") {						
						try {	/* to avoid IE bugs */
							el.innerHTML = cont;
						} catch(ex) {}
					}
					
					return el.innerHTML;
				}
				
				return "";
				
			},

			/**
			* Function to return or change innerText of an element
			*
			* @this {Nedil.Util}
			* @param {HTMLElement} 'el' HTML source element
			* @param {String} 'cont' new innerHTML content - Optional
			* @returns {String} Returns innerText
			*/			
			text : function (el, cont) {
			
				if(el) {
				
					if(typeof cont === "string" || typeof cont === "number") {
					
						if(el.innerText) {
							try {	/* to avoid IE bugs */
								el.innerText = cont;
							} catch(ex) { }
						} else if(el.textContent) {
							el.textContent = cont;
						} else {
							Nedil.Util.html(el, cont);
						}
						return cont;
					}
					
					return el.innerText || el.textContent;
				}
				
				return "";
			},        
		 
			/**
			* Function to load a HTML element with content from the server through AJAX
			*
			* @this {Nedil.Util}
			* @param {HTMLElement} 'el' HTML source element
			* @param {String} 'url' Points to the server for AJAX request
			* @param {Function} 'fn' Function which will be executed using the AJAX response and returned value will be used to load the HTML element - Optional
			* @param {JSON} 'param' Parameters for the AJAX request call - Optional
			*/
			load : function (el, url, param, succ) {
			
				if(el) {
					
					/* conditions to check 3 parameters are 4 parameters */
					if (arguments.length == 3 && typeof param === "function") {
						succ = param;
						param = {};
					}					
					
					/* fn will load data from AJAX call. Earlier processing can be done by sending */
					var fn = succ ? function(data) { Nedil.Util.html(el,succ(data)) } : function(data) { Nedil.Util.html(el,data) };
					Nedil.Ajax({"url": url}).send({"data": param, "success" : fn})	/* Nedil AJAX api call*/
				}
				
			},  

			/**
			* Function to submit a HTML form through AJAX
			*
			* @this {Nedil.Util}
			* @param {HTMLElement} 'el' HTML source form element
			* @param {Function} 'succ' Function which will be executed using the AJAX response
			*/		
			ajaxSubmit : function (el, succ) {
			
				if(el) {
					var param = Nedil.Util.toJSON(el);	/* Converts HTML form input elements into parameters */
					var url = el.action;	/* Form action is taken as URL */
					var type = el.method ? el.method.toUpperCase() : "GET";	/* Form method is taken as type */
					Nedil.Ajax({"url": url}).send({"type": type, "data": param, "success" : succ})	/* Nedil AJAX api call */
				}
				
			},

			/**
			* Function to convert HTML form input elements into JSON
			*
			* @this {Nedil.Util}
			* @param {HTMLElement} 'el' HTML source element
			* @returns {JSON} Returns the converted JSON form elements and values
			*/		
			toJSON : function(el) {
			
				var param = {};
				
				if(el) {
					var inps = el.getElementsByTagName("input");   /* Get all form input elements */ 
					
					for(var i = 0; i <inps.length; i++) {
					
						if(inps[i].name) {
							param[inps[i].name] = inps[i].value;	/* convert to JSON with name : value pairs */
						}
						
					}
					
				}
				
				return param;  /* return form input JSON */
			},
		
			/**
			* Dimension Class with wid, ht and unit properties
			*/			
			Dimension : function() {

				this.wid = 0;
				this.ht = 0;
				this.unit = 'px';
				
			},

			/**
			* Position Class with x, y and unit properites
			*/				
			Position : function() {
			
				this.x = 0;
				this.y = 0;
				this.unit = 'px';
				
			},

			/**
			* MousePosition class with x and y properties
			*/	
			MousePosition : function() {
			
				this.x = 0;
				this.y = 0;
				
			},

			/**
			* Function to return the Absolute position of a HTML element
			*
			* @this {Nedil.Util}
			* @param {HTMLElement} 'el' HTML element to which Absolute position to be found out
			* @param {Position} 'nPos' New position of the HTML element - Optional
			* @returns {Position} Absolute position of the element
			*/			
			posABS : function (el, nPos) {
			
				var po = new Nedil.Util.Position();	/* Create a new position object */
				
				if(el) {
				
					if(typeof nPos === "object") {	/* If new position */
						var res = arguments.callee(el);	/* Call the same method to get the current position */
						
						if(Nedil.Util.style(el,"position") === "static") {	/* if position is static, set it to relative */
							Nedil.Util.style(el,"position","relative");	
						}
						
						Nedil.Util.strToInt(nPos,res);	/* convert nPos strings to exact integers */
						po.x =  res.x;
						po.y = res.y;
						
						if(typeof nPos.x == "number") {	/* x position - Subtract any left style applied */
							res.x = nPos.x - (res.x - Nedil.Util.Misc.getNum(Nedil.Util.style(el, "left")));
							if(Nedil.Util.style(el,"position") === "absolute") {
								res.x = nPos.x;
							}
							Nedil.Util.style(el, "left" , res.x+"px");
							po.x =  nPos.x;                  
						}
						
						if(typeof nPos.y == "number") {	/* y position - Subtract any top style applied */
							res.y = nPos.y - (res.y - Nedil.Util.Misc.getNum(Nedil.Util.style(el, "top")));
							if(Nedil.Util.style(el,"position") === "absolute") {
								res.y = nPos.y;
							}							
							Nedil.Util.style(el, "top" , res.y+"px");
							po.y = nPos.y;
						}
						
					} else {
					
						if(Nedil.Util.style(el,"position") === "absolute") {	/* if position is static, set it to relative */
							po.x = Nedil.Util.Misc.getNum(Nedil.Util.style(el, "left"));
							po.y = Nedil.Util.Misc.getNum(Nedil.Util.style(el, "top"));
						}	else {
							do {	/* iterate till last parent to get the absolute position */
								po.x += Nedil.Util.Misc.getNum(el.offsetLeft);
								po.y += Nedil.Util.Misc.getNum(el.offsetTop);
							} while (el = el.offsetParent);
						}
					}
				}
				
				return po;	/* returns current or new position */
				
			},

			/**
			* Function to return the relative position of a HTML element
			*
			* @this {Nedil.Util}
			* @param {HTMLElement} 'el' HTML element to which Absolute position to be found out
			* @param {Position} 'nPos' New position of the HTML element - Optional
			* @returns {Position} Relative position of the element
			*/				
			pos : function(el, nPos) {	/* TODO : scroll postions  */
			
				var po = new Nedil.Util.Position();	/* Create a new position object */
				
				if(el) {
					if(typeof nPos === "object") { /* If new position */
						var res = arguments.callee(el);	/* Call the same method to get the current position */

						if(Nedil.Util.style(el,"position") === "static") {	/* if position is static, set it to relative */
							Nedil.Util.style(el,"position","relative");	
						}
						
						Nedil.Util.strToInt(nPos,res);	/* convert nPos strings to exact integers */
						po.x =  res.x;
						po.y = res.y;
						
						if(typeof nPos.x == "number") {	/* x position - Subtract any left style applied */		
							res.x = nPos.x - (res.x - Nedil.Util.Misc.getNum(Nedil.Util.style(el, "left")));
							Nedil.Util.style(el, "left" , res.x+"px");
							po.x =  nPos.x;                  
						} 
						
						if(typeof nPos.y  == "number") { /* y position - Subtract any top style applied */
							res.y = nPos.y - (res.y - Nedil.Util.Misc.getNum(Nedil.Util.style(el, "top")));
							Nedil.Util.style(el, "top" , res.y+"px");
							po.y = nPos.y;
						}
						
					} else {	/* Getting relative position */

						/* if parentNode is the offsetParent */
						if(el.parentNode && (el.parentNode === el.offsetParent)) {	
							po.x = el.offsetLeft;
							po.y = el.offsetTop;
						} else {
							po.x = el.parentNode ? el.offsetLeft - el.parentNode.offsetLeft : el.offsetLeft;
							po.y = el.parentNode ? el.offsetTop - el.parentNode.offsetTop : el.offsetTop;
						}
						
						po.x = Nedil.Util.Misc.getNum(po.x);
						po.y = Nedil.Util.Misc.getNum(po.y);
					}
				}
				
				return po;	/* Return current or new position */
				
			},

			/**
			* Function to return the dimension of a HTML element including border and padding
			*
			* @this {Nedil.Util}
			* @param {HTMLElement} 'el' HTML element to which dimension to be found out
			* @param {Dimension} 'nDim' New dimension of the HTML element - Optional
			* @returns {Dimension} Dimension of the element
			*/
			dim : function(el, nDim) {
			
				if(el == window || el == document) {	/* if window or document */
					return Nedil.Util.Misc.dimWindowDoc(el);
				}
				
				var di = new Nedil.Util.Dimension();	/* Create new Dimension object */
				
				if(el) {
					if(typeof nDim === "object") {	/* if new dimension */
						var res = arguments.callee(el);
						
						if(!Nedil.Util.style(el,"display") || Nedil.Util.style(el,"display") === 'inline') {
							Nedil.Util.style(el,"display","inline-block");
						}
						
						Nedil.Util.strToInt(nDim,res);	/* Changing string values to integer values */ 
						di.wid =  res.wid;
						di.ht = res.ht;
						
						if(typeof nDim.wid == "number") {	/* setting width */
							var extrWid = (Nedil.Util.Misc.getNum(Nedil.Util.style(el, "padding-left")) + Nedil.Util.Misc.getNum(Nedil.Util.style(el, "padding-right"))+Nedil.Util.Misc.getNum(Nedil.Util.style(el, "border-left-width"))+Nedil.Util.Misc.getNum(Nedil.Util.style(el, "border-right-width")));
							res.wid = nDim.wid - extrWid;	/* new width - extra width */
							res.wid = res.wid < 0 ? di.wid - extrWid : res.wid;
							Nedil.Util.style(el, "width" , res.wid+"px");
							di.wid =  res.wid + extrWid;                  
						}
						
						if(typeof nDim.ht  == "number") {	/* setting height */
							var extrHt = (Nedil.Util.Misc.getNum(Nedil.Util.style(el, "padding-top"))+Nedil.Util.Misc.getNum(Nedil.Util.style(el, "padding-bottom"))+Nedil.Util.Misc.getNum(Nedil.Util.style(el, "border-top-width"))+Nedil.Util.Misc.getNum(Nedil.Util.style(el, "border-bottom-width")));
							res.ht = nDim.ht - extrHt;	/* new height - extra height */
							res.ht = res.ht < 0 ? di.ht - extrHt : res.ht;
							Nedil.Util.style(el, "height" , res.ht+"px");
							di.ht = res.ht + extrHt; 
						}
						
					} else {	/* get current dimension */
						di.wid = Nedil.Util.Misc.getNum(el.offsetWidth);
						di.ht = Nedil.Util.Misc.getNum(el.offsetHeight);
					}
				}
				return di; 
				
			},

			/**
			* Function to return mouse position in the browser page
			*
			* @this {Nedil.Util}
			* @returns {MousePosition} Mouse position in the browser
			*/
			mouseABS : function () {
			
				var mp = new Nedil.Util.MousePosition();	/* Create a new MousePosition object */	
				ev = Nedil.currentEvent || global.event;	/* Get the current event */
				
				if (ev.pageX) {
					mp.x = ev.pageX;
					mp.y = ev.pageY;
				}  else if (ev.clientX) {
					mp.x = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					mp.y = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
				}
				
				return mp;	/* returns mouse position on the page */
				
			},

			/**
			* Function to return mouse position on the particular HTML element
			*
			* @this {Nedil.Util}
			* @param {HTMLElement} 'el' HTML element source for mouse events 
			* @returns {MousePosition} Mouse position relative to an element
			*/			
			mouse : function (el) {
			
				var mp = Nedil.Util.mouseABS();	/* Find mouse absolute position */
				
				if(el) {
					var p = Nedil.Util.posABS(el);	/* Find elements absolute position*/
					mp.x -= p.x;	/* Find the difference to get relative position */
					mp.y -= p.y;
				}
				
				return mp         
				
			},

			/**
			* Function to convert between string input "+300+, "-300" into actual values
			*
			* @this {Nedil.Util}
			* @param {JSON} 'list' JSON with String/integer values
			* @param {JSON} 'org' Original JSON with integer value
			*/				
			strToInt : function(list, org) {
			
				for(var key in list) {
				
					if(typeof list[key] == "string") {	/* if value is string, then check + or - sign precedes the string*/
						var st = list[key];
						var symb = st.charAt(0);	/* symbol + or - */
						var val = parseInt(st.substring(1,st.length),10);
						
						if(symb === "+") {	/* Add or subtract from original value depending upon the sing */
							list[key] = org[key] + val;
						} else if (symb === "-") {
							list[key] = org[key] - val;
						} else {
							list[key] = parseInt(st);
						}
					}
					
				}
			},
			
			/**
			* Function to style HTML elements using css
			*
			* @this {Nedil.Util}
			* @param {HTMLElement} 'el' HTML element 
			* @param {String} 'sty' Style name in CSS text
			* @param {String} 'val' New style value
			* @returns {String} Style value
			*/				
			style : function(el, sty, val) {
			
				var res = el.style[sty] ? el.style[sty] : null;	/* get style value */
				
				if(!res) {	/* If style is empty or cannot be fetched directly */
					
					if (el.currentStyle) {	/* Get currentStyle */
						res = el.currentStyle[sty];
					} else if (global.getComputedStyle) {	/* or ComputedStyle */
						res =  document.defaultView.getComputedStyle(el,null).getPropertyValue(sty);
					}	
					
				}
	//FIX			
				if(!res) {	/* If style format is not "hyphen-nated"  */
					var st = sty.split("-");
					sty = st[0];
					
					for(var i = 1; i < st.length; i++) {	/* Upper CamelCase the styles */
						sty += st[i].charAt(0).toUpperCase() + st[i].slice(1);
					}
				
					if (el.currentStyle) {	/* Get currentStyle */
						res = el.currentStyle[sty];
					} else if (global.getComputedStyle) {	/* or ComputedStyle */
						res =  document.defaultView.getComputedStyle(el,null).getPropertyValue(sty);
					}	
					
				}
	//FIX			
				if(val && (!(""+val).match(/NaN/))) {	/* if value needs to be changed */
				
					if(sty == "opacity") {	/* For old IE Opacity */
						el.style["zoom"] = 1;
						el.style["filter"] = "alpha(opacity="+val*100+")";
					}
					/* Set style of the element */
					if(el.style && el.style.setProperty) {
						try {
							el.style.setProperty(sty,val,null);
						} catch(ex) {
							el.style[sty] = val;
						}
					} else {
						el.style[sty] = val;
					}
					
					return val;	/* return new style value */
				} 				
				
				return res;	/* Return current or new style value */
				
			},

			/**
			* Function to check whether the element has specific CSS class
			*
			* @this {Nedil.Util}
			* @param {HTMLElement} 'el' HTML element 
			* @param {String} 'clas' CSS class search string
			* @returns {Boolean} 'true' if the there is match else 'false'
			*/			
			hasCSSClass : function(el, clas) {
			
				var res = el.className.match(new RegExp("(?:^|\\s)"+clas.trim()+"(?!\\S)","g"));	/* look for the match */
				return res ? true : false;	/* return true / false */
				
			},
			
			/**
			* Function to change css of HTML elements
			*
			* @this {Nedil.Util}
			* @param {HTMLElement} 'el' HTML element 
			* @param {String /  JSON} 'css' css styles in JSON format or css class name
			*/			
			applyCSS : function(el, css) {
			
				if(typeof css == "object") {	/* If Object, iterate and set style */
				
					for(st in css) {
						Nedil.Util.style(el,st,css[st]);
					}
					
				} else if(typeof css == "string") {	/* If class names are given */
					var clas = css.split(" ");	/* split the class name using space */
					
					for(var n=0, len = clas.length; n < len; n++) {	/* for every class name*/
						var op = clas[n].charAt(0);	/* look for any operator + (add) or - (remove) */
						
						if(op == "-") {	/* if - operator */
							clas[n] = clas[n].substr(1); /* get the class name without the operator */
							/* Find the class name and replace it with empty string */
							el.className = el.className.replace(new RegExp("(?:^|\\s)"+clas[n]+"(?!\\S)","g")," ").trim();
						} else {
							
							if(op == "+") {
								clas[n] = clas[n].substr(1);	/* Get the class name without operator */
							}
							/* if class is empty or class doesnt contain new class name, then attach */
							if(el && (!el.className || !el.className.match(new RegExp("(?:^|\\s)"+clas[n]+"(?!\\S)","g")))) {
								el.className += " "+clas[n].trim();
							}
						}
					}
				}
			},

			/**
			* Function to get color style value in an array
			*
			* @this {Nedil.Util}
			* @param {String} 'col' Color value with rgb() format
			* @returns {Array} returns an array of integers in RGB ranging between 0 to 255
			*/				
			colorRGB : function(col) {
						
				return (""+col).match(/\d+/g);	/* returns matched array of digits in the color css string */
				
			},

			/**
			* Function to get text selection from a input field
			*
			* @this {Nedil.Util}
			* @param {HTMLElement} 'el' HTML element 
			* @returns {JSON} returns an JSON with start index, end index and selected text in a text selection
			*/			
			selection : function(el) {
			
				var createRange = function() {	/* Create Range Object - Crossbrowser */
					
					var range;
					
					if(global.getSelection) {	/* if window.getSelection function is available */
						var sel = global.getSelection();	/* Gets the selection (selected text) */
					
						if(sel.getRangeAt) {	
							range =  sel.getRangeAt(0);	/* Gets range from 0 */
						} else { 
							range = document.createRange();
							range.setStart(sel.anchorNode, sel.anchorOffset);	/* set start using first selected node and starting position */
							range.setEnd(sel.focusNode, sel.focusOffset);	/* set end using last selected node and ending position */
						}
						
					} else if (document.selection) { 	/* else create using document.selection */
						range = document.selection.createRange();
					}   
					
					return range;
				}

				if(el.focus) {	/* move focus to the element */
					el.focus();
				}
				
				var res = {	
					start : 0,	/* start index */
					end : 0,	/* stop index */
					text : ""	/* selected text */
				};            

				if ('selectionStart' in el) {	/* if el has "selectionStart" property, then set start, end and selected text */
					res.start = el.selectionStart;
					res.end = el.selectionEnd;
					res.text = el.value.substring(res.start, res.end);
				} else {
					var ra = createRange();								/* create Range object */
					selText = el.createTextRange();						/* Create Text Range object */
					selText.moveToBookmark(ra.getBookmark());
					res.text = selText.text;							/* Get selected text */
					var totalLen = el.value.replace(/\n/g,"").length;	/* Get total text length */
					var selLen = res.text.replace(/\n/g,"").length;		/* Get selected text length */
					res.start = res.end = totalLen;						/* resetting start and end to total length*/
					last = el.createTextRange();
					last.collapse(false);								/* moves the point to end of the range */

					if (selText.compareEndPoints("StartToEnd", last) == -1) {	/* start of selected text is before the end of complete text */
						res.start = totalLen - selText.moveStart("character", totalLen);	/* start = total length - units moved from selection */
						res.end = res.start + selLen;	/* end = start + selected text length */
					} 

				}

				return res;	/* return result */
			},

			/**
			* Function to convert Hex values in string to rgb in arrays
			*
			* @this {Nedil.Util}
			* @param {String} 'col' Color Hex values in string with preceeding # with both 3 chars or 6 chars representation
			* @returns {Array} returns a Array of rgb numeric values
			*/
			convertHexRGB  : function(col) {
			
				if(typeof col == "string") {
					col = col.substr(1);	/* truncate # from the string */
				
					if(col.length == 3) {	/* if 3 chars, make it 6 chars representation */
						var r = col.substring(0,1);	
						var g = col.substring(1,2);
						var b = col.substring(2,3);
						col = r+r + g+g + b+b;
					}
					
					var r = parseInt(col.substring(0,2), 16);	/* convert to int with 16 as base since hex value for red */
					var g = parseInt(col.substring(2,4), 16);	/* convert to int with 16 as base since hex value for green */
					var b = parseInt(col.substring(4,6), 16);	/* convert to int with 16 as base since hex value for blue */
					return [r, g, b];	/* return r,g,b array */     
				}
				
				return col;            
			},
			
			/**
			* Function to clone a JSON Object with less complexity
			*
			* @this {Nedil.Util}
			* @param {JSON} 'obj' Source JSON Object
			* @returns {JSON} returns a clone of source JSON object
			*/
			cloneJSON  : function(obj) {
				
				var clone = {};	/* clone object*/
				
				if(typeof obj != "object") {	/* if not object, return */
					return obj;
				}
				
				for(el in obj) {	
					clone[el] = arguments.callee(obj[el]);	/* call self with new object or element */			
				}
				
				return clone;
				
			},

			/* Miscellaneous functionalities */
			Misc : {
			
				/**
				* Function to compare attributes with 
				*
				* @this {Nedil.Util.Misc}
				* @param {HTMLElement} 'elem' HTML element 
				* @param {JSON} 'attrib' JSON list with attributes and values				
				* @returns {Boolean} returns true if there is a match else false
				*/			
				matchAttr : function(elem, attrib) {
				
					var	sp = [],		/* match character */
						elatt;			/* attribute value */
						
					for (var att in attrib) {
					
						if(sp = att.match(/(\*|\||~|\^|\$)$/)) {	/* if type has *,|,~,^,$, set sp and elatt */
							elatt = att.substring(0,sp['index']);
							sp = sp[0];							
						} else {
							elatt = att;
						}
						
						if(attrib[att] == null) {	/* if attribute is set without value */
							if(elem.getAttribute(elatt) == null) {
								return false;
							}
						} else if(sp && elem.getAttribute(elatt)!= null) {	/* special attribute selector*/
						
								if(sp == '~' && !(' '+elem.getAttribute(elatt)+' ').match(new RegExp("\\s"+attrib[att]+"\\s"))) {	/* space separated value */
									return false;
								} else if(sp == '|' && !('-'+elem.getAttribute(elatt)+'-').match(new RegExp("-"+attrib[att]+"-"))) { /* hyphen separated value */
									return false;
								} else if(sp == '*' && !(elem.getAttribute(elatt)).match(new RegExp(attrib[att]))) {	/* somewhere in the value */
									return false;
								} else if(sp == '^' && !(elem.getAttribute(elatt)).match(new RegExp("^"+attrib[att]))) {	/* value starts with */
									return false;
								} else if(sp == '$' && !(elem.getAttribute(elatt)).match(new RegExp(attrib[att]+"$"))) {	/* value ends with */
									return false;
								}    
								
						} else if(elem.getAttribute(elatt) != attrib[att]) {	/* direct value */
								return false;
						}
					}
					
					return true;	/* return success status */
					
				},

				/**
				* Splits the css selector attributes and arranges as JSON
				*
				* @this {Nedil.Util.Misc}
				* @param {String} 'attrib' CSS attribute selectors
				* @returns {JSON} object of attributes
				*/
				parseAttr : function(attrib) {

					var attJSON = {};
					/* Add space before [ and split by 'spaces', will result into separate attributes */
					var elems = attrib.replace(/\[/g,' $&').trim().split(' ');	

					for(var el = 0, len = elems.length; el < len; el++) {
						/* replace __ with spaces and remove [,] and split by = */
						var attr = elems[el].trim().replace(/__/g,' ').replace(/\[|\]/g,'').split('=');	

						/* Remove " and ' in the attribute value and if value is not present, assign null */
						attJSON[attr[0]] = attr[1] ? attr[1].replace(/\"|\'/g,'') : null;	
					}

					return attJSON;

				},

				/**
				* Checks for a HTML element in existing list
				*
				* @this {Nedil.Util.Misc}
				* @param {Array} 'avail' Array of HTML elements
				* @param {HTMLElement} 'el' Search HTML element
				* @returns {Booolean} true if there is a match, else false
				*/
				elemMatch : function(avail, el) {
				
					for(var i=0,len=avail.length; i<len; i++) {	/* iterate for every element and check */
					
						if(avail[i]===el) { 
							return true;
						}
						
					}
					
					return false;
					
				},

				/**
				* Function to return a numeric rounded off value from a string
				*
				* @this {Nedil.Util.Misc}
				* @param {String} 'val' Number values in string format
				* @returns {Number} returns 0 if NAN or else rounded off value
				*/
				getNum : function(val) {
				
					var nu = parseFloat(val);
					return isNaN(nu) ? 0 : Math.round(nu);
					
				},

				/**
				* Function to source HTML element to the argument list
				*
				* @this {Nedil.Util.Misc}
				* @param {Array} 'arg' Number values in string format
				* @param {Array} 'def' Number values in string format
				* @returns {Array} returns Array of argument with HTML element at 0th position
				*/				
				argConvert : function(arg, def) {
				
					for(var i = 0, len = arg.length; i < len; i++) {
						def.push(arg[i]);
					}

					return def;
				},
				
				/**
				* Function to limit the color value 0 - 255
				*
				* @this {Nedil.Util.Misc}
				* @param {Number} 'col' Color value in number
				* @returns {Number} returns newly limited color value if out of range
				*/				
				limitColor : function(col) {
				
					return  parseInt((col < 0) ? (255 + col) : ((col > 255) ? (col - 255) : col),10);
					
				},				

				/**
				* Function to convert HTML nodes to Array of HTML elements
				*
				* @this {Nedil.Util.Misc}
				* @param {HTMLNodes} 'node' nodes of HTML elements
				* @returns {Array} returns Array of HTML elements
				*/					
				nodeToArray : function(node) {
				
					var retArr = [];
					
					if(Array.prototype.slice && node instanceof Object) {	/* If array slice function is available */
						retArr = Array.prototype.slice.call(node,0);
					} else {
					
						for (var i=0,len = node.length; i<len; i++) {	/* iterate and assign */
							retArr[i] = node[i];
						}
						
					}
					
					return retArr;	/* return converted HTML element array */
				},				

				/**
				* Function to get dimension of window and document 
				*
				* @this {Nedil.Util.Misc}
				* @param {HTMLElement} 'el' window or document element
				* @returns {Nedil.Util.Dimension} return the dimension
				*/					
				dimWindowDoc : function(el) {
				
					var di = new Nedil.Util.Dimension();	/* Create new Dimension object */
					
					if(el == window) {				/* widnow */
						di.wid = el.innerWidth;
						di.ht = el.innerHeight;
					} else if(el == document) {		/* document */
						var doc = el.documentElement || el.body || el.getElementsByTagName('body')[0];
						di.wid = doc.clientWidth,
						di.ht = doc.clientHeight;						
					}
					
					return di;	/* return dimension */
				}
				
			}

		},
		 
		/* Nedil.Animator - Animation API */
		Animator : {
				
			/* Animation constants in Nedil Animation API */
			AnimConstants : {
				NedilController : null,		/* Nedil Animation Controller */
				timeSlice : 80,   			/* time gap between executions */
				animId : 1					/* Animation ID iterator */
			},

			/**
			* Class to create Nedil Animation controller - Singleton
			*
			* @this {Nedil.Animator}
			*/				
			Controller : function() {
			
				var animList = [];	/* Animation queue property */
				this.timer;			/* Animation timer */

				/**
				* Function to add animation component to the existing list
				*
				* @this {Nedil.Animation.Controller}
				* @param {Nedil.Animator.AnimLib} 'animObj' a New AnimLib object 
				*/
				this.addComp = function(animObj) {
					
					if(animObj.repeat && animObj.repeat != 0 && animObj.repeat != -1) {	/* if animation repeat is there, then decrement it by 1 */
						animObj.repeat -= 1;
					}
					
					return animList.push(animObj);	/* Push the AnimLib object to queue */
					
				}

				/**
				* Function to add animation component to the existing list
				*
				* @this {Nedil.Animation.Controller}
				* @param {Nedil.Animator.AnimLib} 'animObj' a New AnimLib object 
				*/				
				this.start = function() { 
				
					/* start the timer with animate function and timeslice */
					if(!this.timer) {	
						this.timer = setInterval(this.animate, Nedil.Animator.AnimConstants.timeSlice);  
					}
					
				}

				/**
				* Function to animate the Anim Objects in the queue
				*
				* @this {Nedil.Animation.Controller}
				*/					
				this.animate = function() {
					
					for(var i = 0, len = animList.length; i < len; i++) {	/* for every Animation Object in the queue */

						if(!animList[i].doAnim()) {		/* Run the next frame and check the result, false -> End of Animation */
							callback = animList[i].callback;

							if(animList[i].repeat && animList[i].repeat != 0) {	/* if repeat, then decrement and create new Anim Object */
								if(animList[i].repeat != -1) {
									animList[i].aProp.repeat--;	
								}
								Nedil.Animator.AnimConstants.NedilController.addComp(new Nedil.Animator.AnimLib(animList[i].aProp));
							}
							
							animList.splice(i,1);	/* remove Anim Object and decrement index and length */
							i--;
							len--;
							
							if(callback != '-') {	/* call callback function at the end of animation */
								callback();
							}
							
						}
						
					}
					
					if(animList.length == 0) {	/* if the queue is empty, reset the timer and stop Animation looping */
						clearInterval(this.timer);
						this.timer = null;
					}      
					
				}

				/**
				* Function to stop repeating the animation using id
				*
				* @this {Nedil.Animation.Controller}
				* @param {Number} 'id' Animation id 
				*/					
				this.stopRepetition = function(id) {
				
					for(var i = 0, len = animList.length; i < len; i++) {
					
						if(animList[i].aProp.groupId == id) {	/* setting repeat attribute to 0 for all specific animations */
							animList[i].repeat = 0;
						}
						
					}
					
				}
				
				/**
				* Function to stop Animation using id
				*
				* @this {Nedil.Animation.Controller}
				* @param {Number} 'id' Animation id 
				*/					
				this.stop = function(id) {
				
					for(var i = 0; i < animList.length; i++) {

						if(animList[i].aProp.groupId == id) {	/* remove the animation comps from list */
							animList.splice(i,1);
							i--;
						}
						
					}
					
				}
				
			},

			/**
			* Class to create Nedil Animation controller - Singleton
			*
			* @this {Nedil.Animator}
			* @param {JSON} 'prop' Animation properties
			*/				
			AnimLib : function(prop) {
				
				/* Setting up Animation properties */
				this.aProp    = prop;										/* All properties */
				this.obj      = prop.obj;									/* Animation Object */
				this.begin    = new Date;									/* Marking animation begin time */
				this.duration = prop.duration ? prop.duration : 1000;		/* Animation duration in ms, default is 1000 ms */
				this.started  = false;										/* Animation status */
				this.range    = 0;											/* Animation percentage */
				this.to       = {};											/* Target position */
				this.property = prop.prop;									/* CSS property of the element */
				this.repeat   = prop.repeat ? prop.repeat : 0;				/* Number of times repeating the animation */
				this.callback = prop.oncomplete ? prop.oncomplete : '-';	/* Function to call at the completion */
				this.onframe  = prop.onframe ? prop.onframe : false;		/* Function to execute for every frame */
				var animMtd   = prop.anim.split('.');						/* Split animation functions by . */
				this.anim     = animMtd[0];									/* Basic animation function */
				this.type     = animMtd[1];									/* Type of Path */
				this.ease     = (animMtd[2] && animMtd[2] != "return") ? animMtd[2] : false;		/* Easing method */
				this.ret      = (animMtd[2] && animMtd[2] === "return") ? "returnObj" : ((animMtd[3] && animMtd[3] === "return") ? "returnObj": false) ;	/* return option */
				
				/* Setting from property */
				if(animMtd[0] === "Location") {
					this.from = prop.from ? prop.from : Nedil.Util.pos(prop.obj);   
				} else if(animMtd[0] === "Dimension") {
					this.from = prop.from ? prop.from : Nedil.Util.dim(prop.obj);                                    
				} else if(animMtd[0] === "Color") {
					var fr = prop.from ? Nedil.Util.convertHexRGB(prop.from) : Nedil.Util.style(prop.obj, prop.prop);
					if(typeof fr == "string" && fr.match(/rgb/gi)) {
						fr = Nedil.Util.colorRGB(fr)
					}				
					this.from = Nedil.Util.convertHexRGB(fr);
					this.to = Nedil.Util.convertHexRGB(prop.to);
				}  else if(animMtd[0] === "CSS") {
					this.from = prop.from ? prop.from : parseInt(Nedil.Util.style(prop.obj, prop.prop),10);
					this.to = prop.to;
				}

				/* Setting up 'to' with addition or deduction of values in string format */
				for(key in prop.to) {
				
					if(typeof prop.to[key] == "string") {
						var st = prop.to[key];
						var symb = st.charAt(0);
						var val = parseInt(st.substring(1,st.length),10);
						
						if(symb === "+") {
							this.to[key] = this.from[key] + val;
						} else if (symb === "-") {
							this.to[key] = this.from[key] - val;
						}
						
					} else if (typeof prop.to[key] == "number") {
						this.to[key] = prop.to[key];
					}
					
				}
				
				/**
				* Function to execute Animation to next frame
				*
				* @this {Nedil.Animator.AnimLib}
				* @returns {Boolean} 'true/false' Returns the result of Animation frame for every success
				*/
				this.doAnim = function() {
					return this[this.anim]();
				}

				/**
				* Function to do Location / Position based Animation 
				*
				* @this {Nedil.Animator.AnimLib}
				* @returns {Boolean} 'true/false' Returns the result of Animation frame for every success
				*/
				this.Location = function() {
				
					var frame;	/* for every frame, new animated percent value */
					var res = {};	/* new position */
					this.timePercent = (new Date - this.begin ) / this.duration;	/* Time gap in a range between 0 and 1 */

					if (this.timePercent > 1) {
						this.timePercent = 1;
					}

					if(this.ret) {	/* if return - 2 way */
					
						if(this.ease) {	/* if any easing */
							frame =  this.Path[this.ret](this.Path[this.type], this.timePercent, this.Path[this.ease]);
						} else {
							frame = this.Path[this.ret](this.Path[this.type], this.timePercent);
						}
						
					} else {	/* if one way */
					
						if(this.ease) {
							frame =  this.Path[this.ease](this.Path[this.type],this.timePercent); 
						} else {
							frame = this.Path[this.type](this.timePercent);
						}
						
					}
					
					/* for x (Horizontal) Animation */
					if(typeof this.to.x == "number") {
					
						if(this.ret && this.timePercent > 0.5) {	/* if 2 ways, and after half time */
							res.x = this.to.x + this.Support.getFrames(frame, this.to.x, this.from.x);
						} else {
							res.x = this.from.x + this.Support.getFrames(frame, this.to.x, this.from.x);
						}
						
					}
					/* for y (Vertical) Animation */
					if(typeof this.to.y == "number") {
						
						if(this.ret && this.timePercent > 0.5) {	/* if 2 ways, and after half time */
							res.y = this.to.y + this.Support.getFrames(frame, this.to.y, this.from.y);
						} else {
							res.y = this.from.y + this.Support.getFrames(frame, this.to.y, this.from.y);
						}
						
					}                  

					/* Set new position of the object */
					if(this.aProp.absolute) {
						Nedil.Util.posABS(this.obj, res);	
					} else {
						Nedil.Util.pos(this.obj, res);	
					}

					if(this.onframe) {	/*	Execute on each frame callback function */
						this.onframe();
					}

					if (this.timePercent == 1) {	/* End of Animation, return false */
						return false;
					}                  

					return true;	/* return true for successful animation */
				}

				/**
				* Function to do Dimension / Size based Animation 
				*
				* @this {Nedil.Animator.AnimLib}
				* @returns {Boolean} 'true/false' Returns the result of Animation frame for every success
				*/				
				this.Dimension = function() {
				
					var frame;	/* for every frame, new animated percent value */
					var res = {};	/* new size */
					this.timePercent = (new Date - this.begin ) / this.duration;	/* Time gap in a range between 0 and 1 */

					if (this.timePercent > 1) {
						this.timePercent = 1;
					}

					if(this.ret) {	/* if return - 2 way */
					
						if(this.ease) {	/* if any easing */
							frame =  this.Path[this.ret](this.Path[this.type], this.timePercent, this.Path[this.ease]);
						} else {
							frame = this.Path[this.ret](this.Path[this.type], this.timePercent);
						}
						
					} else {	/* if one way */
					
						if(this.ease) {
							frame =  this.Path[this.ease](this.Path[this.type],this.timePercent); 
						} else {
							frame = this.Path[this.type](this.timePercent);
						}
						
					}
					
					/* for wid (Width) Animation */
					if(typeof this.to.wid == "number") {
					
						if(this.ret && this.timePercent > 0.5) {	/* if 2 ways, and after half time */
							res.wid = this.to.wid + this.Support.getFrames(frame, this.to.wid, this.from.wid);
						} else {
							res.wid = this.from.wid + this.Support.getFrames(frame, this.to.wid, this.from.wid);
						} 
						
					}
					/* for ht (Height) Animation */
					if(typeof this.to.ht == "number") {
					
						if(this.ret && this.timePercent > 0.5) {	/* if 2 ways, and after half time */
							res.ht = this.to.ht + this.Support.getFrames(frame, this.to.ht, this.from.ht);
						} else {
							res.ht = this.from.ht + this.Support.getFrames(frame, this.to.ht, this.from.ht);
						} 
						
					}                  

					Nedil.Util.dim(this.obj, res);	/* Set new size of the object */

					if(this.onframe) {	/*	Execute on each frame callback function */
						this.onframe();
					}

					if (this.timePercent == 1) {	/* End of Animation, return false */
						return false;
					}                  

					return true;	/* return true for successful animation */
				}

				/**
				* Function to do Color based Animation with particular css color property 
				*
				* @this {Nedil.Animator.AnimLib}
				* @returns {Boolean} 'true/false' Returns the result of Animation frame for every success
				*/				
				this.Color = function() {
				
					var frame;	/* for every frame, new animated percent value */
					var res = [];	/* new color */
					this.timePercent = (new Date - this.begin ) / this.duration;	/* Time gap in a range between 0 and 1 */

					if (this.timePercent > 1) {
						this.timePercent = 1;
					}

					if(this.ret) {	/* if return - 2 way */
					
						if(this.ease) {	/* if any easing */
							frame =  this.Path[this.ret](this.Path[this.type], this.timePercent, this.Path[this.ease]);
						} else {
							frame = this.Path[this.ret](this.Path[this.type], this.timePercent);
						}
						
					} else {	/* if one way */
					
						if(this.ease) {
							frame =  this.Path[this.ease](this.Path[this.type],this.timePercent); 
						} else {
							frame = this.Path[this.type](this.timePercent);
						}
						
					}
					
					if(typeof this.to == "object") {
						if(this.ret && this.timePercent > 0.5) {	/* if 2 ways, and after half time */
							res[0] = Nedil.Util.Misc.limitColor(parseInt(this.to[0],10) + this.Support.getFrames(frame, this.to[0], this.from[0]));
							res[1] = Nedil.Util.Misc.limitColor(parseInt(this.to[1],10) + this.Support.getFrames(frame, this.to[1], this.from[1]));
							res[2] = Nedil.Util.Misc.limitColor(parseInt(this.to[2],10) + this.Support.getFrames(frame, this.to[2], this.from[2]));
							
						} else {	
							res[0] = Nedil.Util.Misc.limitColor(parseInt(this.from[0],10) + this.Support.getFrames(frame, this.to[0], this.from[0]));
							res[1] = Nedil.Util.Misc.limitColor(parseInt(this.from[1],10) + this.Support.getFrames(frame, this.to[1], this.from[1]));
							res[2] = Nedil.Util.Misc.limitColor(parseInt(this.from[2],10) + this.Support.getFrames(frame, this.to[2], this.from[2]));
						}
					}

					Nedil.Util.style(this.obj, this.property, "rgb("+ parseInt(res[0],10)+","+ parseInt(res[1],10)+","+parseInt(res[2],10)+")");	/* Set new color */

					if(this.onframe) {	/*	Execute on each frame callback function */
						this.onframe();
					}

					if (this.timePercent == 1) {	/* End of Animation, return false */
						return false;
					}                  

					return true;	/* return true for successful animation */
				}

				/**
				* Function to do Animation with particular css numeric property 
				*
				* @this {Nedil.Animator.AnimLib}
				* @returns {Boolean} 'true/false' Returns the result of Animation frame for every success
				*/					
				this.CSS = function() {
					
					var frame;	/* for every frame, new animated percent value */
					var res;	/* new color */
					this.timePercent = (new Date - this.begin ) / this.duration;	/* Time gap in a range between 0 and 1 */

					if (this.timePercent > 1) {
						this.timePercent = 1;
					}
					
					if(this.ret) {	/* if return - 2 way */
					
						if(this.ease) {	/* if any easing */
							frame =  this.Path[this.ret](this.Path[this.type], this.timePercent, this.Path[this.ease]);
						} else {
							frame = this.Path[this.ret](this.Path[this.type], this.timePercent);
						}
						
					} else {	/* if one way */
					
						if(this.ease) {
							frame =  this.Path[this.ease](this.Path[this.type],this.timePercent); 
						} else {
							frame = this.Path[this.type](this.timePercent);
						}
						
					}
					
					if(typeof this.to == "number") {
					
						if(this.ret && this.timePercent > 0.5) {	/* if 2 ways, and after half time */
							res = this.to + this.Support.getFrames(frame, this.to, this.from);
						} else {
							res = this.from + this.Support.getFrames(frame, this.to, this.from);
						}      
						
					}

					if (this.property != "opacity") {	/* if non opacity property, append 'px' */
						res += "px";
					}
				
					Nedil.Util.style(this.obj, this.property, res);	/* Set new value for the style */

					if(this.onframe) {	/*	Execute on each frame callback function */
						this.onframe();
					}

					if (this.timePercent == 1) {	/* End of Animation, return false */
						return false;
					}                  

					return true;	/* return true for successful animation */
				}               

				/* Nedil.Animator.Path - Type and Easing */
				this.Path = {

					/* returns linear time range */
					linear : function(time) {
						return time;
					},

					/* returns accelrated time range - slow to fast */
					grow : function(time) {
						return time*time; 
					},

					/* returns accelrated time range in cubic */
					cubic : function(time) {
						return time*time*time;
					},

					/* returns accelrated time range in quadratic */
					quad : function(time) {
						return Math.pow(time,4);
					},
					
					/* returns accelrated time range in quintic */
					quint : function(time) {
						return Math.pow(time,5);
					},

					/* returns accelrated time range in circular - slow fast slow */
					circ : function(time) {
						return 1 - Math.sin(Math.acos(time));
					},

					/* returns time range in sine wave form */
					sine : function(time) {
						return Math.sin(time * Math.PI * 0.5)
					},

					/* returns time range similar to sine wave form with smooth transition */
					smooth : function(time) {
						return 0.5 - 0.5 * Math.cos( Math.PI * time);
					},

					/* easing out - Reverses the easein which is the default */
					easeout : function(pathFn, time) {
						return 1 - pathFn(1-time);   
					},

					/* starts with easein and ends with easeout */
					easeinout : function(pathFn, time) {
						return (time <= 0.5) ? pathFn(2*time)/2 : (2 - pathFn(2*(1-time)))/2;   
					},

					/* starts with easeout and ends with easin */
					easeoutin : function(pathFn, time) {
						return (time <= 0.5) ? (0.5 - pathFn(2*(0.5 - time))/2 ): ( 0.5 + Math.abs(pathFn(2*(time - 0.5))/2));   
					},

					/* brings the animation back to initial state after half time */
					returnObj : function(pathFn, time, ease) {
					
						if(ease) {	/*if easing*/
							return (time <= 0.5) ? (ease(pathFn, time*2)) : (-(ease(pathFn, 2*(time - 0.5))));  
						}
						
						return (time <= 0.5) ? (pathFn(time*2)) : (-(pathFn(2*(time - 0.5))));
						
					},
							
					/* bounces the animation with 4 jumps, stays within allowed space , slow - fast */		
					bounce : function(time, itr) {
						var amp = 2.75 * time;
						if(time >= 0.636363636) {
							return 1 - Math.pow(2.75 - amp , 2); 
						} else if(time >= 0.272727273) {
							return 0.25 - Math.pow(1.25 - amp , 2); 
						} else if(time >= 0.090909091) {
							return 0.0625 - Math.pow(0.5 - amp , 2); 
						} else {
							return 0.015625 - Math.pow(0.125 - amp , 2);
						}
					},

					/* reverse the direction initially and proceed to normal animation , slow - fast */
					back : function(time, amp) {
						
						if(!amp) {
							amp = 1.5	/* TODO: should be adjustible in future versions */
						}
						return time * time * (amp*(time - 1)  + time)
						
					},

					/* similar to bounce but goes in the opposite direction also, goes out of space, slow - fast */
					elastic : function(time, amp) {
						
						if(!amp) {
							amp = 1.5;	/* TODO: should be adjustible in future versions */
						}
						return Math.pow(2, 10 * (time-1)) * Math.cos(6.6666667*Math.PI*amp/time);
						
					}  

				}

				/* Animation Support functions */
				this.Support = {
				
					/**
					* Function to get next frame with time percent and from and to difference 
					*
					* @this {Nedil.Animator.AnimLib.Support}
					* @param {Number} 'cur' current frame in terms of time percentage within 0 - 1
					* @param {Number} 'to' target / to position in numbers 
					* @param {Number} 'from' initial / from position in numbers 			
					* @returns {Number} 'true/false' Returns the result of Animation frame for every success
					*/					
					getFrames : function(cur, to, from) {
					
						return (to - (from ? from : 0)) * cur;	/* find difference between to and from and multiply with timepercent */
						
					}
					
				}

			},

			/**
			* Function to animate the objects. External interface to the Animation API
			*
			* @this {Nedil.Animator}
			* @param {HTMLElement} 'obj' Animated HTML element
			* @param {JSON} 'opt' Animation properties
			* @param {Boolean} 'true' to start the animation
			* @returns {Number} Animation ID		
			*/				
			animate : function(obj, opt, start) {
			
				var newOpt = Nedil.Util.cloneJSON(opt);	/* clone the JSON object for multiple instances */
				
				newOpt.obj = obj;	/* Attach HTML Element as obj */
				newOpt.groupId = ++Nedil.Animator.AnimConstants.animId;	/* Assign a group animation ID */

				if(!Nedil.Animator.AnimConstants.NedilController) {	/* if the Animation Controller in unavailable, create one */
					Nedil.Animator.AnimConstants.NedilController = new Nedil.Animator.Controller();
				}

				/* Create AnimLib object with options and add animation component to the controller */
				var id = Nedil.Animator.AnimConstants.NedilController.addComp(new Nedil.Animator.AnimLib(newOpt));
				
				if(start) {	/* if start is true */
					Nedil.Animator.AnimConstants.NedilController.start();	/* start Animation */
					return Nedil.Animator.AnimConstants.animId;				/* return Animation ID */
				}
				
			},

			/**
			* Function to stop repeating the animation for a specific ID
			*
			* @param {Number} 'id' Animation ID
			* @this {Nedil.Animator}
			*/				
			stopRepeat : function(id) {
				
				Nedil.Animator.AnimConstants.NedilController.stopRepetition(id);
				
			},
			
			/**
			* Function to stop the animation for a specific ID
			*
			* @param {Number} 'id' Animation ID
			* @this {Nedil.Animator}
			*/				
			stop : function(id) {
				
				Nedil.Animator.AnimConstants.NedilController.stop(id);
				
			},
			
			/**
			* Function to stop all the animations
			*
			* @this {Nedil.Animator}
			*/				
			stopAllAnimation : function() {
			
				clearInterval(Nedil.Animator.AnimConstants.NedilController.timer);
				Nedil.Animator.AnimConstants.NedilController.timer = null;
				
			}

		},

		/* Nedil.Ajax - Ajax API */
		/**
		* Function to call AJAX apis
		*
		* @this {Nedil}
		* @param {JSON} 'data' JSON of needed info for making Ajax call
		* @returns {Nedil.Ajax.ajaxFactory} returns Ajax factory object
		*/			
		Ajax : function(data) {
			
			/**
			* Class factory for creating Ajax objects
			*
			* @this {Nedil.Ajax}
			* @param {JSON} 'data' JSON of needed info for making Ajax call
			*/	
			var ajaxFactory = function(data) {
				
				var url = data.url;		/* Ajax URL */
				var xhr = global.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");	/* Cross browser XML HTTP Request object */
				var cache = data.cache ? data.cache : false;	/* to enable cache, default is false */

				/**
				* Class factory for creating Ajax objects
				*
				* @this {Nedil.Ajax.ajaxFactory}
				* @param {JSON} 'param' JSON of parameters to be sent in the Ajax call
				*/				
				this.send = function(param) {
				
					param        = param ? param : {};										/* ajax parameters */					
					var type     = param.type ? param.type : "GET";							/* Ajax request type, default is GET */
					var datatype = param.datatype ? param.datatype : "text";				/* Ajax datatype, default is text */
					var paramStr = this.firstChar();										/* gets first character for URL string ? or & */					
					paramStr    += param.data ? this.formURLParamString(param.data) : "";	/* if parameters are present, append with correct format */
					paramStr    += !cache ? "NedilAjaxId=" + new Date().getTime()+"&" : "";	/* if cache is not needed, append NedilAjaxId with time */
					var async 	 = param.async ? param.async : true;						/* get async, default is true */
					
					var suc,					/* success function */
						fail,					/* failure function */
						callback = "";			/* general callback for JSONP */
						
					if(datatype === "jsonp") {	/* for JSONP */
					
						/* if callback is not provided, create a new function called NedilJSONPCallBack+time */
						callback = param.callback ? param.callback : "NedilJSONPCallBack" + new Date().getTime();
						
						if(!param.callback) {	/* if the callback function is not created, use success function, else return*/
							global[callback] = param.success ? param.success : function() { return ; };
						}
						
						paramStr += "callback="+callback;	/* append callback with URL string */
						
						/* create script object, attach src and appendChild to 'head' tag */
						var script = document.createElement('script');	
						script.type="application/javascript";							
						script.src = url+paramStr.trim();				
						document.getElementsByTagName('head')[0].appendChild(script);
						
						return;
						
					} else { 	/* for Rest */
						suc = param.success ? param.success : function() { return ; };
					}
					
					fail = param.fail ? param.fail : function() {return ; };	/* fail function */
					
					if(async) {	/* if async, attach onreadystatechange with process function */
						xhr.onreadystatechange = function() { process(suc, fail, datatype); }
					}
					
					if(type === "GET") {	/* GET */
						xhr.open(type,url+paramStr.trim(),async);
						xhr.send();											
					} else if(type === "POST") {	/* POST */
						xhr.open(type,url,async);
						xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
						xhr.send(paramStr.trim());												
					} 
					
					if(!async) {	/* if Synchronous */
						return returnValue(datatype);
					} 
					
				}

				/**
				* Function to process the request for every state change
				*
				* @this {Nedil.Ajax.ajaxFactory}
				* @param {Function} 'suc' Success function
				* @param {Function} 'fail' Failure function
				* @param {String} 'dtype' Data type of the return value
				*/					
				var process = function(suc, fail, dtype) {
				
					if (xhr.readyState == 4 && xhr.status == 200) {	/* if success */
						suc(returnValue(dtype));
					} else if (xhr.readyState == 4) {	/* if failure */
						fail();
					}
					
				}

				/**
				* Function to return the value as per the datatype
				*
				* @this {Nedil.Ajax.ajaxFactory}
				* @param {String} 'datatype' Data type of the return value
				* @returns {String/XML/JSON} returns the AJAX response
				*/	
				var returnValue = function(datatype) {

					if(datatype === "text") {return xhr.responseText; }	/* for text */
					if(datatype === "xml") { return xhr.responseXML; }	/* for xml */
					if(datatype === "json") { return JSON.parse ? JSON.parse(xhr.responseText) : eval("("+xhr.responseText+")"); }	/* for JSON */
					return xhr.responseText;	/* for no datatype */
					
				}

				/**
				* Function to get the first character for Ajax URL string
				*
				* @this {Nedil.Ajax.ajaxFactory}
				* @returns {String}	returns ? or & depends on the type of URL
				*/					
				this.firstChar = function() {
				
					if(url.slice(-1) === '?') {	/* if last char is ?, return empty string */
						return "";
					}
					
					return url.match(/\?/g)? "&" : "?";	/* return ? or & depend upon the URL */
					
				}

				/**
				* Function to format parameters to form Ajax URL string
				*
				* @this {Nedil.Ajax.ajaxFactory}
				* @returns {String}	returns ? or & depends on the type of URL
				*/					
				this.formURLParamString = function(inp) {
				
					var retStr = "";
				
					for(var key in inp) {	/* append all parameters with & */
						retStr += key+"="+inp[key]+"&";
					}
					
					return retStr;
					
				}            
			}

			return new ajaxFactory(data);	/* return the object of 'ajaxFactory' constructed using 'data'*/
			
		},

		/* Nedil.Data - Data Structure API */
		Data : {
			
			/**
			* Class to create STACK Data structure
			*
			* @this {Nedil.Data}
			*/
			Stack : function() {
			
				this.container = [];	/* using Array */
			   
				/**
				* Function to push element into the stack
				*
				* @this {Nedil.Data.Stack}
				* @param 'val' value to be pushed
				*/			   
				this.push = function(val) {

					if((typeof val != "undefined" && typeof val != "string") || (typeof val === "string" && val.trim() != "")) {
						return this.container.push(val);	
					}
					
				}
			   
				/**
				* Function to pop element out of the stack
				*
				* @this {Nedil.Data.Stack}
				* @returns top element
				*/			   
				this.pop = function() {
				
					return this.container.pop();	
					
				}
			   
				/**
				* Function to iterate elements of stack
				*
				* @this {Nedil.Data.Stack}
				* @param {Function} 'fn' function to be called for manipulating every element
				*/
				this.iterate = function(fn) {
				
					Nedil.Util.forEach(this.container, fn);
					
				}
			   
			},

			/**
			* Class to create QUEUE Data structure
			*
			* @this {Nedil.Data}
			*/
			Queue : function() {
			
				this.head = -1;
				this.tail = -1;
			   	this.container = [];	/* using Array */
			   
				/**
				* Function to enqueue element into the Queue
				*
				* @this {Nedil.Data.Queue}
				* @param 'val' value to be pushed
				*/			   
				this.enqueue = function(val) {
					
					if((typeof val != "undefined" && typeof val != "string") || (typeof val === "string" && val.trim() != "")) {
						return this.container.push(val);	
					}
					
				}
			   
				/**
				* Function to dequeue element into the Queue
				*
				* @this {Nedil.Data.Queue}
				* @returns top element
				*/				
				this.dequeue = function() {
			   
					return this.container.splice(0,1);
				
				}

				/**
				* Function to iterate elements of Queue
				*
				* @this {Nedil.Data.Queue}
				* @param {Function} 'fn' function to be called for manipulating every element
				*/				
				this.iterate = function(fn) {
			   
					Nedil.Util.forEach(this.container, fn);
					
				}
			   
			},

			/**
			* Class to create Table Data structure as in Databases 
			*
			* @this {Nedil.Data}
			* @param {JSON} 'attr' JSON object of arrays to create table fields
			*/
			Table : function(attr) {
			
				this.tabobj = attr;		/* new table object with fields */
				this.tabobj["id"] = [];	/* id field */
				this.auto = 0;			/* Auto increment ID */

				/**
				* Function to insert a record into Table Data structure
				*
				* @this {Nedil.Data.Table}
				* @param {JSON} 'val' New record values
				* @returns {Number} Newly added record id
				*/				
				this.insert = function(val) {
				
					var ind = this.tabobj["id"].length;		/* new position */
					this.tabobj["id"][ind] = ++this.auto;	/* Add index using auto increment id */
					
					for(var key in val) {
						this.tabobj[key][ind] = val[key];	/* insert into table object */
					}
					
					return this.auto;	/* return the ID */
				}

				/**
				* Function to retrieve records from Table Data structure
				*
				* @this {Nedil.Data.Table}
				* @param {Array} 'rows' Array of strings of needed columns
				* @param {JSON} 'where' where condition
				* @returns {Array} All selected rows with 'Rows' object
				*/						
				this.select = function(rows, where) {
				
					var resultSet = [];							/* result query */
					var selIds = whereIDs(this.tabobj, where);	/* select IDs with matching conditions */
					
					if(typeof rows =="string" && rows.trim() == "*") {	/* if "*" rows, then add columns to rows array */
						rows = [];
						
						for(var key in this.tabobj) {
							rows.push(key+"");
						}
						
					}

					for(var i=0, lenId = selIds.length; i< lenId; i++) {	/* for all selected IDs */
						var perRecord = {};
						
						for(var j=0, len = rows.length; j<len; j++) {		/* for all selected columns */
							perRecord[rows[j]] = this.tabobj[rows[j]][selIds[i]];
						}
						
						resultSet.push(new Rows(perRecord));	/* create Rows object and push to resultSet */
					}
					
					return resultSet;	/* return resultSet */
				}

				/**
				* Function to update records in Table Data structure with conditions
				*
				* @this {Nedil.Data.Table}
				* @param {JSON} 'inps' Columns to be updated with values
				* @param {JSON} 'where' where condition
				* @returns {Number} number of records updated
				*/				
				this.update = function(inps, where) {
				
					var selIds = whereIDs(this.tabobj, where);	/* select IDs with matching conditions */

					for(var i=0, lenId = selIds.length; i< lenId; i++) {	/* for all selected IDs */	
					
						for(var key in inps) {
							this.tabobj[key][selIds[i]] = inps[key];	/* update columns */
						}
						
					}
					
					return selIds.length;	/* return number of records updated */
					
				}

				/**
				* Function to delete records from Table Data structure with conditions
				*
				* @this {Nedil.Data.Table}
				* @param {JSON} 'where' where condition
				* @returns {Number} return number of records deleted
				*/				
				this.remove = function(where) {
				
					var selIds = whereIDs(this.tabobj, where);	/* select IDs with matching conditions */

					for(var i = selIds.length - 1; i >= 0; i--) {	/* for all selected IDs */
					
						for(var key in this.tabobj) {
							this.tabobj[key].splice(selIds[i],1);	/* delete record */
						}
						
					}
					
					return selIds.length;	/* return number of records deleted */
					
				}

				/**
				* Class to create Object
				*
				* @this {Nedil.Data.Table}
				* @param {JSON} 'rec' single record from Table
				*/					
				var Rows = function(rec) {
				
					this.rowsQ = rec;
					
					/**
					* Function to get value of particular column
					*
					* @this {Nedil.Data.Table.Rows}
					* @param {String} 'field' column / field name
					* @returns value of the column
					*/						
					this.getValue = function(field) {
						return this.rowsQ[field];
					}
					
				}

				/**
				* Function to get selected IDs using where conditions
				*
				* @param {Array} 'tabl' table array
				* @param {JSON} 'cond' where condition
				* @returns {Array} list of selected IDs
				*/	
				var whereIDs = function(tabl, cond) {
				
					var listIDs = [];	/* list of selected IDs */
					var pos = 0;		/* position pointer */	
					
					if(typeof cond =="string" && cond.trim() == "*") {	/* if '*', then use all IDs */

						for(var i = 0, le = tabl["id"].length; i < le; i++) {
							listIDs[i] = i;
						}
						
						return listIDs;
					}
					
					for(var att in cond) {	/* for every condition */ /* TODO : look for optimization */
					
						while(true) {
							var res = tabl[att].indexOf(cond[att],pos);	/* find match using attribute */
												
							if(res == -1) break;	/* if not found, break */
							
							var valid = true;
							
							for(var at in cond) {	/* if match is found, check for other fields match */
							
								if(!(cond[at] === tabl[at][res])) {	/* if mismatch, break */
									valid = false; 
									break;
								}
								
							}
							
							pos = res + 1;	/* set index seach option after the current one */
							
							if(valid) {	/* if valid, add to selected IDs */
								listIDs.push(res);
							}
							
						}
						
						pos = 0;	/* reset pos and break */
						break;
						
					}
					
					return listIDs;	/* return selected IDs */
					
				}
			}
			
		},

		/* Nedil.Widget - To create Widgets using Nedil */
		Widget : {
			constants : {}
		},
		
		/**
		* Function to check whether DOM is loaded
		*
		* @this {Nedil}
		* @param {Function} 'fn' callback function once DOM is loaded
		*/		
		domLoaded : function(fn) {
		
			if(typeof document.readyState === "string") {	/* if document.readyState is present */
				var tim;
				
				var loaded = function() {					/* function to check if the document is ready and run the fn */
				
					if(document.readyState === "complete" || document.readyState === "interactive") {
						clearInterval(tim);
						fn();
					}
				}
				
				tim = setInterval(loaded, 1);	/* call repeatedly loaded function */
			} else {
				Nedil.get(window).on("load", fn);	/* else use window onload event */
			}
			
		}
			 
	};

	/* Create Nedil as Global reference and assign to $*/
	$ = global.$ = global.Nedil = Nedil;
	
})(window);	/*self execute with 'window' as argument */

