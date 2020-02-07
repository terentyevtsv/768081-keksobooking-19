'use strict';

// модуль, который работает с формой объявления
(function () {
  var roomNumberSelector = document.querySelector('#room_number');
  var guestNumberSelector = document.querySelector('#capacity');

  var makeGuestRoomsValidation = function (roomSelector, guestSelector) {
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
    }

    roomSelector.setCustomValidity(message);
    guestSelector.setCustomValidity(message);
  };

  roomNumberSelector.addEventListener('change', function () {
    makeGuestRoomsValidation(roomNumberSelector, guestNumberSelector);
  });

  guestNumberSelector.addEventListener('change', function () {
    makeGuestRoomsValidation(roomNumberSelector, guestNumberSelector);
  });

  var buildingTypeSelector = document.querySelector('#type');
  var priceField = document.querySelector('#price');

  var makeTypeMinPriceValidation = function () {
    var typeValue = buildingTypeSelector.options[buildingTypeSelector.selectedIndex].value;

    var minPrice;
    switch (typeValue) {
      // Бунгало
      case window.data.BUILDING_TYPES[3]:
        minPrice = 0;
        break;

      // Квартира
      case window.data.BUILDING_TYPES[1]:
        minPrice = 1000;
        break;

      // Дом
      case window.data.BUILDING_TYPES[2]:
        minPrice = 5000;
        break;

      // Дворец
      case window.data.BUILDING_TYPES[0]:
        minPrice = 10000;
        break;
    }

    priceField.placeholder = minPrice;
    priceField.min = minPrice;
  };

  buildingTypeSelector.addEventListener('change', function () {
    makeTypeMinPriceValidation();
  });

  priceField.addEventListener('change', function () {
    makeTypeMinPriceValidation();
  });

  var makeTimeinTimeoutValidation = function (activeSelector, passiveSelector) {
    passiveSelector.selectedIndex = activeSelector.selectedIndex;
  };

  var timeinSelector = document.querySelector('#timein');
  var timeoutSelector = document.querySelector('#timeout');

  timeinSelector.addEventListener('change', function () {
    makeTimeinTimeoutValidation(timeinSelector, timeoutSelector);
  });
  timeoutSelector.addEventListener('change', function () {
    makeTimeinTimeoutValidation(timeoutSelector, timeinSelector);
  });

  var adForm = document.querySelector('.notice .ad-form');
  var adFormHeader = adForm.querySelector('.ad-form-header');
  var adFormElements = adForm.querySelectorAll('.ad-form__element');
  var mapSection = document.querySelector('.map');
  var mapCheckFilter = mapSection.querySelector('.map__filters .map__features');
  var mapSelectFilters = mapSection.querySelectorAll('.map__filters .map__filter');

  var mainMapPin = mapSection.querySelector('.map__pins .map__pin--main');

  window.form = {
    fillAddress: function (isActivate) {
      var address = adForm.querySelector('#address');

      var width = mainMapPin.offsetWidth;
      var height = mainMapPin.offsetHeight;
      var pinHeight = parseInt(window.getComputedStyle(mainMapPin, ':after').height, 10);

      var positionX = mainMapPin.offsetLeft + 0.5 * width;

      if (!isActivate) {
        // отображение адреса до активации
        address.value = positionX + '; ' + (mainMapPin.offsetTop + 0.5 * height);
        return;
      }

      // отображение адреса после активации
      address.value = positionX + '; ' + (mainMapPin.offsetTop + height + pinHeight);
    },
    enableForms: function () {
      // Блокирование формы объявления
      adFormHeader.removeAttribute('disabled');
      for (var i = 0; i < adFormElements.length; ++i) {
        adFormElements[i].removeAttribute('disabled');
      }

      // Блокирование формы фильтров
      mapCheckFilter.removeAttribute('disabled');
      for (var j = 0; j < mapSelectFilters.length; ++j) {
        mapSelectFilters[j].removeAttribute('disabled');
      }

      mapSection.classList.remove('map--faded');

      makeGuestRoomsValidation(roomNumberSelector, guestNumberSelector);
    },
    disableForms: function () {
      // Блокирование формы объявления
      adFormHeader.setAttribute('disabled', 'true');
      for (var i = 0; i < adFormElements.length; ++i) {
        adFormElements[i].setAttribute('disabled', 'true');
      }

      // Блокирование формы фильтров
      mapCheckFilter.setAttribute('disabled', 'true');
      for (var j = 0; j < mapSelectFilters.length; ++j) {
        mapSelectFilters[j].setAttribute('disabled', 'true');
      }
    },
    makeTypeMinPriceValidation: makeTypeMinPriceValidation,
    makeGuestRoomsValidation: makeGuestRoomsValidation
  };
})();
