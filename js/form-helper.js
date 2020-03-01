'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  var mapSectionElement = document.querySelector('.map');
  var mapCheckFilterElement = mapSectionElement.querySelector('.map__filters .map__features');
  var mapSelectFilterElements = mapSectionElement.querySelectorAll('.map__filters .map__filter');
  var adFormElement = document.querySelector('.notice .ad-form');
  var adFormHeaderElement = adFormElement.querySelector('.ad-form-header');
  var adFormElements = adFormElement.querySelectorAll('.ad-form__element');
  var roomNumberSelectorElement = document.querySelector('#room_number');
  var guestNumberSelectorElement = document.querySelector('#capacity');
  var housingTypeSelectorElement = mapSectionElement.querySelector('#housing-type');
  var housingPriceSelectorElement = mapSectionElement.querySelector('#housing-price');
  var housingRoomsSelectorElement = mapSectionElement.querySelector('#housing-rooms');
  var housingGuestsSelectorElement = mapSectionElement.querySelector('#housing-guests');

  var housingFeaturesElement = mapSectionElement.querySelector('#housing-features');
  var housingFeaturesCheckerElements = housingFeaturesElement.querySelectorAll('.map__checkbox');

  var filter = function () {
    window.card.close();

    var housingCheckedFeatureElements = housingFeaturesElement
      .querySelectorAll('.map__checkbox:checked');
    var renderingAdvertisements = window.data.allAdvertisements
      .filter(function (advertisement) {
        return window.filter.filterItem(
            advertisement,
            housingTypeSelectorElement,
            housingPriceSelectorElement,
            housingRoomsSelectorElement,
            housingGuestsSelectorElement,
            housingCheckedFeatureElements
        );
      });
    window.pinHelper.renderPins(
        renderingAdvertisements.slice(0, window.pinHelper.RENDERED_PINS_COUNT)
    );
  };

  var debounceFilter = window.debounce(function () {
    filter();
  }, DEBOUNCE_INTERVAL);

  window.formHelper = {
    onHousingTypeSelectorChange: function () {
      debounceFilter();
    },
    onHousingPriceSelectorChange: function () {
      debounceFilter();
    },
    onHousingRoomsSelectorChange: function () {
      debounceFilter();
    },
    onHousingGuestsSelectorChange: function () {
      debounceFilter();
    },
    onHousingFeaturesCheckersChange: function () {
      debounceFilter();
    },
    enableFilter: function () {
      // Показ формы фильтров
      mapCheckFilterElement.removeAttribute('disabled');
      for (var j = 0; j < mapSelectFilterElements.length; ++j) {
        mapSelectFilterElements[j].removeAttribute('disabled');
      }

      housingTypeSelectorElement.addEventListener(
          'change',
          window.formHelper.onHousingTypeSelectorChange
      );
      housingPriceSelectorElement.addEventListener(
          'change',
          window.formHelper.onHousingPriceSelectorChange
      );
      housingRoomsSelectorElement.addEventListener(
          'change',
          window.formHelper.onHousingRoomsSelectorChange
      );
      housingGuestsSelectorElement.addEventListener(
          'change',
          window.formHelper.onHousingGuestsSelectorChange
      );

      housingFeaturesCheckerElements.forEach(function (element) {
        element.addEventListener(
            'change',
            window.formHelper.onHousingFeaturesCheckersChange
        );
      });

      if (mapSectionElement.classList.contains('map--faded')) {
        mapSectionElement.classList.remove('map--faded');
      }
    },
    makeGuestRoomsValidation: function (roomSelectorElement, guestSelectorElement) {
      var roomNumber = parseInt(
          roomNumberSelectorElement.options[roomNumberSelectorElement.selectedIndex].value,
          10
      );
      var guestNumber = parseInt(
          guestNumberSelectorElement.options[guestNumberSelectorElement.selectedIndex].value,
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

      roomSelectorElement.setCustomValidity(message);
      guestSelectorElement.setCustomValidity(message);
    },
    enableForm: function () {
      // Разблокирование формы объявления
      adFormHeaderElement.removeAttribute('disabled');
      for (var i = 0; i < adFormElements.length; ++i) {
        adFormElements[i].removeAttribute('disabled');
      }

      if (adFormElement.classList.contains('ad-form--disabled')) {
        adFormElement.classList.remove('ad-form--disabled');
      }

      window.formHelper.makeGuestRoomsValidation(
          roomNumberSelectorElement,
          guestNumberSelectorElement
      );
    }
  };
})();
