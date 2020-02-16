'use strict';

(function () {
  var mapSection = document.querySelector('.map');
  var mapCheckFilter = mapSection.querySelector('.map__filters .map__features');
  var mapSelectFilters = mapSection.querySelectorAll('.map__filters .map__filter');
  var adForm = document.querySelector('.notice .ad-form');
  var adFormHeader = adForm.querySelector('.ad-form-header');
  var adFormElements = adForm.querySelectorAll('.ad-form__element');
  var roomNumberSelector = document.querySelector('#room_number');
  var guestNumberSelector = document.querySelector('#capacity');
  var housingTypeSelector = mapSection.querySelector('#housing-type');

  window.formHelper = {
    onHousingTypeSelectorChange: function () {
      var type = housingTypeSelector[housingTypeSelector.selectedIndex].value;
      var renderingAdvertisements = window.data.allAdvertisements;
      if (type !== 'any') {
        renderingAdvertisements = renderingAdvertisements.filter(function (advertisement) {
          return advertisement.offer.type === type;
        });
      }
      renderingAdvertisements = renderingAdvertisements
        .slice(0, window.pinHelper.RENDERED_PINS_COUNT);

      window.pinHelper.renderPins(renderingAdvertisements);
    },
    enableFilter: function () {
      // Показ формы фильтров
      mapCheckFilter.removeAttribute('disabled');
      for (var j = 0; j < mapSelectFilters.length; ++j) {
        mapSelectFilters[j].removeAttribute('disabled');
      }

      housingTypeSelector.addEventListener(
          'change',
          window.formHelper.onHousingTypeSelectorChange
      );

      if (mapSection.classList.contains('map--faded')) {
        mapSection.classList.remove('map--faded');
      }
    },
    makeGuestRoomsValidation: function (roomSelector, guestSelector) {
      var roomNumber = parseInt(
          roomNumberSelector.options[roomNumberSelector.selectedIndex].value,
          10
      );
      var guestNumber = parseInt(
          guestNumberSelector.options[guestNumberSelector.selectedIndex].value,
          10
      );
      var message = '';

      switch (roomNumber) {
        case 1:
        case 2:
        case 3:
          if (guestNumber > roomNumber || guestNumber === 0) {
            message = 'В ' + roomNumber + '-комнатный номер количество гостей не более ' +
              roomNumber + ' и не менее 1';
          }
          break;

        case 100:
          if (guestNumber !== 0) {
            message = '100-комнатный номер не для гостей';
          }
          break;

        default:
          throw new Error('Неизвестное количество комнат!');
      }

      roomSelector.setCustomValidity(message);
      guestSelector.setCustomValidity(message);
    },
    enableForm: function () {
      // Разблокирование формы объявления
      adFormHeader.removeAttribute('disabled');
      for (var i = 0; i < adFormElements.length; ++i) {
        adFormElements[i].removeAttribute('disabled');
      }

      if (adForm.classList.contains('ad-form--disabled')) {
        adForm.classList.remove('ad-form--disabled');
      }

      window.formHelper.makeGuestRoomsValidation(roomNumberSelector, guestNumberSelector);
    }
  };
})();
