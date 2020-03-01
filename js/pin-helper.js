'use strict';

(function () {
  var RENDERED_PINS_COUNT = 5;

  var mapSectionElement = document.querySelector('.map');
  var mapPinsContainerElement = mapSectionElement.querySelector('.map__pins');
  var mapPinTemplateElement = document
      .querySelector('#pin')
      .content
      .querySelector('.map__pin');

  var renderMapPin = function (advertisement) {
    var mapPinElement = mapPinTemplateElement.cloneNode(true);

    var iconElement = mapPinElement.querySelector('img');
    iconElement.src = advertisement.author.avatar;
    iconElement.alt = advertisement.offer.title;

    return mapPinElement;
  };

  window.pinHelper = {
    RENDERED_PINS_COUNT: RENDERED_PINS_COUNT,
    advertisementMapPins: [],
    remove: function () {
      var oldMapPinElements = mapPinsContainerElement.querySelectorAll('button[data-adv-id]');
      if (oldMapPinElements.length > 0) {
        for (var k = 0; k < oldMapPinElements.length; ++k) {
          mapPinsContainerElement.removeChild(oldMapPinElements[k]);
        }
      }
    },
    renderPins: function (advertisements) {
      window.pinHelper.remove();
      var fragment = document.createDocumentFragment();

      advertisements.forEach(function (advertisement) {
        var mapPinElement = renderMapPin(advertisement);
        fragment.appendChild(mapPinElement);
      });

      mapPinsContainerElement.appendChild(fragment);
      var mapPinElements = mapPinsContainerElement.querySelectorAll('.map__pin');

      window.pinHelper.advertisementMapPins.length = 0;
      if (mapPinElements.length > 1) {
        advertisements.forEach(function (advertisement, j) {
          // j + 1, потому что главный пин не учитывается, он уже отрисован
          // Координаты пина это координаты его верхнего левого угла.
          // Смещаем пин вдоль осей, чтобы координата острия пина совпала с координатой location
          // Проводим эти операции после рендеринга, т.к. до этого размеры пинов неизвестны
          mapPinElements[j + 1].style.left =
            (advertisement.location.x - 0.5 * mapPinElements[j + 1].offsetWidth) + 'px';
          mapPinElements[j + 1].style.top =
            (advertisement.location.y - mapPinElements[j + 1].offsetHeight) + 'px';

          mapPinElements[j + 1].setAttribute('data-adv-id', j);
          window.pinHelper.advertisementMapPins[j] = advertisement;
        });
      }
    }
  };
})();
