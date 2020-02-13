'use strict';

// модуль, который отвечает за создание метки на карте
(function () {
  var mapPinTemplate = document
      .querySelector('#pin')
      .content
      .querySelector('.map__pin');

  var mapSection = document.querySelector('.map');
  var mapPinsContainer = mapSection.querySelector('.map__pins');

  var renderMapPin = function (advertisement) {
    var mapPin = mapPinTemplate.cloneNode(true);

    var icon = mapPin.querySelector('img');
    icon.src = advertisement.author.avatar;
    icon.alt = advertisement.offer.title;

    return mapPin;
  };

  var advertisementMapPins = [];

  var onSuccess = function (data) {
    var fragment = document.createDocumentFragment();
    var advertisements = [];
    for (var i = 0; i < data.length; ++i) {
      if (!data[i].hasOwnProperty('offer')) {
        continue;
      }

      advertisements[i] = data[i];
      var mapPin = renderMapPin(data[i]);
      fragment.appendChild(mapPin);
    }

    mapPinsContainer.appendChild(fragment);

    var mapPins = mapPinsContainer.querySelectorAll('.map__pin');
    advertisementMapPins.length = 0;

    if (mapPins.length > 1) {
      // Если вставлены еще другие пины кроме главного устанавливаем их координаты
      for (var j = 0; j < advertisements.length; ++j) {
        // j + 1, потому что главный пин не учитывается, он уже отрисован
        // Координаты пина это координаты его верхнего левого угла.
        // Смещаем пин вдоль осей, чтобы координата острия пина совпала с координатой location
        // Проводим эти операции после рендеринга, т.к. до этого размеры пинов неизвестны
        mapPins[j + 1].style.left =
          (advertisements[j].location.x - 0.5 * mapPins[j + 1].offsetWidth) + 'px';
        mapPins[j + 1].style.top =
          (advertisements[j].location.y - mapPins[j + 1].offsetHeight) + 'px';

        mapPins[j + 1].setAttribute('data-adv-id', j);
        advertisementMapPins[j] = advertisements[j];
      }
    }

    // после загрузки активация фильтра
    window.formHelper.enableFilter();
  };

  window.pin = {
    advertisementMapPins: advertisementMapPins,
    render: function () {
      var oldMapPins = mapPinsContainer.querySelectorAll('button[data-adv-id]');
      if (oldMapPins.length > 0) {
        for (var k = 0; k < oldMapPins.length; ++k) {
          mapPinsContainer.removeChild(oldMapPins[k]);
        }
      }

      window.data.loadAdvertisements(onSuccess);
    }
  };
})();
