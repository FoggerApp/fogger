/* NAVIGATOR MODULE */
(function () {
  "use strict";

  if (!window.hasOwnProperty("fogger")) {
    throw new Error("Requires fogger global");
  }

  /* PRIVATE variables */
  var currentPosition = {
    timestamp: null,
    coords: {
      latitude: null,
      longitude: null
    }
  };

  /* FUNCTIONS */
  /* Set Current Position */
  function setCurrentPosition(pos) {
    currentPosition.timestamp = pos.timestamp;
    currentPosition.coords.latitude = pos.coords.latitude;
    currentPosition.coords.longitude = pos.coords.longitude;
  }

  /* Get Current Position */
  function getCurrentPosition(success, error) {
    if (currentPosition === null) {
      var err = {
        code: 0,
        message: "Could not get current position."
      };
      if (error === 'undefined') {
        console.log(err.code, err.message);
      } else {
        error(err);
      }
    } else {
      currentPosition.coords.latitude += 0.0001;
      currentPosition.coords.longitude += 0.0001;
      currentPosition.timestamp = new Date().getTime();
      success(currentPosition);
    }
  }

  /* Watch Position */
  function watchPosition(success, error, options) {
    getCurrentPosition(success, error, options);
    var interval = setInterval(function () {
      getCurrentPosition(success, error, options);
    }, 920);

    setTimeout(function () {
      clearInterval(interval);
    }, 10000);
  }

  /* INIT */
  function init(success, error) {
    navigator.geolocation.getCurrentPosition(
      function (uloc) {
        setCurrentPosition(uloc);
        success();
      },
      function (err) {
        if (error === 'undefined') {
          console.log("Failed to load navigator module.");
          console.log(err.code, err.message);
        } else {
          error(err);
        }
      }
    );
  }

  /* set GLOBAL namespace */
  fogger.navigator = {
    mock: true,
    init: init,
    geolocation: {
      getCurrentPosition: getCurrentPosition,
      watchPosition: watchPosition
    },
    setCurrentPosition: setCurrentPosition
  };

}());