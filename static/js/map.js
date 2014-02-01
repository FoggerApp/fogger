$(function(){
  /* init map */
  var map = null;

  /* set the width of the map function */
  var reDim = function() {
    $('#map-canvas').width($('#map-canvas').width());
    $('#map-canvas').height(window.innerHeight - $('.navbar').height());
  }

  /* request user location function */
  var getLocation = function(pass) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos){
        var uloc = new google.maps.LatLng(pos.coords.latitude,
                                          pos.coords.longitude);
        pass(uloc);
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
  
  var placeUserMarker = function() {
    getLocation(function(uloc){
      console.log("Placing marker", uloc, "on", map);
      if(map != null) {
        var userMarker = new google.maps.Marker({
          position: uloc,
          map: map,
          title: 'You'
          });
      }
    });
  };

  var getUserMarker = function() {
    
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
});

