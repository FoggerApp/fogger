/**
 * Fogger Graphics Module
 * @module graphics
 */
(function() {

  /**
   * Mask Canvas
   * @private mask
   * @type {d3.selection}
   */
  var canvas = null,
    /**
     * Canvas context
     * @type {Object}
     */
    ctx = null,
    /**
     * Circle Radius
     * @private radius
     * @type {Integer}
     */
    radius = null,
    /**
     * Relative Radius Size
     * @type {Number}
     */
    iRadius = 80,
    /**
     * Canvas height
     * @private height
     * @type {Float}
     */
    height = null,
    /**
     * Canvas width
     * @private width
     * @type {Float}
     */
    width = null;

  /**
   * Get the context of the canvas.
   * @return {Object} Canvas context
   */
  function getCtx() {
    return ctx;
  }

  /**
   * Gets the scale factor of the map, 
   * this basically corresponds to the
   * width of the canvas, in meters.
   * @param  {Object} geo GeoBounds of the map
   * @return {float}     scale factor
   */
  function zoomScale(geo) {
    return pointToDistance(geo.nw, geo.ne);
  }

  /**
     * Move from the geographic point of reference
     * to the x, y pixel grid point of reference.
     * @method scale
     * @param { Point = { {Float} lat, {Float} lng } } loc
     * @param { Object } geo
     * @return { Point = { {Float} x, {Float} y } }    2D Point
     */
  function scale(loc, geo) {
      var mapBound = getMapBound(geo);
      var svgFrame = getCanvasFrame();
      return {
        x: (
          (loc.lng - geo.nw.lng) / mapBound.width
        ) * svgFrame.width,
        y: (
          (loc.lat - geo.nw.lat) / mapBound.height
        ) * svgFrame.height
      };
    }
  /**
   * Get the bounds of map in delta geolocation format.
   * @param  {Object} geo geoBounds Object
   * @return {MapBound = { {Float} height, {Float} width } }
   */
  function getMapBound(geo) {
    return {
      width: geo.dLng,
      height: geo.dLat
    };
  }
  
  /**
   * Get the canvas frame in width/height format.
   * @return {CanvasFrame = { {Float} height, {Float} width } }
   */
  function getCanvasFrame() {
    return {
        width: width,
        height: height
      };
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

    /* Calculate the circle radius for zoom */
    radius = iRadius/zoomScale(geo);

    /* Clear previous points on the map */
    clearMask();

    ctx.save();
    
    /* Create rectangle */
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    
    ctx.globalCompositeOperation = 'destination-out';
    
    /* sets blur properties */
    ctx.translate(-width-radius-1000000, 0);
    ctx.shadowOffsetX = width + radius + 1000000;    
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 100/zoomScale(geo);

    /* Loop through user locations */
    addCirclesForLocs(d, geo);
    ctx.fill();

    /* Add world overlay if world isn't empty */
    if(world.length > 0) {
      ctx.globalCompositeOperation = 'source-atop';
      ctx.shadowColor = 'yellow';
      ctx.fillStyle = "yellow";
      addCirclesForLocs(world, geo);
      ctx.fill();
    }
    
    ctx.restore();

    /* Color in the offset circles */
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fill();

  }

  /**
   * Add circles to the canvas for a location on the map.
   * @param { [ Point = { {Float} lat, {Float} lng } ] } locs Array of Point Objects
   * @param {Object} geo  geoBounds Object for scaling
   */
  function addCirclesForLocs(locs, geo) {
    /* Loop through locs */
    for(var i = 0; i < locs.length; i++) {
        var coord = scale(locs[i], geo);
        ctx.moveTo(coord.x, coord.y);
        ctx.arc(coord.x, coord.y, radius, 0, 2 * Math.PI);
    }
  }

  /**
   * Add a canvas to the HTML layout.
   * @param {string} id HTML id attribute to assign the page canvas element.
   * @return {Object} D3 selector
   */
  function addCanvas(id) {
    return d3.select("#map-canvas-container").insert("canvas", ":first-child")
      .attr("id", id)
      .attr("class", 'canvas-mask')
      .attr("width", width)
      .attr("height", height);
  }

  /**
   * Resets the canvas mask.
   */
  function clearMask() {
    canvas.width = canvas.width;
  }

  /**
   * Initializes the module
   * @param  {callback} success Called after the module is loaded
   */
  function init(success) {
    /* Fix the height and width of the map canvas */
    $('#map-canvas').width($('#map-canvas').width());
    $('#map-canvas').height(window.innerHeight - $('#bottom-menu').height());

    /* Set the dimensions of the canvas the same as the map */
    width = $('#map-canvas').width();
    height = $('#map-canvas').height();

    /* Create the canvas element */
    addCanvas('map-mask');

    /* Get the context */
    canvas = document.getElementById('map-mask');
    ctx = canvas.getContext('2d');

    success();
  }

  /**
   * Module global namespace
   * @type {Global}
   */
  fogger.graphics = {
    init: init,
    setMask: setMask,
    clearMask: clearMask,
    getCtx: getCtx,
    zoomScale: zoomScale,
  };


}());