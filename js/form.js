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
        break;

      default:
        throw new Error('Неизвестное количество комнат!');
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

  var getMinPrice = function (typeValue) {
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

      default:
        throw new Error('Неизвестный тип постройки!');
    }

    return minPrice;
  };

  var makeTypeMinPriceValidation = function () {
    var typeValue = buildingTypeSelector.options[buildingTypeSelector.selectedIndex].value;
    var minPrice = getMinPrice(typeValue);

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

  var description = adForm.querySelector('#description');

  var getDefaultAdvertisementForm = function () {
    var defaultAdvertisementForm = {
      avatar: adFormHeader.querySelector('img').src,
      title: adForm.querySelector('#title').value,
      buildingTypeIndex: buildingTypeSelector.selectedIndex,
      price: priceField.value,
      timeinIndex: timeinSelector.selectedIndex,
      timeoutIndex: timeoutSelector.selectedIndex,
      roomsNumberIndex: roomNumberSelector.selectedIndex,
      capacityIndex: guestNumberSelector.selectedIndex,
      description: description.value,
      mainMapPinPosition: {
        top: mainMapPin.style.top,
        left: mainMapPin.style.left
      }
    };

    return defaultAdvertisementForm;
  };

  var defaultAdvertisementForm = getDefaultAdvertisementForm();

  var setDefaultAdvertisementForm = function () {
    adFormHeader.querySelector('img').src = defaultAdvertisementForm.avatar;
    adForm.querySelector('#title').value = defaultAdvertisementForm.title;
    address.value = defaultAdvertisementForm.address;
    buildingTypeSelector.selectedIndex = defaultAdvertisementForm.buildingTypeIndex;
    priceField.value = defaultAdvertisementForm.price;
    priceField.placeholder = getMinPrice(
        buildingTypeSelector[buildingTypeSelector.selectedIndex].value
    );
    timeinSelector.selectedIndex = defaultAdvertisementForm.timeinIndex;
    timeoutSelector.selectedIndex = defaultAdvertisementForm.timeoutIndex;
    roomNumberSelector.selectedIndex = defaultAdvertisementForm.roomsNumberIndex;
    guestNumberSelector.selectedIndex = defaultAdvertisementForm.capacityIndex;

    var featureCheckers = adForm.querySelectorAll('input[type=checkbox]');
    for (var i = 0; i < featureCheckers.length; ++i) {
      if (featureCheckers[i].checked) {
        featureCheckers[i].checked = false;
      }
    }

    description.value = defaultAdvertisementForm.description;
    var photoContainer = adForm.querySelector('.ad-form__photo-container .ad-form__photo');
    var photoImages = photoContainer.querySelectorAll('img');
    for (var j = 0; j < photoImages.length; ++j) {
      photoContainer.removeChild(photoImages[j]);
    }

    mainMapPin.style.top = defaultAdvertisementForm.mainMapPinPosition.top;
    mainMapPin.style.left = defaultAdvertisementForm.mainMapPinPosition.left;
  };

  var successTemplate = document
      .querySelector('#success')
      .content
      .querySelector('.success');
  var main = document.querySelector('main');
  var promo = document.querySelector('.promo');

  var setNotActiveStatus = function () {
    window.card.close();
    window.pin.remove();
    window.form.disable();
    window.form.isActive = false;
    setDefaultAdvertisementForm();
  };

  var onSuccess = function (data) {
    setNotActiveStatus();

    var success = successTemplate.cloneNode(true);
    main.insertBefore(success, promo);

    var onSuccessEscPress = function (evt) {
      window.utils.isEscEvent(evt, function () {
        main.removeChild(success);
        document.removeEventListener('keydown', onSuccessEscPress);
        document.removeEventListener('click', onSuccessDocumentClick);
      });
    };
    document.addEventListener('keydown', onSuccessEscPress);

    var onSuccessDocumentClick = function () {
      main.removeChild(success);
      document.removeEventListener('keydown', onSuccessEscPress);
      document.removeEventListener('click', onSuccessDocumentClick);
    };
    document.addEventListener('click', onSuccessDocumentClick);

    return data;
  };

  var errorTemplate = document
      .querySelector('#error')
      .content
      .querySelector('.error');
  var onError = function (message) {
    var error = errorTemplate.cloneNode(true);
    main.insertBefore(error, promo);

    var onErrorEscPress = function (evt) {
      window.utils.isEscEvent(evt, function () {
        main.removeChild(error);
        document.removeEventListener('keydown', onErrorEscPress);
        document.removeEventListener('click', onErrorDocumentClick);
      });
    };
    document.addEventListener('keydown', onErrorEscPress);

    var onErrorDocumentClick = function (evt) {
      document.removeEventListener('keydown', onErrorEscPress);
      document.removeEventListener('click', onErrorDocumentClick);

      if (evt.target.matches('.error__button')) {
        main.removeChild(error);
        return;
      }

      main.removeChild(error);
    };
    document.addEventListener('click', onErrorDocumentClick);

    return message;
  };

  adForm.addEventListener('submit', function (evt) {
    window.load.sendData(
        'https://js.dump.academy/keksobooking',
        new FormData(adForm),
        onSuccess,
        onError
    );

    evt.preventDefault();
  });

  var reset = adForm.querySelector('.ad-form__reset');
  reset.addEventListener('click', function () {
    setNotActiveStatus();
  });

  // Проверяет координаты на попадание в диапазон
  // Возвращает координаты как есть либо с учетом допустимых диапазонов значений
  var getAddress = function (x, y) {
    if (x < 0) {
      x = 0;
    } else if (x > mapSection.clientWidth) {
      x = mapSection.clientWidth;
    }

    if (y < window.data.MIN_COORDINATE_Y) {
      y = window.data.MIN_COORDINATE_Y;
    } else if (y > window.data.MAX_COORDINATE_Y) {
      y = window.data.MAX_COORDINATE_Y;
    }

    var coordinate = {
      x: x,
      y: y,
    };

    return coordinate;
  };

  window.form = {
    isActive: false,
    fillAddress: function (shiftX, shiftY) {
      var width = mainMapPin.offsetWidth;
      var height = mainMapPin.offsetHeight;
      var intHalfPinWidth = Math.round(0.5 * width);

      var coordinate;

      if (!window.form.isActive) {
        // До активации пина координаты острия пина - центр круга пина
        var x = mainMapPin.offsetLeft + intHalfPinWidth;
        var y = mainMapPin.offsetTop + intHalfPinWidth;

        // Координаты острия пина с учетом ограничений поля
        coordinate = getAddress(x, y);

        // Позиция пина с учетом координат острия пина
        mainMapPin.style.left = (coordinate.x - intHalfPinWidth) + 'px';
        mainMapPin.style.top = (coordinate.y - intHalfPinWidth) + 'px';

        // отображение адреса до активации
        defaultAdvertisementForm.address = coordinate.x + '; ' + coordinate.y;
        address.value = defaultAdvertisementForm.address;

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
    enable: function () {
      // Разблокирование формы объявления
      adFormHeader.removeAttribute('disabled');
      for (var i = 0; i < adFormElements.length; ++i) {
        adFormElements[i].removeAttribute('disabled');
      }

      if (adForm.classList.contains('ad-form--disabled')) {
        adForm.classList.remove('ad-form--disabled');
      }

      makeGuestRoomsValidation(roomNumberSelector, guestNumberSelector);
    },
    disable: function () {
      // Блокирование формы объявления
      adFormHeader.setAttribute('disabled', 'true');
      for (var i = 0; i < adFormElements.length; ++i) {
        adFormElements[i].setAttribute('disabled', 'true');
      }

      if (!adForm.classList.contains('ad-form--disabled')) {
        adForm.classList.add('ad-form--disabled');
      }

      // Блокирование формы фильтров
      mapCheckFilter.setAttribute('disabled', 'true');
      for (var j = 0; j < mapSelectFilters.length; ++j) {
        mapSelectFilters[j].setAttribute('disabled', 'true');
      }

      if (!mapSection.classList.contains('map--faded')) {
        mapSection.classList.add('map--faded');
      }
    },
    makeTypeMinPriceValidation: makeTypeMinPriceValidation,
    makeGuestRoomsValidation: makeGuestRoomsValidation,
    showSuccessNotification: function () {
      var success = successTemplate.cloneNode(true);
      var message = success.querySelector('.success__message');
      message.textContent = 'Нет связи с сервером! Сгенерированы случайные объявления.';
      main.insertBefore(success, promo);

      var onSuccessEscPress = function (evt) {
        window.utils.isEscEvent(evt, function () {
          main.removeChild(success);
          document.removeEventListener('keydown', onSuccessEscPress);
          document.removeEventListener('mousedown', onSuccessDocumentClick);
        });
      };
      document.addEventListener('keydown', onSuccessEscPress);

      var onSuccessDocumentClick = function (evt) {
        window.utils.isLeftMouseButtonEvent(evt, function () {
          main.removeChild(success);
          document.removeEventListener('keydown', onSuccessEscPress);
          document.removeEventListener('mousedown', onSuccessDocumentClick);
        });
      };
      document.addEventListener('mousedown', onSuccessDocumentClick);
    }
  };
})();
