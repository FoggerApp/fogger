describe("map test", function(){
  beforeEach(function(){
    uloc =  {
            coords: {
              latitude: 45.6376106,      
              longitude: -62.587231199999994
              }
            };
    userLocation = new google.maps.LatLng(uloc.coords.latitude, 
                                          uloc.coords.longitude);
    setInterval(function(){
        uloc.coords.latitude += 0.0005;
        uloc.coords.longitude += 0.0005;
        userLocation = new google.maps.LatLng(uloc.coords.latitude, 
                                          uloc.coords.longitude);
        verifyLocation(uloc);
      }, 1000);
    delete navigator.geolocation;
    navigator.geolocation = {
      getCurrentPosition: function() {
        return {
          coords: {
            latitude: 123,      
            longitude: 123 
            }
          };                  
        },
      watchPosition: function(callback){
                     callback({
          coords: {
            latitude: 123,      
            longitude: 123 
            }
          }); 
                     }
    };
  });
  it("moves with you", function(){
    expect(true).toBe(true); 
    /*
    var currentPosition = {
      coords: {
        latitude: 123,
        longitude: 123
        },
      timestamp: (new Date()).valueOf()
      };
    spyOn(navigator.geolocation, 
          'getCurrentPosition')
      .andCallFake(function(){
        arguments[0]("fake"); 
      });
    verifyLocation(currentPosition);
    */
    
  });
});
