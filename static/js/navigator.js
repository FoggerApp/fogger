/**
 * Provides navigator functionality and simulates
 * user movement.
 *
 * @module fogger 
 * @class navigator
 * @main navigator
 */
(function () {
  "use strict";

  if (!window.hasOwnProperty("fogger")) {
    throw new Error("Requires fogger global");
  }

  /**
  * Object that is returned by 
  * navigator.geolocation.getCurrentPosition()
  *
  * @private position
  * @type Geolocation
  */
  var position = {
    timestamp: null,
    coords: {
      latitude: null,
      longitude: null
    }
  };

  /* FUNCTIONS */
  /**
  * Gets position.
  * @method getPosition
  * @return position
  */
  function getPosition() {
    return position;
  }

  /**
  * Sets position.
  * @method setPosition
  * @param {Geolocation} pos
  */
  function setPosition(pos) {
    position = pos;
  }

  /**
   * Takes a Geolocation object and parses
   * it to update position.
   * @method setCurrentPosition
   * @param {Geolocation} pos
   */
  function setCurrentPosition(pos) {
    position.timestamp = pos.timestamp;
    position.coords.latitude = pos.coords.latitude;
    position.coords.longitude = pos.coords.longitude;
  }

  /* 
  * Mocks a navigator call by incrementing the
  * position coords
  * @method getCurrentPosition
  * @param {callback} success Callback to execute
  * on success.
  * @param {callback} error Callback to execute on 
  * failure to retrieve geolocation.
  * @async
  */
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

  /* 
  * Mocks a navigator call by incrementing the
  * position coords at an interval.
  * @method watchPosition
  * @param {callback} success Callback to execute
  * on success for each interval.
  * @param {callback} error Callback to execute on 
  * failure to retrieve geolocation.
  * @async
  */
  function watchPosition(success, error, options) {
    getCurrentPosition(success, error, options);
    var interval = setInterval(function () {
      getCurrentPosition(success, error, options);
    }, 920);

    setTimeout(function () {
      clearInterval(interval);
    }, 60000);
  }

  /**
  * Sets initial position to the user's
  * actual position.
  * @class navigator
  * @constructor
  */
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

  /**
  * @module fogger
  * @class navigator
  */
  fogger.navigator = {
    /**
    * Indicates wether the module uses mock coords.
    * @property mock
    * @type boolean
    * @default true
    */
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
