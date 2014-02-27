/**
 * Provides the google map layout that show the user location.
 *
 * @module fogger
 * @class map
 * @main map
 */
(function() {
  "use strict";

  if (!window.hasOwnProperty("fogger")) {
    throw new Error("Requires fogger global");
  }

  if (!window.fogger.hasOwnProperty("navigator")) {
    throw new Error("Requires fogger navigator module");
  }

  /**
   * @private map
   * @type {google.maps.Map}
   */
  var map = null,

    /**
     * Object that is returned by
     * navigator.geolocation.getCurrentPosition()
     * @private userLocation
     */
    userLocation = null,

    /**
     * @private userMarker
     */
    userMarker = null;

  /* FUNCTIONS */
  /**
   * Gets the map.
   * @method getMap
   * @return {google.maps.Map} map
   */
  function getMap() {
    return map;
  }

  /**
   * Gets user location.
   * @method getUserLocation
   * @return {google.maps.LatLng} userLocation
   */
  function getUserLocation() {
    return userLocation;
  }

  /**
   * Gets user marker.
   * @method getUserMarker
   * @return {google.maps.Marker} userMarker
   */
  function getUserMarker() {
    return userMarker;
  }

  /**
   * Sets the map.
   * @method setMap
   * @param {google.maps.Map} m
   */
  function setMap(m) {
    map = m;
  }

  /**
   * Sets the user location.
   * @method setUserLocation
   * @param {google.maps.LatLng} u
   */
  function setUserLocation(u) {
    userLocation = u;
  }

  /**
   * GET locations from database within the map's bounds.
   * @param  {Integer} uid
   * @param  {callback} success
   * @param  {callback} fail
   */
  function getLocationsInBound(uid, success, fail) {
    $.get(fogger.api + 'location/' + fogger.user.id + '?nelat=' + map.getBounds().getNorthEast().lat() + '&nelng=' + map.getBounds().getNorthEast().lng() + '&swlat=' + map.getBounds().getSouthWest().lat() + '&swlng=' + map.getBounds().getSouthWest().lng())
      .done(success)
      .fail(fail);
  }

  /**
   * POST given location to the RESTful api.
   * Data must have the following form:
   *   { loc: { lat: lat, lng: lng }, uid: uid }
   * @param  {Location} data
   * @param  {callback} success
   * @param  {callback} fail
   */
  function postUserLocation(data, success, fail) {
    $.post(fogger.api + 'location', JSON.stringify(data))
      .done(success)
      .fail(fail);
  }

  /**
   * Sets the user marker.
   * @method setUserMarker
   * @param {google.maps.Marker} u
   */
  function setUserMarker(u) {
    userMarker = u;
  }

  /**
   * Conventing the google object to latitude and longitude.
   * @method setUserMarker
   * @param {Position} pos
   */
  function coordsToLatLng(pos) {
    return new google.maps.LatLng(pos.coords.latitude,
      pos.coords.longitude);
  }

  /**
   * Gets the user location.
   * @method getLocation
   * @param {google.maps.LatLng} pass
   */
  function getLocation(pass) {
    if (userLocation !== null) {
      pass(userLocation);
    } else if (fogger.navigator.geolocation) {
      fogger.navigator.geolocation.getCurrentPosition(function(pos) {
        userLocation = coordsToLatLng(pos);
        pass(userLocation);
      });
    } else {
      alert("Could not get user location!");
    }
  }

  /**
   * Gets the bound object from the map.
   * @return {google.maps.LatLngBounds}
   */
  function getBounds() {
    return map.getBounds();
  }

  /**
   * Pans the map to the user current location.
   * @method panToUserLoc
   */
  function panToUserLoc() {
    getLocation(function(uloc) {
      if (map !== null) {
        map.panTo(uloc);
      }
    });
  }

  /**
   * Moves the user marker on the map.
   * @method moveUserMarker
   */
  function moveUserMarker() {
    getLocation(function(uloc) {
      if (userMarker !== null) {
        userMarker.setPosition(uloc);
      }
      panToUserLoc();
    });
  }

  /**
   * Updates the user location.
   * @method updateLocation
   * @param {Position} pos
   */
  function updateLocation(pos) {
    userLocation = coordsToLatLng(pos);

    //Construct data object
    var data = {
      uid: fogger.user.id,
      loc: {
        lat: getUserLocation().lat(),
        lng: getUserLocation().lng()
      }
    };

    
    //Get map bounds
    var ne = fogger.map.getMap().getBounds().getNorthEast();
    var sw = fogger.map.getMap().getBounds().getSouthWest();
    //Create the North West coordidate
    var nw = {
      lat: ne.lat(),
      lng: sw.lng()
    };
    //Calculate delta lat and delta lng
    var dLng = ne.lng() - sw.lng();
    var dLat = sw.lat() - ne.lat();

    //Contact API
    postUserLocation(data, function(d) {
    });
    getLocationsInBound(fogger.user.id, function(d) {
      fogger.graphics.setMask(d.content.locations, nw, dLng, dLat);
    });

    moveUserMarker();
  }

  /**
   * Sets events for the map module.
   * @method setEvents
   */
  function setEvents() {
    fogger.navigator.geolocation.watchPosition(
      updateLocation
    );
  }

  /**
   * Add map event.
   * @method addEvent()
   */
  function addMapEvent(event, callback) {
    google.maps.event.addDomListenerOnce(map, event, callback);
  }

  /**
   * Sets the width and height of the map.
   * @method reDim
   */
  function reDim() {
    $('#map-canvas').width($('#map-canvas').width());
    $('#map-canvas').height(window.innerHeight - $('.navbar').height());
  }

  /**
   * Places the user marker on the map.
   * @method placeUserMarker
   */
  function placeUserMarker() {
    getLocation(function(uloc) {
      if (map !== null) {
        userMarker = new google.maps.Marker({
          position: uloc,
          map: map,
          title: 'You'
        });
      }
    });
  }

  /**
   * Initializes the map
   * @method initializeMap
   */
  function initializeMap() {
    var mapOptions = {
      zoom: 17,
      panControl: false,
      zoomControl: false,
      streetViewControl: false,
      scaleControl: false,
      rotateControl: false,
      overviewMapControl: false
    };
    reDim();
    map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
  }

  /**
   * Initializes the map module.
   * @method init
   */
  function init() {
    initializeMap();
    google.maps.event.addDomListenerOnce(map, 'idle', function() {
      panToUserLoc();
      placeUserMarker();
      setEvents();
    });
  }

  /**
   * Sets the glopal name space
   */
  fogger.map = {
    init: init,
    getMap: getMap,
    getUserLocation: getUserLocation,
    getUserMarker: getUserMarker,
    setMap: setMap,
    setUserLocation: setUserLocation,
    setUserMarker: setUserMarker,
    setEvents: setEvents,
    addMapEvent: addMapEvent,
    reDim: reDim,
    getLocation: getLocation,
    coordsToLatLng: coordsToLatLng,
    panToUserLoc: panToUserLoc,
    placeUserMarker: placeUserMarker,
    moveUserMarker: moveUserMarker,
    initializeMap: initializeMap,
    updateLocation: updateLocation,
    getLocationsInBound: getLocationsInBound
  };

}());