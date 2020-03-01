'use strict';

// модуль, который создаёт данные
(function () {
  var BUILDING_TYPES = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];

  var MIN_COORDINATE_Y = 130;
  var MAX_COORDINATE_Y = 630;

  window.data = {
    BUILDING_TYPES: BUILDING_TYPES,
    MIN_COORDINATE_Y: MIN_COORDINATE_Y,
    MAX_COORDINATE_Y: MAX_COORDINATE_Y,
    loadAdvertisements: function (onSuccess, onError) {
      window.load.getData('https://js.dump.academy/keksobooking/data', onSuccess, onError);
    },
    allAdvertisements: []
  };
})();
