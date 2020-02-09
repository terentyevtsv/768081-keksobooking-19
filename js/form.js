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

  var address = adForm.querySelector('#address');
  var pinHeight = parseInt(window.getComputedStyle(mainMapPin, ':after').height, 10);

  // Проверяет координаты на попадание в диапазон
  // Возвращает координаты как есть либо с учетом допустимых диапазонов значений
  var getAddress = function (x, y) {
    var minY = window.data.MIN_COORDINATE_Y;
    var maxY = window.data.MAX_COORDINATE_Y;

    if (x < 0) {
      x = 0;
    } else if (x > mapSection.clientWidth) {
      x = mapSection.clientWidth;
    }

    if (y < minY) {
      y = minY;
    } else if (y > maxY) {
      y = maxY;
    }

    var coordinate = {
      x: x,
      y: y,
    };

    return coordinate;
  };

  window.form = {
    fillAddress: function (isActivate, shiftX, shiftY) {
      var width = mainMapPin.offsetWidth;
      var height = mainMapPin.offsetHeight;
      var intHalfPinWidth = Math.round(0.5 * width);

      var coordinate;

      if (!isActivate) {
        // До активации пина координаты острия пина - центр круга пина
        var x = mainMapPin.offsetLeft + intHalfPinWidth;
        var y = mainMapPin.offsetTop + intHalfPinWidth;

        // Координаты острия пина с учетом ограничений поля
        coordinate = getAddress(x, y);

        // Позиция пина с учетом координат острия пина
        mainMapPin.style.left = (coordinate.x - intHalfPinWidth) + 'px';
        mainMapPin.style.top = (coordinate.y - intHalfPinWidth) + 'px';

        // отображение адреса до активации
        address.value = coordinate.x + '; ' + coordinate.y;

        return;
      }

      // отображение адреса после активации

      // новая позиция пина с учетом смещения
      var shiftLeft = mainMapPin.offsetLeft - shiftX;
      var shiftTop = mainMapPin.offsetTop - shiftY;

      // Координаты ОСТРИЯ ПИНА с учетом ограничений поля
      coordinate = getAddress(shiftLeft + intHalfPinWidth, shiftTop + height + pinHeight);

      // Позиция пина с учетом координат острия пина
      mainMapPin.style.left = (coordinate.x - intHalfPinWidth) + 'px';
      mainMapPin.style.top = (coordinate.y - height - pinHeight) + 'px';

      address.value = coordinate.x + '; ' + coordinate.y;
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
