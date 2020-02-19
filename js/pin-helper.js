'use strict';

(function () {
  var RENDERED_PINS_COUNT = 5;

  var mapSection = document.querySelector('.map');
  var mapPinsContainer = mapSection.querySelector('.map__pins');
  var mapPinTemplate = document
      .querySelector('#pin')
      .content
      .querySelector('.map__pin');

  var renderMapPin = function (advertisement) {
    var mapPin = mapPinTemplate.cloneNode(true);

    var icon = mapPin.querySelector('img');
    icon.src = advertisement.author.avatar;
    icon.alt = advertisement.offer.title;

    return mapPin;
  };

  window.pinHelper = {
    RENDERED_PINS_COUNT: RENDERED_PINS_COUNT,
    advertisementMapPins: [],
    remove: function () {
      var oldMapPins = mapPinsContainer.querySelectorAll('button[data-adv-id]');
      if (oldMapPins.length > 0) {
        for (var k = 0; k < oldMapPins.length; ++k) {
          mapPinsContainer.removeChild(oldMapPins[k]);
        }
      }
    },
    renderPins: function (advertisements) {
      window.pinHelper.remove();
      var fragment = document.createDocumentFragment();

      advertisements.forEach(function (advertisement) {
        var mapPin = renderMapPin(advertisement);
        fragment.appendChild(mapPin);
      });

      mapPinsContainer.appendChild(fragment);
      var mapPins = mapPinsContainer.querySelectorAll('.map__pin');

      window.pinHelper.advertisementMapPins.length = 0;
      if (mapPins.length > 1) {
        advertisements.forEach(function (advertisement, j) {
          // j + 1, потому что главный пин не учитывается, он уже отрисован
          // Координаты пина это координаты его верхнего левого угла.
          // Смещаем пин вдоль осей, чтобы координата острия пина совпала с координатой location
          // Проводим эти операции после рендеринга, т.к. до этого размеры пинов неизвестны
          mapPins[j + 1].style.left =
            (advertisement.location.x - 0.5 * mapPins[j + 1].offsetWidth) + 'px';
          mapPins[j + 1].style.top =
            (advertisement.location.y - mapPins[j + 1].offsetHeight) + 'px';

          mapPins[j + 1].setAttribute('data-adv-id', j);
          window.pinHelper.advertisementMapPins[j] = advertisement;
        });
      }
    }
  };
})();
