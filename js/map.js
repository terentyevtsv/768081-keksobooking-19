'use strict';

// модуль, который управляет карточками объявлений и метками:
// добавляет на страницу нужную карточку, отрисовывает метки
// и осуществляет взаимодействие карточки и метки на карте
(function () {
  var mapSection = document.querySelector('.map');
  var mapPinsContainer = mapSection.querySelector('.map__pins');

  var onError = function (message) {
    window.form.isActive = false;
    window.form.showReceiveErrorNotification();
    return message;
  };

  window.form.isActive = false;
  var activateMap = function () {
    if (!window.form.isActive) {
      window.form.isActive = true;

      window.card.close();
      window.pin.render(onError);
    }
  };

  var mainMapPin = mapSection.querySelector('.map__pins .map__pin--main');
  mainMapPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    window.utils.isLeftMouseButtonEvent(evt, function () {
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        window.form.fillAddress(shift.x, shift.y);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        activateMap();
        window.form.fillAddress(0, 0);
      };

      activateMap();

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  });

  mainMapPin.addEventListener('keydown', function (evt) {
    window.utils.isEnterEvent(evt, function () {
      activateMap();
      window.form.fillAddress(0, 0);
    });
  });

  var onMapPinsContainerClick = function (evt) {
    var targetMapPin = evt.target.closest('button');
    if (evt.target.matches('.map__pin') || targetMapPin) {
      var currentMapPin = evt.target;
      var index = evt.target.getAttribute('data-adv-id');
      if (index === null) {
        currentMapPin = targetMapPin;
        index = targetMapPin.getAttribute('data-adv-id');
      }

      if (index !== null) {
        // Пин точно не главный, т.к. у него нет индекса объявления
        var activePin = mapPinsContainer.querySelector('.map__pin--active');
        if (activePin !== null) {
          activePin.classList.remove('map__pin--active');
        }

        // Если есть открытая карточка то сначала закрываем её
        var currentMapCard = mapSection.querySelector('.map__card');
        if (currentMapCard !== null) {
          mapSection.removeChild(currentMapCard);
        }

        var advertisement = window.pinHelper.advertisementMapPins[index];
        var mapCard = window.card.fillAdvertisement(advertisement);
        var mapFiltersContainer = mapSection
            .querySelector('.map__filters-container');
        mapSection.insertBefore(mapCard, mapFiltersContainer);

        document.addEventListener('keydown', window.card.onDialogEscPress);

        var popupClose = mapCard.querySelector('.popup__close');
        popupClose.addEventListener('click', function () {
          window.card.close();
        });

        currentMapPin.classList.add('map__pin--active');
      }
    }
  };

  mapPinsContainer.addEventListener('click', onMapPinsContainerClick);

  window.form.disable();
  window.form.fillAddress(0, 0);

  var roomNumberSelector = document.querySelector('#room_number');
  var guestNumberSelector = document.querySelector('#capacity');
  window.formHelper.makeGuestRoomsValidation(roomNumberSelector, guestNumberSelector);
  window.form.makeTypeMinPriceValidation();
})();
