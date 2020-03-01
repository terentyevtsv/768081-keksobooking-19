'use strict';

// модуль, который работает с формой объявления
(function () {
  var roomNumberSelectorElement = document.querySelector('#room_number');
  var guestNumberSelectorElement = document.querySelector('#capacity');

  roomNumberSelectorElement.addEventListener('change', function () {
    window.formHelper.makeGuestRoomsValidation(roomNumberSelectorElement, guestNumberSelectorElement);
  });

  guestNumberSelectorElement.addEventListener('change', function () {
    window.formHelper.makeGuestRoomsValidation(roomNumberSelectorElement, guestNumberSelectorElement);
  });

  var buildingTypeSelectorElement = document.querySelector('#type');
  var priceFieldElement = document.querySelector('#price');

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
    var typeValue = buildingTypeSelectorElement.options[buildingTypeSelectorElement.selectedIndex].value;
    var minPrice = getMinPrice(typeValue);

    priceFieldElement.placeholder = minPrice;
    priceFieldElement.min = minPrice;
  };

  buildingTypeSelectorElement.addEventListener('change', function () {
    makeTypeMinPriceValidation();
  });

  priceFieldElement.addEventListener('change', function () {
    makeTypeMinPriceValidation();
  });

  var makeTimeinTimeoutValidation = function (activeSelectorElement, passiveSelectorElement) {
    passiveSelectorElement.selectedIndex = activeSelectorElement.selectedIndex;
  };

  var timeinSelectorElement = document.querySelector('#timein');
  var timeoutSelectorElement = document.querySelector('#timeout');

  timeinSelectorElement.addEventListener('change', function () {
    makeTimeinTimeoutValidation(timeinSelectorElement, timeoutSelectorElement);
  });
  timeoutSelectorElement.addEventListener('change', function () {
    makeTimeinTimeoutValidation(timeoutSelectorElement, timeinSelectorElement);
  });

  var adFormElement = document.querySelector('.notice .ad-form');
  var adFormHeaderElement = adFormElement.querySelector('.ad-form-header');
  var adFormElements = adFormElement.querySelectorAll('.ad-form__element');
  var mapSectionElement = document.querySelector('.map');
  var mapCheckFilterElement = mapSectionElement.querySelector('.map__filters .map__features');
  var mapSelectFilterElements = mapSectionElement.querySelectorAll('.map__filters .map__filter');

  var mainMapPinElement = mapSectionElement.querySelector('.map__pins .map__pin--main');

  var addressElement = adFormElement.querySelector('#address');
  var pinHeight = parseInt(window.getComputedStyle(mainMapPinElement, ':after').height, 10);

  var descriptionElement = adFormElement.querySelector('#description');

  var titleFieldElement = adFormElement.querySelector('#title');
  var getDefaultAdvertisementForm = function () {
    var defaultAdvertisementForm = {
      avatar: adFormHeaderElement.querySelector('img').src,
      title: titleFieldElement.value,
      buildingTypeIndex: buildingTypeSelectorElement.selectedIndex,
      price: priceFieldElement.value,
      timeinIndex: timeinSelectorElement.selectedIndex,
      timeoutIndex: timeoutSelectorElement.selectedIndex,
      roomsNumberIndex: roomNumberSelectorElement.selectedIndex,
      capacityIndex: guestNumberSelectorElement.selectedIndex,
      description: descriptionElement.value,
      mainMapPinPosition: {
        top: mainMapPinElement.style.top,
        left: mainMapPinElement.style.left
      }
    };

    return defaultAdvertisementForm;
  };

  var housingTypeSelectorElement = mapSectionElement.querySelector('#housing-type');
  var housingPriceSelectorElement = mapSectionElement.querySelector('#housing-price');
  var housingRoomsSelectorElement = mapSectionElement.querySelector('#housing-rooms');
  var housingGuestsSelectorElement = mapSectionElement.querySelector('#housing-guests');

  var getDefaultAdvertisementFilter = function () {
    var defaultAdvertisementFilter = {
      housingTypeIndex: housingTypeSelectorElement.selectedIndex,
      housingPriceIndex: housingPriceSelectorElement.selectedIndex,
      housingRoomsIndex: housingRoomsSelectorElement.selectedIndex,
      housingGuestsIndex: housingGuestsSelectorElement.selectedIndex
    };

    return defaultAdvertisementFilter;
  };

  var defaultAdvertisementForm = getDefaultAdvertisementForm();
  var defaultAdvertisementFilter = getDefaultAdvertisementFilter();

  var setDefaultAdvertisementForm = function () {
    adFormHeaderElement.querySelector('img').src = defaultAdvertisementForm.avatar;
    titleFieldElement.value = defaultAdvertisementForm.title;
    addressElement.value = defaultAdvertisementForm.address;
    buildingTypeSelectorElement.selectedIndex = defaultAdvertisementForm.buildingTypeIndex;
    priceFieldElement.value = defaultAdvertisementForm.price;
    priceFieldElement.placeholder = getMinPrice(
        buildingTypeSelectorElement[buildingTypeSelectorElement.selectedIndex].value
    );
    timeinSelectorElement.selectedIndex = defaultAdvertisementForm.timeinIndex;
    timeoutSelectorElement.selectedIndex = defaultAdvertisementForm.timeoutIndex;
    roomNumberSelectorElement.selectedIndex = defaultAdvertisementForm.roomsNumberIndex;
    guestNumberSelectorElement.selectedIndex = defaultAdvertisementForm.capacityIndex;

    var featureCheckerElements = adFormElement.querySelectorAll('input[type=checkbox]');
    for (var i = 0; i < featureCheckerElements.length; ++i) {
      if (featureCheckerElements[i].checked) {
        featureCheckerElements[i].checked = false;
      }
    }

    descriptionElement.value = defaultAdvertisementForm.description;
    var photoContainerElement = adFormElement
      .querySelector('.ad-form__photo-container .ad-form__photo');
    var photoImageElements = photoContainerElement.querySelectorAll('img');
    for (var j = 0; j < photoImageElements.length; ++j) {
      photoContainerElement.removeChild(photoImageElements[j]);
    }

    mainMapPinElement.style.top = defaultAdvertisementForm.mainMapPinPosition.top;
    mainMapPinElement.style.left = defaultAdvertisementForm.mainMapPinPosition.left;
  };

  var housingFeaturesElement = mapSectionElement.querySelector('#housing-features');

  var setDefaultAdvertisementFilter = function () {
    housingTypeSelectorElement.selectedIndex = defaultAdvertisementFilter.housingTypeIndex;
    housingPriceSelectorElement.selectedIndex = defaultAdvertisementFilter.housingPriceIndex;
    housingRoomsSelectorElement.selectedIndex = defaultAdvertisementFilter.housingRoomsIndex;
    housingGuestsSelectorElement.selectedIndex = defaultAdvertisementFilter.housingGuestsIndex;

    var housingFeaturesCheckerElements = housingFeaturesElement.querySelectorAll('.map__checkbox');
    for (var i = 0; i < housingFeaturesCheckerElements.length; ++i) {
      if (housingFeaturesCheckerElements[i].checked) {
        housingFeaturesCheckerElements[i].checked = false;
      }
    }
  };

  var successTemplateElement = document
      .querySelector('#success')
      .content
      .querySelector('.success');
  var mainElement = document.querySelector('main');
  var promoElement = document.querySelector('.promo');

  var setNotActiveStatus = function () {
    window.card.close();
    window.pinHelper.remove();
    window.form.disable(false);
    window.form.isActive = false;
    setDefaultAdvertisementForm();
    setDefaultAdvertisementFilter();

    titleFieldElement.removeEventListener('invalid', window.form.onAdvertisementFieldsInvalid);
    priceFieldElement.removeEventListener('invalid', window.form.onAdvertisementFieldsInvalid);
    roomNumberSelectorElement.removeEventListener(
        'invalid',
        window.form.onAdvertisementFieldsInvalid
    );
    guestNumberSelectorElement.removeEventListener(
        'invalid',
        window.form.onAdvertisementFieldsInvalid
    );
  };

  var onSuccess = function (data) {
    setNotActiveStatus();

    var successElement = successTemplateElement.cloneNode(true);
    mainElement.insertBefore(successElement, promoElement);

    var onSuccessEscPress = function (evt) {
      window.utils.isEscEvent(evt, function () {
        mainElement.removeChild(successElement);
        document.removeEventListener('keydown', onSuccessEscPress);
        document.removeEventListener('click', onSuccessDocumentClick);
      });
    };
    document.addEventListener('keydown', onSuccessEscPress);

    var onSuccessDocumentClick = function () {
      mainElement.removeChild(successElement);
      document.removeEventListener('keydown', onSuccessEscPress);
      document.removeEventListener('click', onSuccessDocumentClick);
    };
    document.addEventListener('click', onSuccessDocumentClick);

    return data;
  };

  var errorTemplateElement = document
      .querySelector('#error')
      .content
      .querySelector('.error');
  var onError = function (message) {
    var errorElement = errorTemplateElement.cloneNode(true);
    mainElement.insertBefore(errorElement, promoElement);

    var onErrorEscPress = function (evt) {
      window.utils.isEscEvent(evt, function () {
        mainElement.removeChild(errorElement);
        document.removeEventListener('keydown', onErrorEscPress);
        document.removeEventListener('click', onErrorDocumentClick);
      });
    };
    document.addEventListener('keydown', onErrorEscPress);

    var onErrorDocumentClick = function (evt) {
      document.removeEventListener('keydown', onErrorEscPress);
      document.removeEventListener('click', onErrorDocumentClick);

      if (evt.target.matches('.error__button')) {
        mainElement.removeChild(errorElement);
        return;
      }

      mainElement.removeChild(errorElement);
    };
    document.addEventListener('click', onErrorDocumentClick);

    return message;
  };

  adFormElement.addEventListener('submit', function (evt) {
    window.load.sendData(
        'https://js.dump.academy/keksobooking',
        new FormData(adFormElement),
        onSuccess,
        onError
    );

    evt.preventDefault();
  });

  var resetInvalidBorders = function () {
    titleFieldElement.style.border = '';
    priceFieldElement.style.border = '';
    roomNumberSelectorElement.style.border = '';
    guestNumberSelectorElement.style.border = '';
  };

  var submitButtonElement = adFormElement.querySelector('.ad-form__submit');
  submitButtonElement.addEventListener('click', function () {
    resetInvalidBorders();
  });

  var resetElement = adFormElement.querySelector('.ad-form__reset');
  resetElement.addEventListener('click', function () {
    resetInvalidBorders();
    setNotActiveStatus();
  });

  // Проверяет координаты на попадание в диапазон
  // Возвращает координаты как есть либо с учетом допустимых диапазонов значений
  var getAddress = function (x, y) {
    if (x < 0) {
      x = 0;
    } else if (x > mapSectionElement.clientWidth) {
      x = mapSectionElement.clientWidth;
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

  var housingFeaturesCheckerElements = housingFeaturesElement.querySelectorAll('.map__checkbox');
  window.form = {
    isActive: false,
    fillAddress: function (shiftX, shiftY) {
      var width = mainMapPinElement.offsetWidth;
      var height = mainMapPinElement.offsetHeight;
      var intHalfPinWidth = Math.round(0.5 * width);

      var coordinate;

      if (!window.form.isActive) {
        // До активации пина координаты острия пина - центр круга пина
        var x = mainMapPinElement.offsetLeft + intHalfPinWidth;
        var y = mainMapPinElement.offsetTop + intHalfPinWidth;

        // Координаты острия пина с учетом ограничений поля
        coordinate = getAddress(x, y);

        // Позиция пина с учетом координат острия пина
        mainMapPinElement.style.left = (coordinate.x - intHalfPinWidth) + 'px';
        mainMapPinElement.style.top = (coordinate.y - intHalfPinWidth) + 'px';

        // отображение адреса до активации
        defaultAdvertisementForm.address = coordinate.x + '; ' + coordinate.y;
        addressElement.value = defaultAdvertisementForm.address;

        return;
      }

      // отображение адреса после активации

      // новая позиция пина с учетом смещения
      var shiftLeft = mainMapPinElement.offsetLeft - shiftX;
      var shiftTop = mainMapPinElement.offsetTop - shiftY;

      // Координаты ОСТРИЯ ПИНА с учетом ограничений поля
      coordinate = getAddress(shiftLeft + intHalfPinWidth, shiftTop + height + pinHeight);

      // Позиция пина с учетом координат острия пина
      mainMapPinElement.style.left = (coordinate.x - intHalfPinWidth) + 'px';
      mainMapPinElement.style.top = (coordinate.y - height - pinHeight) + 'px';

      addressElement.value = coordinate.x + '; ' + coordinate.y;
    },
    disable: function (isFormIntializing) {
      // Блокирование формы объявления
      adFormHeaderElement.setAttribute('disabled', 'true');
      for (var i = 0; i < adFormElements.length; ++i) {
        adFormElements[i].setAttribute('disabled', 'true');
      }

      if (!adFormElement.classList.contains('ad-form--disabled')) {
        adFormElement.classList.add('ad-form--disabled');
      }

      // Блокирование формы фильтров
      mapCheckFilterElement.setAttribute('disabled', 'true');
      for (var j = 0; j < mapSelectFilterElements.length; ++j) {
        mapSelectFilterElements[j].setAttribute('disabled', 'true');
      }

      if (!isFormIntializing) {
        housingTypeSelectorElement.removeEventListener(
            'change',
            window.formHelper.onHousingTypeSelectorChange
        );

        housingPriceSelectorElement.removeEventListener(
            'change',
            window.formHelper.onHousingPriceSelectorChange
        );
        housingRoomsSelectorElement.removeEventListener(
            'change',
            window.formHelper.onHousingRoomsSelectorChange
        );
        housingGuestsSelectorElement.removeEventListener(
            'change',
            window.formHelper.onHousingGuestsSelectorChange
        );

        housingFeaturesCheckerElements.forEach(function (element) {
          element.removeEventListener(
              'change',
              window.formHelper.onHousingFeaturesCheckersChange
          );
        });
      }

      if (!mapSectionElement.classList.contains('map--faded')) {
        mapSectionElement.classList.add('map--faded');
      }
    },
    makeTypeMinPriceValidation: makeTypeMinPriceValidation,
    showReceiveErrorNotification: function () {
      var receiveErrorElement = successTemplateElement.cloneNode(true);
      var messageElement = receiveErrorElement.querySelector('.success__message');
      messageElement.textContent = 'Нет связи с сервером! Попробуйте создать объявление позже.';
      mainElement.insertBefore(receiveErrorElement, promoElement);

      var onReceiveErrorEscPress = function (evt) {
        window.utils.isEscEvent(evt, function () {
          mainElement.removeChild(receiveErrorElement);
          document.removeEventListener('keydown', onReceiveErrorEscPress);
          document.removeEventListener('mousedown', onReceiveErrorDocumentClick);
        });
      };
      document.addEventListener('keydown', onReceiveErrorEscPress);

      var onReceiveErrorDocumentClick = function (evt) {
        window.utils.isLeftMouseButtonEvent(evt, function () {
          mainElement.removeChild(receiveErrorElement);
          document.removeEventListener('keydown', onReceiveErrorEscPress);
          document.removeEventListener('mousedown', onReceiveErrorDocumentClick);
        });
      };
      document.addEventListener('mousedown', onReceiveErrorDocumentClick);
    },
    onAdvertisementFieldsInvalid: function (evt) {
      evt.target.style.border = '2px solid #FF0000';
    }
  };
})();
