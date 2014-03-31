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
    iRadius = 80,
    radius = null,
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

  function getCtx() {
    return ctx;
  }

  function zoomScale(o, p) {
    return pointToDistance(o, p);
  }

  /**
   * Sets the circles in the mask
   * data = { content = [loc1, loc2 .. ], errors = [] }
   * loc = { "loc": {"lat": lat, "lng": lng}, "uid": uid }
   * @method setMask
   * @param {RESTful Api Object} d
   * @param {Coord} o
   * @param {Float} w
   * @param {Float} h
   */
  function setMask(d, world, geo) {
    var o = geo.nw,
        w = geo.dLng,
        h = geo.dLat,
        p = geo.ne;
    /* Calculate the circle radius for zoom */
    radius = iRadius/zoomScale(o, p);

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

    ctx.save()
    
    // Create rectangle
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.fill();
    
    ctx.globalCompositeOperation = 'destination-out';
    
    // sets blur properties
    ctx.translate(-width-radius-1000000, 0);
    ctx.shadowOffsetX = width + radius + 1000000;    
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = 'black'; 
    ctx.shadowBlur = 100/zoomScale(o, p);

    /* Loop through user locations */
    for(var i = 0; i < d.length; i++) {
        var coord = scale(d[i], o, mapBound, svgFrame);
        ctx.moveTo(coord.x, coord.y);
        ctx.arc(coord.x, coord.y, radius, 0, 2 * Math.PI);
        // ctx.moveTo(coord.x, coord.y);
    }

    /* Loop through world locations */
    for(var i = 0; i < world.length; i++) {
        var coord = scale(world[i], o, mapBound, svgFrame);
        ctx.moveTo(coord.x, coord.y);
        ctx.arc(coord.x, coord.y, radius, 0, 2 * Math.PI);
    }
    ctx.fill();
    ctx.restore();

    // Color in offset circles
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fill();
  }

  /**
   * Removes the 
   * @return {[type]} [description]
   */
  function clearMask() {
    canvas.width = canvas.width;
  }

  function init(success) {
    $('#map-canvas').width($('#map-canvas').width());
    $('#map-canvas').height(window.innerHeight - $('#bottom-menu').height());

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
    clearMask: clearMask,
    getCtx: getCtx,
    zoomScale: zoomScale,
  };


}());