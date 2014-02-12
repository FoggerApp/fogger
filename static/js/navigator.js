/* NAVIGATOR MODULE */
(function () {
  "use strict";

  if (!window.hasOwnProperty("fogger")) {
    throw new Error("Requires fogger global");
  }

  /* PRIVATE variables */
  var position = {
    timestamp: null,
    coords: {
      latitude: null,
      longitude: null
    }
  };

  /* FUNCTIONS */
  function getPosition() {
    return position;
  }

  function setPosition(pos) {
    position = pos;
  }
  /* Set Current Position */
  function setCurrentPosition(pos) {
    position.timestamp = pos.timestamp;
    position.coords.latitude = pos.coords.latitude;
    position.coords.longitude = pos.coords.longitude;
  }

  /* Get Current Position */
  function getCurrentPosition(success, error) {
    if (position === null) {
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
      position.coords.latitude += 0.0001;
      position.coords.longitude += 0.0001;
      position.timestamp = new Date().getTime();
      success(position);
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
    }, 60000);
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
    getPosition: getPosition,
    setPosition: setPosition,
    setCurrentPosition: setCurrentPosition
  };

}());