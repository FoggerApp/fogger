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
    userMarker = null,
    myLocs = new Array(),
    worldLocs = new Array(),
    moveTimeout = null,
    view = 'user',
    mapType = null;

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

  function getView() {
    return view;
  }

  function setView(v) {
    view = v;
  }

  function getMapType() {
    return mapType;
  }

  function setMapType(mt) {
    if( mt === "satellite" ) {
      mapType = google.maps.MapTypeId.SATELLITE;
    } else if ( mt === "roadmap" ){
      mapType = google.maps.MapTypeId.ROADMAP;
    }

    map.setMapTypeId(mapType);
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
   * GET all locations from database within the map's bounds.
   * @param  {callback} success
   * @param  {callback} fail
   */
  function getAllLocationsInBound(success, fail) {
    $.get(fogger.api + 'location' + '?nelat=' + map.getBounds().getNorthEast().lat() + '&nelng=' + map.getBounds().getNorthEast().lng() + '&swlat=' + map.getBounds().getSouthWest().lat() + '&swlng=' + map.getBounds().getSouthWest().lng())
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
        map.setZoom(17);
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
      //panToUserLoc();
    });
  }

  function geoBounds() {
    //Get map bounds
    var ne = fogger.map.getMap().getBounds().getNorthEast();
    var sw = fogger.map.getMap().getBounds().getSouthWest();

    //Calculate delta lat and delta lng
    var dLng = ne.lng() - sw.lng();
    var dLat = sw.lat() - ne.lat();

    return {
      nw: { lat: ne.lat(), lng: sw.lng() },
      ne: { lat: ne.lat(), lng: ne.lng() },
      dLat: dLat,
      dLng: dLng
    };
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

    //Contact API
    postUserLocation( data, function(d) { } );

    //Move user marker
    moveUserMarker();

    //Get new mask
    updateFog();
  }

  //updates the mask
  function updateFog() {
    if( view == 'user' ) {
      getLocationsInBound(fogger.user.id, function(d) {
        myLocs = d.content.locations;
        worldLocs = new Array();
        /* Add sight radius at the user's marker */
        var mPos = getUserMarker().getPosition();
        myLocs.push( { lat: mPos.lat(), lng: mPos.lng() } );

        /* reload the fog */
        reloadFog();
      });
    } else if ( view == 'world') {
      getAllLocationsInBound(function(d) {
        console.log(d);
        var allLocs = d.content.locations;
        /* Sort your locations from other locations */
        for( var i = 0; i < allLocs.length; i++ ) {
          if( allLocs[i].uid == fogger.user.id ) {
            myLocs.append(allLocs[i]);
          } else {
            worldLocs.append(allLocs[i]);
          }
        }
        /* Add sight radius at the user's marker */
        var mPos = getUserMarker().getPosition();
        myLocs.push( { lat: mPos.lat(), lng: mPos.lng() } );

        /* reload the fog */
        reloadFog();
      });
    }
    
  }

  // MAP INTERACTION
  function reloadFog() {
    fogger.graphics.setMask(myLocs, worldLocs, geoBounds());
  }

  function updateFogAfterMove() {
    if (moveTimeout) {
      window.clearTimeout(moveTimeout);
    }

    moveTimeout = window.setTimeout(updateFog, 500);
  }

  /**
   * Sets events for the map module.
   * @method setEvents
   */
  function setEvents() {
    fogger.navigator.geolocation.watchPosition(
      updateLocation
    );
    google.maps.event.addDomListener(
      map,
      'bounds_changed',
      reloadFog
    );
    google.maps.event.addDomListener(
      map,
      'bounds_changed',
      updateFogAfterMove
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
          title: 'You',
          zIndex: 1200
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
      overviewMapControl: false,
      mapTypeControl: false,
      mapTypeId: mapType
    };
    reDim();
    map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
  }

  /**
   * Initializes the map module.
   * @method init
   */
  function init(callback) {
    mapType = google.maps.MapTypeId.SATELLITE;
    initializeMap();
    google.maps.event.addDomListenerOnce(map, 'idle', function() {
      panToUserLoc();
      placeUserMarker();
      setEvents();
    });

    if(callback !== undefined) {
      callback();
    }
  }

  /**
   * Sets the glopal name space
   */
  fogger.map = {
    init: init,
    getMap: getMap,
    getUserLocation: getUserLocation,
    getUserMarker: getUserMarker,
    getView: getView,
    setView: setView,
    getMapType: getMapType,
    setMapType: setMapType,
    setMap: setMap,
    setUserLocation: setUserLocation,
    setUserMarker: setUserMarker,
    setEvents: setEvents,
    reloadFog: reloadFog,
    updateFog: updateFog,
    addMapEvent: addMapEvent,
    reDim: reDim,
    getLocation: getLocation,
    coordsToLatLng: coordsToLatLng,
    panToUserLoc: panToUserLoc,
    placeUserMarker: placeUserMarker,
    moveUserMarker: moveUserMarker,
    initializeMap: initializeMap,
    updateLocation: updateLocation,
    getLocationsInBound: getLocationsInBound,
    getAllLocationsInBound: getAllLocationsInBound,
    postUserLocation: postUserLocation
  };

}());
