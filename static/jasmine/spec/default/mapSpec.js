/**
 * @module test
 * @class MapSpec
 */
(function() {
  "use strict";

  /**
   *
   * Test the import of modules
   *
   */
  describe("default/map view import test", function() {

    it("loads the fogger global", function() {
      expect(typeof fogger).toBe('object');
    });

    it("loads the mock navigator module", function() {
      expect(typeof fogger.navigator).toBe('object');
      expect(typeof fogger.navigator.mock).toBe('boolean');
      expect(fogger.navigator.mock).toBe(true);
    });

    it("loads the pointToDistance module", function() {
      expect(typeof pointToDistance).toBe('function');
    });

    it("loads the map module", function() {
      expect(typeof fogger.map).toBe('object');
    });

    it("loads the interact module", function() {
      expect(typeof fogger.interact).toBe('object');
    });

  });

  /**
   *
   * Menu Tests
   *
   */
  describe("menu test", function() {
     it("display's the test once it's clicked", function(done) {
        expect($('#drop6').length).toBe(1);
        expect($('#menu3').is(":visible")).toBe(false);
        $('#drop6').mouseover();
        expect($('#menu3').is(":visible")).toBe(true);
        $('#drop6').mouseout();
        /* wait for transition */
        setTimeout(function(){
          expect($('#menu3').is(":visible")).toBe(false);
          done();
        }, 1000);
     });
  });

  /**
   *
   * Interface Tests
   *
   */
  describe("interface test", function() {
    it("creates the Interface layer", function() {
      expect($('#map-interface').length).toBe(1);
      expect($('#map-view').length).toBe(1);
      expect($('#map-terrain').length).toBe(1);
    });
    it("centered map to user location", function(done) {
      google.maps.event.addDomListenerOnce(fogger.map.getMap(), 'idle', function() {
        expect(
          Math.abs(fogger.map.getMap().getCenter().lat() - fogger.map.getUserLocation().lat()) < 0.000001
        ).toBe(true);
        expect(
          Math.abs(fogger.map.getMap().getCenter().lng() - fogger.map.getUserLocation().lng()) < 0.000001
        ).toBe(true);
        done();
      });
    });
    it("initially sets follow to true", function(){
      expect(fogger.map.getFollow()).toBe(true);
    });
    it("unfollows on mouse down and follows on goTo click", function(done){
     $("#map-canvas-container").mousedown();
     expect(fogger.map.getFollow()).toBe(false);
     $("#map-goto").click();
     setTimeout(function(){
        expect(fogger.map.getFollow()).toBe(true);
        done();
      }, 400);
    });
  });

  /**
   *
   * Restful API Tests
   *
   */
  describe("RestAPI test", function() {
   jasmine.DEFAULT_TIMEOUT_INTERVAL=20000;
   it("GET from RestAPI single users locations within bounds", function(done) {
      $.get("/fogger/default/api.json/location/1?nelat=60&nelng=60&swlat=40&swlng=40")
        .done(function(d, txt) {
          expect(txt).toEqual("success");
          done();
        })
        .fail(function() {
          expect("").toBe("API fail callback called.");
          done();
        });
    });
    it("GET from RestAPI all users locations within bounds", function(done) {
      $.get("/fogger/default/api.json/location?nelat=60&nelng=60&swlat=40&swlng=40")
        .done(function(d, txt) {
          expect(txt).toEqual("success");
          done();
        })
        .fail(function() {
          expect("").toBe("API fail callback called.");
          done();
        });
    });
    it("GET from RestAPI single users most recent location within bounds", function(done) {
      $.get("/fogger/default/api.json/location/1/recent?nelat=60&nelng=60&swlat=40&swlng=40")
        .done(function(d, txt) {
          expect(txt).toEqual("success");
          done();
        })
        .fail(function() {
          expect("").toBe("API fail callback called.");
          done();
        });
    });
    it("GET from RestAPI all users most recent locations within bounds", function(done) {
      $.get("/fogger/default/api.json/location/recent?nelat=60&nelng=60&swlat=40&swlng=40")
        .done(function(d, txt) {
          expect(txt).toEqual("success");
          done();
        })
        .fail(function() {
          expect("").toBe("API fail callback called.");
          done();
        });
    });
    it("GET from RestAPI single users points", function(done) {
      $.get("/fogger/default/api.json/points/1")
        .done(function(d, txt) {
          expect(txt).toEqual("success");
          done();
        })
        .fail(function() {
          expect("").toBe("API fail callback called.");
          done();
        });
    });
    it("GET from RestAPI all users points", function(done) {
      $.get("/fogger/default/api.json/points")
        .done(function(d, txt) {
          expect(txt).toEqual("success");
          done();
        })
        .fail(function() {
          expect("").toBe("API fail callback called.");
          done();
        });
    });

    it("POST to RestAPI", function(done) {
      var data = {
        "loc": {
          "lat": 50.00,
          "lng": 50.00
        },
        "uid": 1
      };
      $.post(
          "/fogger/default/api.json/location",
          JSON.stringify(data),
          null,
          'json'
        )
        .done(function(d, txt) {
          expect(d.errors.length).toEqual(0);
          expect(txt).toEqual("success");
          done();
        })
        .fail(function() {
          expect("").toBe("API fail callback called.");
          done();
        });
    });
  });

  /**
   *
   * Graphics Module Tests
   *
   */
  describe("test map mask 3.a, 3.b, 3.c, 3.d", function() {
     it("Creates a canvas", function() {
        expect($('#map-mask').length).toBe(1);
        expect(window.innerHeight - $('.navbar').height())
          .toBe(parseInt($('#map-mask').attr('height')));
     });
  });

  /**
   *
   * Mock navigator module test
   *
   */
  describe("default/map view mock navigator test", function() {
    var init = false;
    beforeEach(function(done) {
      if (init) {
        done();
      } else {
        fogger.navigator.init(done);
        init = true;
      }
    });

    it("initializes currentPosition on init", function() {
      var position = fogger.navigator.getPosition();
      expect(position).not.toBeNull();
      expect(position.hasOwnProperty("timestamp")).toBe(true);
      expect(position.hasOwnProperty("coords")).toBe(true);
      expect(position.coords.hasOwnProperty("latitude")).toBe(true);
      expect(position.coords.hasOwnProperty("longitude")).toBe(true);
      expect(position.coords.latitude).not.toBeNull();
      expect(position.coords.longitude).not.toBeNull();
    });

    it("sets position on setPosition and setCurrentPosition", function() {
      var pos = {
        timestamp: 123,
        coords: {
          latitude: 44.63741290000001,
          longitude: -63.5873095
        }
      };
      fogger.navigator.setPosition(pos);
      expect(fogger.navigator.getPosition()).toBe(pos);
      fogger.navigator.setPosition(null);
      expect(fogger.navigator.getPosition()).toBeNull();
      fogger.navigator.setPosition({
        timestamp: 321,
        coords: {
          latitude: 44.638,
          longitude: -63.901
        }
      });
      pos = fogger.navigator.getPosition();
      expect(pos.timestamp).toEqual(321);
      expect(pos.coords.latitude).toEqual(44.638);
      expect(pos.coords.longitude).toEqual(-63.901);
      fogger.navigator.setCurrentPosition({
        timestamp: 123,
        coords: {
          latitude: 44.63741290000001,
          longitude: -63.5873095
        }
      });
      expect(pos.timestamp).toEqual(123);
      expect(pos.coords.latitude).toEqual(44.63741290000001);
      expect(pos.coords.longitude).toEqual(-63.5873095);
    });

    it("gets user position on getCurrentPosition", function(done) {
      var pos = {
        timestamp: 123,
        coords: {
          latitude: 44.63741290000001,
          longitude: -63.5873095
        }
      };
      fogger.navigator.setPosition(pos);
      fogger.navigator.geolocation.getCurrentPosition(function() {
        expect(pos.timestamp).not.toEqual(123);
        expect(pos.coords.latitude).not.toEqual(44.63741290000001);
        expect(pos.coords.longitude).not.toEqual(-63.5873095);
        done();
      });
    });

    it("updates your location on watchPosition", function(done) {
      var prev = null,
        isDone = false,
        success = function(curr) {
          if ((prev !== null) && !isDone) {
            expect(
              Math.abs(curr.coords.latitude - prev.coords.latitude) < 0.01
            ).toBe(true);
            expect(
              Math.abs(curr.coords.longitude - prev.coords.longitude) < 0.01
            ).toBe(true);
            done();
            isDone = true;
          } else {
            prev = curr;
          }
        };
      fogger.navigator.geolocation.watchPosition(success);
    });
  });

  /**
   * 
   * Map module test
   * 
   */
  describe("default/map view map module test", function() {
    it("initialized the map", function() {
      expect(fogger.map.getMap()).not.toBeNull();
    });

    it("set the height of the map-container",
      function() {
        expect($('#map-canvas').height())
          .toBe(window.innerHeight - $('.navbar').height());
      });

    it("placed a user marker", function(done) {
      google.maps.event.addDomListenerOnce(fogger.map.getMap(), 'idle', function() {
        var marker = fogger.map.getUserMarker();
        expect(marker).not.toBeNull();
        expect(marker.getPosition().lat() - fogger.map.getUserLocation().lat()).not.toBeGreaterThan(0.000001);
        expect(marker.getPosition().lng() - fogger.map.getUserLocation().lng()).not.toBeGreaterThan(0.000001);
        done();
      });
    });

    it("simulates user movement", function(done) {
      fogger.navigator.geolocation.getCurrentPosition(function(pos) {
        var userLocation = fogger.map.getUserLocation(),
          userMarker = fogger.map.getUserMarker().getPosition(),
          map = fogger.map.getMap().getCenter(),
          cUserLocation,
          cUserMarker,
          cMap;
        fogger.map.updateLocation(pos);
        cUserLocation = fogger.map.getUserLocation();
        cUserMarker = fogger.map.getUserMarker().getPosition();
        cMap = fogger.map.getMap().getCenter();
        expect(
          userLocation.lat() - cUserLocation.lat()
        ).not.toBeGreaterThan(0.001);
        expect(
          userLocation.lng() - cUserLocation.lng()
        ).not.toBeGreaterThan(0.001);
        expect(
          userMarker.lat() - cUserMarker.lat()
        ).not.toBeGreaterThan(0.001);
        expect(
          userMarker.lng() - cUserMarker.lng()
        ).not.toBeGreaterThan(0.001);
        expect(
          map.lat() - cMap.lat()
        ).not.toBeGreaterThan(0.001);
        expect(
          map.lng() - cMap.lng()
        ).not.toBeGreaterThan(0.001);
        done();
      });
    });

    it("posts the user's current position", function(done) {
        var data = {
          uid: fogger.user.id,
          loc: {
            lat: fogger.map.getUserLocation().lat(),
            lng: fogger.map.getUserLocation().lng()
          }
        };
        fogger.map.postUserLocation(data, function(d) {
          expect(d.errors.length === 0).toBe(true);
          done();
        }, function() {
          expect(true).toBe(false);
          done();
        });
    });

  }); //end describe default/map view map module test

}()); //end module
