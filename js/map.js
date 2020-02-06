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

  var adForm = document.querySelector('.notice .ad-form');
  var mainMapPin = mapSection.querySelector('.map__pins .map__pin--main');

  var fillAddress = function (isActivate) {
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
  };

  var roomNumberSelector = document.querySelector('#room_number');
  var guestNumberSelector = document.querySelector('#capacity');

  var makeGuestRoomsValidation = function (roomSelector, guestSelector) {
    var roomNumber = parseInt(
        roomNumberSelector.options[roomNumberSelector.selectedIndex].value,
        10
    );
    var guestNumber = parseInt(guestNumberSelector
      .options[guestNumberSelector.selectedIndex]
      .value, 10);
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

  var adFormHeader = adForm.querySelector('.ad-form-header');
  var adFormElements = adForm.querySelectorAll('.ad-form__element');
  var mapCheckFilter = mapSection.querySelector('.map__filters .map__features');
  var mapSelectFilters = mapSection.querySelectorAll('.map__filters .map__filter');

  var enableForms = function () {
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
  };

  var activateMap = function () {
    renderMapPins();

    enableForms();
    fillAddress(true);

    mapPinsContainer.addEventListener('click', onMapPinsContainerClick);
  };

  var disableForms = function () {
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
  };

  mainMapPin.addEventListener('mousedown', function (evt) {
    window.utils.isLeftMouseButtonEvent(evt, activateMap);
  });

  mainMapPin.addEventListener('keydown', function (evt) {
    window.utils.isEnterEvent(evt, activateMap);
  });

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

  disableForms();
  fillAddress(false);
  makeGuestRoomsValidation(roomNumberSelector, guestNumberSelector);
  makeTypeMinPriceValidation();
})();
