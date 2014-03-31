/**
 * Provides the map with interaction
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

  /* privates */
  var width = null,
      height = null,
      layer = null;
  /* FUNCTIONS */
  
  /* generate the interface */
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
  function generateTerrainToggle() {
    var terrainToggle = layer.append("div")
      .attr("id", "map-terrain")
      .attr("class", "btn-group")
      .style("position", "absolute")
      .style("z-index", 1500)
      .style("top", "10px")
      .style("right", "10px");

    terrainToggle.append("button")
        .attr("class", "btn btn-default btn-lg")
        .attr("type", "button")
        .attr("data-type", "satellite")
      .append("span")
        .attr("class", "glyphicon glyphicon-tree-conifer");
    terrainToggle.append("button")
        .attr("class", "btn btn-default btn-lg")
        .attr("type", "button")
        .attr("data-type", "roadmap")
      .append("span")
        .attr("class", "glyphicon glyphicon-road");
  }
  function generateViewToggle() {
    var viewToggle = layer.append("div")
      .attr("id", "map-view")
      .attr("class", "btn-group")
      .style("position", "absolute")
      .style("z-index", 1500)
      .style("top", "65px")
      .style("right", "10px");

    viewToggle.append("button")
        .attr("class", "btn btn-default btn-lg")
        .attr("type", "button")
        .attr("data-type", "user")
      .append("span")
        .attr("class", "glyphicon glyphicon-user");
    viewToggle.append("button")
        .attr("class", "btn btn-default btn-lg")
        .attr("type", "button")
        .attr("data-type", "world")
      .append("span")
        .attr("class", "glyphicon glyphicon-globe");
  }
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

  /* Events */
  function setEvents() {
    $('#map-goto').on('click', fogger.map.panToUserLoc);
    $('#map-terrain .btn').on('click', function(){
      console.log("Here!", $(this).attr("data-type"));
      fogger.map.setMapType($(this).attr("data-type"));
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
   */
  fogger.interact = {
    init: init,
    generateGoToButton: generateGoToButton,
    generateInterface: generateInterface
  };

}());
