/**
 * Fogger Graphics Module
 * @module graphics
 */

(function() {

  /**
   * @private mask
   * @type {d3.selection}
   */
  var canvas = null,
    ctx = null,
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

    clearMask();
    // This is the canvas where you want to draw
    // I'll use a skyblue background that covers everything
    // Just to demonstrate
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'xor';

    // Change color for xor operation
    ctx.fillStyle = "white";

    /* Loop through all circles */
    for(var i = 0; i < d.length; i++) {
        console.log(d);
        var coord = scale(d[i], o, mapBound, svgFrame);
        ctx.arc(coord.x, coord.y, radius, 0, 2 * Math.PI);
    }
    ctx.fill();
  }

  /**
   * Removes the 
   * @return {[type]} [description]
   */
  function clearMask() {
    //canvas.width = canvas.width;
  }

  function init(success) {
    $('#map-canvas').width($('#map-canvas').width());
    $('#map-canvas').height(window.innerHeight - $('.navbar').height());
    width = $('#map-canvas').width();
    height = $('#map-canvas').height();
    canvas = d3.select("#map-canvas-container").insert("canvas", ":first-child")
      .attr("id", "map-mask")
      .attr("width", width)
      .attr("height", height);
    canvas = document.getElementById('map-mask');
    ctx = canvas.getContext('2d');
    success();
  }
  fogger.graphics = {
    init: init,
    setMask: setMask,
    clearMask: clearMask
  };


}());