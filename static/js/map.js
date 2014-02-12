/* MAP MODULE */
(function () {
  "use strict";

  if (!window.hasOwnProperty("fogger")) {
    throw new Error("Requires fogger global");
  }

  if (!window.fogger.hasOwnProperty("navigator")) {
    throw new Error("Requires fogger navigator module");
  }

  /* PRIVATE variables */
  var map = null,
    userLocation = null,
    userMarker = null;

  /* FUNCTIONS */
  function getMap() {
    return map;
  }

  function getUserLocation() {
    return userLocation;
  }

  function getUserMarker() {
    return userMarker;
  }

  function setMap(m) {
    map = m;
  }

  function setUserLocation(u) {
    userLocation = u;
  }

  function setUserMarker(u) {
    userMarker = u;
  }

  function coordsToLatLng(pos) {
    return new google.maps.LatLng(pos.coords.latitude,
      pos.coords.longitude);
  }

  /* request user location function */
  function getLocation(pass) {
    if (userLocation !== null) {
      pass(userLocation);
    } else if (fogger.navigator.geolocation) {
      fogger.navigator.geolocation.getCurrentPosition(function (pos) {
        userLocation = coordsToLatLng(pos);
        pass(userLocation);
      });
    } else {
      alert("Could not get user location!");
    }
  }

  function panToUserLoc() {
    getLocation(function (uloc) {
      if (map !== null) {
        map.panTo(uloc);
      }
    });
  }

  function moveUserMarker() {
    getLocation(function (uloc) {
      if (userMarker !== null) {
        userMarker.setPosition(uloc);
      }
      panToUserLoc();
    });
  }

  function updateLocation(pos) {
    userLocation = coordsToLatLng(pos);
    moveUserMarker();
  }

  function setEvents() {
    fogger.navigator.geolocation.watchPosition(
      updateLocation
    );
  }

  /* set the width of the map function */
  function reDim() {
    $('#map-canvas').width($('#map-canvas').width());
    $('#map-canvas').height(window.innerHeight - $('.navbar').height());
  }

  function placeUserMarker() {
    getLocation(function (uloc) {
      if (map !== null) {
        userMarker = new google.maps.Marker({
          position: uloc,
          map: map,
          title: 'You'
        });
      }
    });
  }

  /* Map Initialization Function */
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
    //To be implemented
    //google.maps.event.addDomListener(map, 'idle', 
    //        function (){console.log(map.getBounds())});

  }

  /* INIT */
  function init() {
    initializeMap();
    panToUserLoc();
    placeUserMarker();
    setEvents();
  }

  /* set GLOBAL namespace */
  fogger.map = {
    init: init,
    getMap: getMap,
    getUserLocation: getUserLocation,
    getUserMarker: getUserMarker,
    setMap: setMap,
    setUserLocation: setUserLocation,
    setUserMarker: setUserMarker,
    setEvents: setEvents,
    reDim: reDim,
    getLocation: getLocation,
    coordsToLatLng: coordsToLatLng,
    panToUserLoc: panToUserLoc,
    placeUserMarker: placeUserMarker,
    moveUserMarker: moveUserMarker,
    initializeMap: initializeMap,
    updateLocation: updateLocation
  };

}());