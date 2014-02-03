describe("map test", function(){
  it("moves with you", function(){
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
  });
});
