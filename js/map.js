'use strict';

// модуль, который управляет карточками объявлений и метками:
// добавляет на страницу нужную карточку, отрисовывает метки
// и осуществляет взаимодействие карточки и метки на карте
(function () {
  var mapSection = document.querySelector('.map');
  var mapPinsContainer = mapSection.querySelector('.map__pins');

  var advertisementMapPins = [];
  var renderMapPins = function () {
    var advertisements = window.data.generateRandomAdvertisements();
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < advertisements.length; ++i) {
      var mapPin = window.pin.renderMapPin(advertisements[i]);
      fragment.appendChild(mapPin);
    }

    mapPinsContainer.appendChild(fragment);

    var mapPins = mapPinsContainer.querySelectorAll('.map__pin');

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
  };

  // Закрытие карточки
  var closeMapCard = function () {
    var mapCard = mapSection.querySelector('.map__card');
    mapSection.removeChild(mapCard);
    document.removeEventListener('keydown', onDialogEscPress);
  };

  var onDialogEscPress = function (evt) {
    window.utils.isEscEvent(evt, closeMapCard);
  };

  var onMapPinsContainerClick = function (evt) {
    var targetMapPin = evt.target.closest('button');
    if (evt.target.matches('.map__pin') || targetMapPin) {
      var index = evt.target.getAttribute('data-adv-id');
      if (index === null) {
        index = targetMapPin.getAttribute('data-adv-id');
      }
      if (index !== null) {
        // Пин точно не главный, т.к. у него нет индекса объявления

        // Если есть открытая карточка то сначала закрываем её
        var currentMapCard = mapSection.querySelector('.map__card');
        if (currentMapCard !== null) {
          mapSection.removeChild(currentMapCard);
        }

        var advertisement = advertisementMapPins[index];
        var mapCard = window.card.fillAdvertisementCard(advertisement);
        var mapFiltersContainer = mapSection
            .querySelector('.map__filters-container');
        mapSection.insertBefore(mapCard, mapFiltersContainer);

        document.addEventListener('keydown', onDialogEscPress);

        var popupClose = mapCard.querySelector('.popup__close');
        popupClose.addEventListener('click', function () {
          closeMapCard();
        });
      }
    }
  };

  var activateMap = function () {
    renderMapPins();

    window.form.enableForms();
    window.form.fillAddress(true);

    mapPinsContainer.addEventListener('click', onMapPinsContainerClick);
  };

  var mainMapPin = mapSection.querySelector('.map__pins .map__pin--main');
  mainMapPin.addEventListener('mousedown', function (evt) {
    window.utils.isLeftMouseButtonEvent(evt, activateMap);
  });

  mainMapPin.addEventListener('keydown', function (evt) {
    window.utils.isEnterEvent(evt, activateMap);
  });

  window.form.disableForms();
  window.form.fillAddress(false);

  var roomNumberSelector = document.querySelector('#room_number');
  var guestNumberSelector = document.querySelector('#capacity');
  window.form.makeGuestRoomsValidation(roomNumberSelector, guestNumberSelector);
  window.form.makeTypeMinPriceValidation();
})();
