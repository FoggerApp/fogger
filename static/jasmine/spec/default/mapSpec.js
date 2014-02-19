/**
 * @module test
 * @class MapSpec
 */
(function () {
  "use strict";
  describe("RestAPI test Get", function () {
    it("accesses RESTful API", function (done) {
      $.get("/fogger/default/api.json/location/1?nelat=60&nelng=60&swlat=40&swlng=40")
        .done(function (d, txt) {
          //              console.log(d, txt, xhr);
          expect(d.errors.length).toEqual(0);
          expect(txt).toEqual("success");
          done();
        })
        .fail(function () {
          expect("").toBe("API taking too long");
          done();
        });
    });
  });

  describe("RestAPI test Post", function () {
    it("posts the user location to the database", function (done) {
      var data = {
        "loc": {
          "lat": 50,
          "lng": 50
        },
        "uid": 1
      };
      $.post("/fogger/default/api.json/location", JSON.stringify(data))
        .done(function (d, txt) {
          //console.log(d.content);
          expect(d.content.id).toBeGreaterThan(-1);
          expect(d.errors.length).toEqual(0);
          expect(txt).toEqual("success");
          done();
        })
        .fail(function () {
          expect("").toBe("API taking too long");
          done();
        });
    });
  });


  describe("default/map view import test", function () {

    it("loads the fogger global", function () {
      expect(typeof fogger).toBe('object');
    });

    it("loads the mock navigator module", function () {
      expect(typeof fogger.navigator).toBe('object');
      expect(typeof fogger.navigator.mock).toBe('boolean');
      expect(fogger.navigator.mock).toBe(true);
    });

    it("loads the mock navigator module", function () {
      expect(typeof pointToDistance).toBe('function');
    });

    it("loads the map module", function () {
      expect(typeof fogger.map).toBe('object');
    });

  });

  describe("default/map view mock navigator test", function () {
    var init = false;
    beforeEach(function (done) {
      if (init) {
        done();
      } else {
        fogger.navigator.init(done);
        init = true;
      }
    });

    it("initializes currentPosition on init", function () {
      var position = fogger.navigator.getPosition();
      expect(position).not.toBeNull();
      expect(position.hasOwnProperty("timestamp")).toBe(true);
      expect(position.hasOwnProperty("coords")).toBe(true);
      expect(position.coords.hasOwnProperty("latitude")).toBe(true);
      expect(position.coords.hasOwnProperty("longitude")).toBe(true);
      expect(position.coords.latitude).not.toBeNull();
      expect(position.coords.longitude).not.toBeNull();
    });

    it("sets position on setPosition and setCurrentPosition", function () {
      var pos = {
        timestamp: 123,
        coords: {
          latitude: 65.1,
          longitude: -45.01
        }
      };
      fogger.navigator.setPosition(pos);
      expect(fogger.navigator.getPosition()).toBe(pos);
      fogger.navigator.setPosition(null);
      expect(fogger.navigator.getPosition()).toBeNull();
      fogger.navigator.setPosition({
        timestamp: 321,
        coords: {
          latitude: 10.4,
          longitude: 25.10284
        }
      });
      pos = fogger.navigator.getPosition();
      expect(pos.timestamp).toEqual(321);
      expect(pos.coords.latitude).toEqual(10.4);
      expect(pos.coords.longitude).toEqual(25.10284);
      fogger.navigator.setCurrentPosition({
        timestamp: 123,
        coords: {
          latitude: 65.1,
          longitude: -45.01
        }
      });
      expect(pos.timestamp).toEqual(123);
      expect(pos.coords.latitude).toEqual(65.1);
      expect(pos.coords.longitude).toEqual(-45.01);
    });

    it("gets user position on getCurrentPosition", function (done) {
      var pos = {
        timestamp: 123,
        coords: {
          latitude: 65.1,
          longitude: -45.01
        }
      };
      fogger.navigator.setPosition(pos);
      fogger.navigator.geolocation.getCurrentPosition(function () {
        expect(pos.timestamp).not.toEqual(123);
        expect(pos.coords.latitude).not.toEqual(65.1);
        expect(pos.coords.longitude).not.toEqual(-45.01);
        done();
      });
    });

    it("updates your location on watchPosition", function (done) {
      var prev = null,
        isDone = false,
        success = function (curr) {
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

  describe("default/map view map module test", function () {
    var init = false;
    beforeEach(function (done) {
      if (init) {
        done();
      } else {
        console.log("done map init");
        fogger.map.init(done);
        init = true;
      }
    });

    it("initialized the map", function () {
      expect(fogger.map.getMap()).not.toBeNull();
    });

    it("set the height of the map-container",
      function () {
        expect($('#map-canvas').height())
          .toBe(window.innerHeight - $('.navbar').height());
      });

    it("centered map to user location", function () {
      expect(
        Math.abs(fogger.map.getMap().getCenter().lat() - fogger.map.getUserLocation().lat()) < 0.0000001
      ).toBe(true);
      expect(
        Math.abs(fogger.map.getMap().getCenter().lng() - fogger.map.getUserLocation().lng()) < 0.0000001
      ).toBe(true);
    });

    it("placed a user marker", function () {
      var marker = fogger.map.getUserMarker();
      expect(marker).not.toBeNull();
      expect(marker.getPosition().lat() - fogger.map.getUserLocation().lat()).not.toBeGreaterThan(0.0000001);
      expect(marker.getPosition().lng() - fogger.map.getUserLocation().lng()).not.toBeGreaterThan(0.0000001);
    });

    it("simulates user movement", function (done) {
      fogger.navigator.geolocation.getCurrentPosition(function (pos) {
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
        ).not.toBeGreaterThan(0.0000001);
        expect(
          userLocation.lng() - cUserLocation.lng()
        ).not.toBeGreaterThan(0.0000001);
        expect(
          userMarker.lat() - cUserMarker.lat()
        ).not.toBeGreaterThan(0.0000001);
        expect(
          userMarker.lng() - cUserMarker.lng()
        ).not.toBeGreaterThan(0.0000001);
        expect(
          map.lat() - cMap.lat()
        ).not.toBeGreaterThan(0.0000001);
        expect(
          map.lng() - cMap.lng()
        ).not.toBeGreaterThan(0.0000001);
        done();
      });
    });

  });
}());