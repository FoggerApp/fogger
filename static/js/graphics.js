/**
* Fogger Graphics Module
*/

(function(){

	/* Private Variables */
	var mask = null,
	  radius = 10,
	  height = null,
	  width = null;
	/**
	* Sets the circles in the mask 
	* data = { content = [loc1, loc2 .. ], errors = [] }
	* loc = { "loc": {"lat": lat, "lng": lng}, "uid": uid }
	* @param {RESTful Api Object} data
	*/
	function setMask(d) {
      mask.selectAll("circle")
        .data(d.content)
        .enter()
          .append("circle")
          .attr("r", radius);
	}

	function clearMask(){

	} 

	function init(){
		width = $('#map-canvas').width();
		height = $('#map-canvas').height();
		mask = d3.select("#map-canvas-container").insert("svg", ":first-child")
			.attr("id", "map-mask")
			.attr("width", width)
			.attr("height", height);
		// svg.append("circle")
		// 	.attr("cx", "50")
		// 	.attr("cy", "50")
		// 	.attr("r", "40")
		// 	.attr("stroke", "black")
		// 	.attr("stroke-width", "3")
		// 	.attr("fill", "red");
	}
	fogger.graphics = {
		init: init,
		setMask: setMask
	};

	
}());