'use strict';

// модуль, который отвечает за создание метки на карте
(function () {
  var mapPinTemplate = document
      .querySelector('#pin')
      .content
      .querySelector('.map__pin');

  window.pin = {
    renderMapPin: function (advertisement) {
      var mapPin = mapPinTemplate.cloneNode(true);

      var icon = mapPin.querySelector('img');
      icon.src = advertisement.author.avatar;
      icon.alt = advertisement.offer.title;

      return mapPin;
    }
  };
})();
