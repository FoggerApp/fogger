/**
 * Provides the map with an interaction layer
 *
 * @module fogger
 * @class interact
 * @main interact
 */
(function() {
  "use strict";

  if (!window.hasOwnProperty("fogger")) {
    throw new Error("Requires fogger global");
  }

  if (!window.fogger.hasOwnProperty("map")) {
    throw new Error("Requires fogger map module");
  }

  if (!window.fogger.hasOwnProperty("graphics")) {
    throw new Error("Requires fogger graphics module");
  }

  /**
   * Width of the interaction layer
   * @type {Number}
   */
  var width = null,
      /**
       * Height of the interaction layer
       * @type {Number}
       */
      height = null,
      /**
       * Reference to the layer.
       * @type {Object}
       */
      layer = null,
      imageBase = '/fogger/static/images/ranks/';

  /**
   * Generates a Map Marker.
   */
  function generateMarker(id, pos, image, size) {
    var offset = {
      x: size.width/2,
      y: size.height/2
    };
    var marker = layer.append("div")
        .style(
          "background-image",
          "url(" + imageBase + image + ".png" + ")"
        ).style("background-repeat", "no-repeat")
        .style("background-size", "contain")
        .style("position", "absolute")
        .style("z-index", 1500)
        .style("top", (pos.x - offset.x) + "px")
        .style("left", (pos.y - offset.y) + "px")
        .style("width", size.width + "px")
        .style("height", size.height + "px");
  }
  /**
   * Generates the user's marker
   */
  function generateUserMarker() {
    var mPos = fogger.map.getUserLocation();
    var pos = fogger.graphics.scale(
      { lat: mPos.lat(), lng: mPos.lng() },
      fogger.map.geoBounds()
    );
    //console.log("POSPOSPOS", pos);
    generateMarker(
      "map-marker-user",
      pos,
      "smiley_happy",
      { width: 32, height: 32 }
    );
  }

  /**
   * Generates a button to center the map to the user location
   *   and to turn on following.
   * @method generateGoToButton
   */
  function generateGoToButton() {
    var goToButton = layer.append("div")
      .attr("id", "map-goto")
      .attr("class", "btn btn-default btn-lg")
      .style("position", "absolute")
      .style("z-index", 1500)
      .style("bottom", "15px")
      .style("right", "10px");
    goToButton.append("span")
      .attr(
        "class",
        "glyphicon glyphicon-screenshot"
      );
  }

  /**
   * Generates a toggle button.
   * @method generateToggle
   * @param  {string} id  HTML id attribute
   * @param  {Array} ops toggle operations
   * @param  {Number} x   x pos rel to right
   * @param  {Number} y   y pos rel to top
   */
  function generateToggle(id, ops, x, y) {
    var toggle = layer.append("div")
      .attr("id", id)
      .attr("class", "btn-group")
      .style("position", "absolute")
      .style("z-index", 1500)
      .style("top", y + "px")
      .style("right", x + "px");
    
    for(var i = 0; i < ops.length; i++) {
      toggle.append("button")
        .attr("class", "btn btn-default btn-lg")
        .attr("type", "button")
        .attr("data-type", ops[i][0])
      .append("span")
        .attr("class", "glyphicon " + ops[i][1]);
    }
  }

  /**
   * Generates a button to toggle between terrain types.
   * @method generateTerrainToggle
   */
  function generateTerrainToggle() {
    generateToggle(
      "map-terrain",
      [
        ["satellite", "glyphicon-tree-conifer"],
        ["roadmap", "glyphicon-road"]
      ],
      10, 10
    );
  }
  
  /**
   * Generates a button to toggle between map views.
   * @method generateViewToggle
   */
  function generateViewToggle() {
    generateToggle(
      "map-view",
      [
        ["user", "glyphicon-user"],
        ["world", "glyphicon-globe"]
      ],
      120, 10
    );
  }

  /**
   * Generates the interface element
   * @method generateInterface
   */
  function generateInterface() {
    width = $('#map-canvas').width();
    height = $('#map-canvas').height();

    layer = d3.select("#map-canvas-container")
      .insert("div", ":first-child")
        .attr("id", "map-interface")
        .style("position", "absolute")
        .style("width", width + "px")
        .style("height", height + "px")
        .style("overflow", "hidden");

    generateGoToButton();
    generateTerrainToggle();
    generateViewToggle();
    /*generateUserMarker();*/
  }

  /**
   * Sets the events of the interaction layer
   * @method setEvents
   */
  function setEvents() {
    /* Set map go to user event.*/
    $('#map-goto').on('click', function(){
      fogger.map.panToUserLoc();
      setTimeout(function(){
        fogger.map.setFollow(true);
      }, 200);
    });

    /* Set map terrain toggle event*/
    $('#map-terrain .btn').on('click', function(){
      fogger.map.setMapType($(this).attr("data-type"));
    });

    /* Set map view toggle event */
    $('#map-view .btn').on('click', function(){
      fogger.map.setView($(this).attr("data-type"));
      fogger.map.updateFog();
      console.log("haha");
    });

    /* Unset follow as soon as the user clicks on the map */
    $('#map-canvas-container').on('mousedown', function(){
      fogger.map.setFollow(false);
    });
  }

  /**
   * Initializes the map module.
   * @method init
   */
  function init(callback) {
    generateInterface();
    setEvents();
    if(callback !== undefined) {
      callback();
    }
  }

  /**
   * Sets the glopal name space
   * @type {Attribute} fogger.interact
   */
  fogger.interact = {
    init: init,
    generateToggle: generateToggle,
    generateGoToButton: generateGoToButton,
    generateTerrainToggle: generateTerrainToggle,
    generateViewToggle: generateViewToggle,
    generateInterface: generateInterface,
    setEvents: setEvents
  };

}());
