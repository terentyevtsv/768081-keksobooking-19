'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  var mapSection = document.querySelector('.map');
  var mapCheckFilter = mapSection.querySelector('.map__filters .map__features');
  var mapSelectFilters = mapSection.querySelectorAll('.map__filters .map__filter');
  var adForm = document.querySelector('.notice .ad-form');
  var adFormHeader = adForm.querySelector('.ad-form-header');
  var adFormElements = adForm.querySelectorAll('.ad-form__element');
  var roomNumberSelector = document.querySelector('#room_number');
  var guestNumberSelector = document.querySelector('#capacity');
  var housingTypeSelector = mapSection.querySelector('#housing-type');
  var housingPriceSelector = mapSection.querySelector('#housing-price');
  var housingRoomsSelector = mapSection.querySelector('#housing-rooms');
  var housingGuestsSelector = mapSection.querySelector('#housing-guests');

  var housingFeatures = mapSection.querySelector('#housing-features');
  var housingFeaturesCheckers = housingFeatures.querySelectorAll('.map__checkbox');

  var filter = function () {
    window.card.close();

    var housingCheckedFeatures = housingFeatures.querySelectorAll('.map__checkbox:checked');
    var renderingAdvertisements = window.data.allAdvertisements
      .filter(function (advertisement) {
        return window.filter.filterItem(
            advertisement,
            housingTypeSelector,
            housingPriceSelector,
            housingRoomsSelector,
            housingGuestsSelector,
            housingCheckedFeatures
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
      mapCheckFilter.removeAttribute('disabled');
      for (var j = 0; j < mapSelectFilters.length; ++j) {
        mapSelectFilters[j].removeAttribute('disabled');
      }

      housingTypeSelector.addEventListener(
          'change',
          window.formHelper.onHousingTypeSelectorChange
      );
      housingPriceSelector.addEventListener(
          'change',
          window.formHelper.onHousingPriceSelectorChange
      );
      housingRoomsSelector.addEventListener(
          'change',
          window.formHelper.onHousingRoomsSelectorChange
      );
      housingGuestsSelector.addEventListener(
          'change',
          window.formHelper.onHousingGuestsSelectorChange
      );

      housingFeaturesCheckers.forEach(function (item) {
        item.addEventListener(
            'change',
            window.formHelper.onHousingFeaturesCheckersChange
        );
      });

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
