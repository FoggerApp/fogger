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
      layer = null;

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
   */
  function generateToggle(id, ops) {
    var toggle = layer.append("div")
      .attr("id", id)
      .attr("class", "btn-group")
      .style("position", "absolute")
      .style("z-index", 1500)
      .style("top", "10px")
      .style("right", "10px");
    
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
      ]
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
      ]
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
        .style("height", height + "px");

    generateGoToButton();
    generateTerrainToggle();
    generateViewToggle();
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
