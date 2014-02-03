$(function(){
  /* init map */
  var map = null;

  /* set the width of the map function */
  var reDim = function() {
    $('#map-canvas').width($('#map-canvas').width());
    $('#map-canvas').height(window.innerHeight - $('.navbar').height());
  }

  /* request user location function */
  var userLocation = null;
  var getLocation = function(pass) {
    if (userLocation != null) {
      pass(userLocation);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos){
        userLocation = new google.maps.LatLng(pos.coords.latitude,
                                          pos.coords.longitude);
        pass(userLocation);
      });
    } else {
      alert("Could not get user location!");
    }
  };

  var panToUserLoc = function() { 
    getLocation(function(uloc){
      if(map != null) {
        map.panTo(uloc);
      } else {
        return null;
      }
    });
  };
  
  var userMarker = null;
  var placeUserMarker = function() {
    getLocation(function(uloc){
      if(map != null) {
        userMarker = new google.maps.Marker({
          position: uloc,
          map: map,
          title: 'You'
          });
      }
    });
  };

  var moveUserMarker = function() {
    getLocation(function(uloc){
      if(userMarker != null) {
        userMarker.setPosition(uloc);
      }
      panToUserLoc();
    });
  };

  /* Map Initialization Function */
  function initialize() {
    var mapOptions = {
      zoom: 17,
      panControl: false,
      zoomControl: false,
      streetViewControl: false,
      scaleControl: false,
      rotateControl: false,
      overviewMapControl: false,

    };
    reDim();
    map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
    google.maps.event.addDomListener(map, 'idle', 
            function(){console.log(map.getBounds())});

    }

  /* Events */
  
  google.maps.event.addDomListener(window, 'load', initialize);
  
  panToUserLoc();
  placeUserMarker();


  var verifyLocation = function(uloc) {
    console.log("WATCHPOSITION called");
    var prevLocation = userLocation;

    /* update userLocation */
    getLocation(function(uloc){
      /* Calculate distance between locations */
      console.log(
        'Distance betw prev location is ',
        pointToDistance(uloc, prevLocation, 4),
        'km.');
    });

    
    /* update marker */
    moveUserMarker();
  };

  /* User position changes event */
  navigator.geolocation.watchPosition(verifyLocation);

});

