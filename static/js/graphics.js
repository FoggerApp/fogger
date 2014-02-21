/**
* Fogger Graphics Module
* @module graphics
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
	* @method setMask
	* @param {RESTful Api Object} data
	* @param {Coord} o
	* @param {Float} w
	* @param {Float} h
	*/
	function setMask(d, o, w, h) {
	  /**
	   * Move from the geographic point of reference
	   * to the x, y grid point of reference.
	   * @method scale
	   * @param { Point = { {Float} lat, {Float} lng } } loc 
	   * @param { Point = { {Float} lat, {Float} lng } } nw
	   * @param { Frame = { {Float} width, {Float} height } } mapBound
	   * @param { Frame = { {Float} width, {Float} height } } svgFrame
	   * @return { Point = { {Float} x, {Float} y } }
	   */
	  function scale(loc, nw, mapBound, svgFrame) {
	  	return {
	  		x: ((loc.lng-nw.lng)/mapBound.width)*svgFrame.width,
	  		y: ((loc.lat-nw.lat)/mapBound.height)*svgFrame.height
	  	};
	  }
	  var mapBound = {
	  	width: w,
	  	height: h
	  }, svgFrame = {
	  	width: width,
	  	height: height
	  };
	  console.log(o, mapBound, svgFrame);
      mask.selectAll("circle")
        .data(d.content)
        .enter()
          .append("circle")
          .attr("r", radius)
          .attr("cx", function(d){
          	console.log(d);
          	return scale(d.loc, o, mapBound, svgFrame).x;
          })
          .attr("cy", function(d){
          	return scale(d.loc, o, mapBound, svgFrame).y;
          });
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