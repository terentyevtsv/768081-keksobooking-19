'use strict';

// модуль, который управляет карточками объявлений и метками:
// добавляет на страницу нужную карточку, отрисовывает метки
// и осуществляет взаимодействие карточки и метки на карте
(function () {
  var mapSectionElement = document.querySelector('.map');
  var mapPinsContainerElement = mapSectionElement.querySelector('.map__pins');

  var onError = function (message) {
    window.form.isActive = false;
    window.form.showReceiveErrorNotification();
    return message;
  };

  var titleFieldElement = document.querySelector('#title');
  var priceFieldElement = document.querySelector('#price');
  var roomNumberSelectorElement = document.querySelector('#room_number');
  var guestNumberSelectorElement = document.querySelector('#capacity');

  window.form.isActive = false;
  var activateMap = function () {
    if (!window.form.isActive) {
      window.form.isActive = true;

      window.card.close();
      window.pin.render(onError);

      titleFieldElement.addEventListener('invalid', window.form.onAdvertisementFieldsInvalid);
      priceFieldElement.addEventListener('invalid', window.form.onAdvertisementFieldsInvalid);
      roomNumberSelectorElement.addEventListener('invalid', window.form.onAdvertisementFieldsInvalid);
      guestNumberSelectorElement.addEventListener('invalid', window.form.onAdvertisementFieldsInvalid);
    }
  };

  var mainMapPinElement = mapSectionElement.querySelector('.map__pins .map__pin--main');
  mainMapPinElement.addEventListener('mousedown', function (evt) {
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

  mainMapPinElement.addEventListener('keydown', function (evt) {
    window.utils.isEnterEvent(evt, function () {
      activateMap();
      window.form.fillAddress(0, 0);
    });
  });

  var onMapPinsContainerClick = function (evt) {
    var targetMapPinElement = evt.target.closest('button');
    if (evt.target.matches('.map__pin') || targetMapPinElement) {
      var currentMapPinElement = evt.target;
      var index = evt.target.getAttribute('data-adv-id');
      if (index === null) {
        currentMapPinElement = targetMapPinElement;
        index = targetMapPinElement.getAttribute('data-adv-id');
      }

      if (index !== null) {
        // Пин точно не главный, т.к. у него нет индекса объявления
        var activePinElement = mapPinsContainerElement.querySelector('.map__pin--active');
        if (activePinElement !== null) {
          activePinElement.classList.remove('map__pin--active');
        }

        // Если есть открытая карточка то сначала закрываем её
        var currentMapCardElement = mapSectionElement.querySelector('.map__card');
        if (currentMapCardElement !== null) {
          mapSectionElement.removeChild(currentMapCardElement);
        }

        var advertisement = window.pinHelper.advertisementMapPins[index];
        var mapCardElement = window.card.fillAdvertisement(advertisement);
        var mapFiltersContainerElement = mapSectionElement
            .querySelector('.map__filters-container');
        mapSectionElement.insertBefore(mapCardElement, mapFiltersContainerElement);

        document.addEventListener('keydown', window.card.onDialogEscPress);

        var popupCloseElement = mapCardElement.querySelector('.popup__close');
        popupCloseElement.addEventListener('click', function () {
          window.card.close();
        });

        currentMapPinElement.classList.add('map__pin--active');
      }
    }
  };

  mapPinsContainerElement.addEventListener('click', onMapPinsContainerClick);

  window.form.disable(true);
  window.form.fillAddress(0, 0);

  window.formHelper.makeGuestRoomsValidation(roomNumberSelectorElement, guestNumberSelectorElement);
  window.form.makeTypeMinPriceValidation();
})();
