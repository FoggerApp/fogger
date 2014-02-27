/**
 * Fogger Graphics Module
 * @module graphics
 */

(function() {

  /**
   * @private mask
   * @type {d3.selection}
   */
  var mask = null,
    /**
     * Circle Radius
     * @private radius
     * @type {Integer}
     */
    radius = 100,
    /**
     * @private height
     * @type {Float}
     */
    height = null,
    /**
     * @private width
     * @type {Float}
     */
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
        x: ((loc.lng - nw.lng) / mapBound.width) * svgFrame.width,
        y: ((loc.lat - nw.lat) / mapBound.height) * svgFrame.height
      };
    }
    var mapBound = {
      width: w,
      height: h
    }, svgFrame = {
        width: width,
        height: height
      };
    mask.selectAll("circle").remove();
    var circ = mask.selectAll("circle")
      .data(d);
    circ.enter()
      	.append("circle")
      	.attr("r", radius)
	    .attr("cx", function(d) {
	      return scale(d, o, mapBound, svgFrame).x;
	    })
       .attr("cy", function(d) {
	      return scale(d, o, mapBound, svgFrame).y;
	    });
    circ.exit().remove();
  }

  /**
   * Removes the 
   * @return {[type]} [description]
   */
  function clearMask() {

  }

  function init(success) {
  	$('#map-canvas').width($('#map-canvas').width());
    $('#map-canvas').height(window.innerHeight - $('.navbar').height());
    width = $('#map-canvas').width();
    height = $('#map-canvas').height();
    mask = d3.select("#map-canvas-container").insert("svg", ":first-child")
      .attr("id", "map-mask")
      .attr("width", width)
      .attr("height", height);
    success();
  }
  fogger.graphics = {
    init: init,
    setMask: setMask,
    clearMask: clearMask
  };


}());