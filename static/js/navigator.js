/**
 * Provides navigator functionality and simulates
 * user movement.
 *
 * @module fogger 
 * @class navigator
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
      latitude: 44.63741290000001,
      longitude: -63.5873095
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

  function randomDirection(){
    return Math.PI * Math.random();
  }

  function randomNumSteps(){
    return 15 * Math.random() + 5;
  }

  function polarToCartesian(a, r){
    return {
      x: r * Math.cos(a),
      y: r * Math.sin(a)
    }
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
  var numSteps = randomNumSteps();
  var currStep = 0;
  var direction = randomDirection();
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
      if(currStep > numSteps){
        currStep = 0;
        numSteps = randomNumSteps();
        direction = randomDirection();
      }
      var coord = polarToCartesian(direction, 0.0001);
      position.coords.latitude += coord.y;
      position.coords.longitude += coord.x;
      currStep++;
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
    }, 800);
  }

  /**
  * Sets initial position to the user's
  * actual position.
  * @method init
  */
  function init(success, error) {
    success();
  }

  /* set the global namespace */
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
