'use strict';

var ADVERTISEMENT_COUNT = 8;

var TITLES = [
  'Большой дворец для больших компаний',
  'Малый дворец для большой семьи',
  'Просторная квартира для большой компании',
  'Маленькая уютная квартира для пары',
  'Небольшой коттедж для компании на выходные',
  'Большой коттедж для большой компании',
  'Маленькое уединенное бунгало для пары',
  'Большое бунгало для четырех семей'
];

var BUILDING_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var BUILDING_DESCRIPTIONS = [
  'Дворец',
  'Квартира',
  'Дом',
  'Бунгало',
];

var CHECKIN_CHECKOUT_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var DESCRIPTIONS = [
  'Если вы хотите закатить мегатусовку этот вариант для вас',
  'Идеально подходит для второго дня свадьбы',
  'Замечательно подходит для туристических поездок большой компании друзей',
  'Если хочется уединиться со второй половинкой',
  'Отметить юбилей и хорошо провести время на природе',
  'Отметить новый год и всем уместиться здесь не проблема',
  'Искупаться в бассейне и провести спокойный вечер в уюте',
  'Закатить шумную вечеринку никто вам здесь не помешает',
];

var MIN_COORDINATE_Y = 130;
var MAX_COORDINATE_Y = 630;

var MIN_PRICE = 0;
var MAX_PRICE = 1000000;

var MIN_ROOM_COUNT = 1;
var MAX_ROOM_COUNT = 5;

var MIN_GUEST_COUNT = 1;
var MAX_GUEST_COUNT = 10;

var LEFT_MOUSE_BUTTON = 0;

var mapSection = document.querySelector('.map');
var mapPinsContainer = mapSection.querySelector('.map__pins');

// Возвращает случайное количество неповторяющихся удобств
var getRandomFeatures = function () {
  var features = [];

  var randomFeatures = window.utils.getRandomArrayElements(FEATURES);
  for (var i = 0; i < randomFeatures.length; ++i) {
    features[i] = randomFeatures[i].arrayContent;
  }

  return features;
};

// Возвращает случайное количество фото
var getRandomPhotos = function () {
  var photos = [];

  var randomPhotos = window.utils.getRandomArrayElements(PHOTOS);

  for (var k = 0; k < randomPhotos.length; ++k) {
    photos[k] = randomPhotos[k].arrayContent;
  }

  return photos;
};

// Генератор случайных объявлений
var generateRandomAdvertisements = function () {
  var advertisements = [];
  var checkinCheckoutTimesMaxIndex = CHECKIN_CHECKOUT_TIMES.length - 1;
  for (var i = 0; i < ADVERTISEMENT_COUNT; ++i) {
    var advertisement = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: TITLES[i],
        price: window.utils.getRandomInteger(MIN_PRICE, MAX_PRICE),
        type: BUILDING_TYPES[window.utils.getRandomInteger(0, BUILDING_TYPES.length - 1)],
        rooms: window.utils.getRandomInteger(MIN_ROOM_COUNT, MAX_ROOM_COUNT),
        guests: window.utils.getRandomInteger(MIN_GUEST_COUNT, MAX_GUEST_COUNT),
        checkin: CHECKIN_CHECKOUT_TIMES[window.utils.getRandomInteger(0, checkinCheckoutTimesMaxIndex)],
        checkout: CHECKIN_CHECKOUT_TIMES[window.utils.getRandomInteger(0, checkinCheckoutTimesMaxIndex)],
        features: getRandomFeatures(),
        description: DESCRIPTIONS[i],
        photos: getRandomPhotos()
      },
      location: {
        x: window.utils.getRandomInteger(0, mapSection.clientWidth),
        y: window.utils.getRandomInteger(MIN_COORDINATE_Y, MAX_COORDINATE_Y)
      }
    };

    advertisement.offer['address'] =
      advertisement.location.x +
      ', ' +
      advertisement.location.y;

    advertisements[i] = advertisement;
  }

  return advertisements;
};

var mapPinTemplate = document
    .querySelector('#pin')
    .content
    .querySelector('.map__pin');

var renderMapPin = function (advertisement) {
  var mapPin = mapPinTemplate.cloneNode(true);

  var icon = mapPin.querySelector('img');
  icon.src = advertisement.author.avatar;
  icon.alt = advertisement.offer.title;

  return mapPin;
};

var advertisementMapPins = [];
var buildingDescriptions = {};

var renderMapPins = function () {
  var advertisements = generateRandomAdvertisements();
  var fragment = document.createDocumentFragment();

  for (var k = 0; k < BUILDING_TYPES.length; ++k) {
    buildingDescriptions[BUILDING_TYPES[k]] = BUILDING_DESCRIPTIONS[k];
  }

  for (var i = 0; i < advertisements.length; ++i) {
    var mapPin = renderMapPin(advertisements[i]);
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

// Возвращает DOM элемент если блок не скрыт
var getInformationField = function (
    mapCard,
    cssClass,
    parentObject,
    currentProperty
) {
  var item = mapCard.querySelector(cssClass);

  if (!parentObject.hasOwnProperty(currentProperty)) {
    item.classList.add('hidden');
    return null;
  }

  return item;
};

// Скрывает не содержащиеся в списке удобства
var createFeaturesList = function (features, featureItems, popupFeaturesList) {
  var featureExistFlags = {};
  var keys = [];

  // Полный список удобств
  for (var i = 0; i < featureItems.length; ++i) {
    keys[i] = featureItems[i].classList[1].replace('popup__feature--', '');
    featureExistFlags[keys[i]] = false;
  }

  // Выставляем true для списка доступных
  for (var j = 0; j < features.length; ++j) {
    featureExistFlags[features[j]] = true;
  }

  for (var k = 0; k < keys.length; ++k) {
    if (!featureExistFlags[keys[k]]) {
      popupFeaturesList.removeChild(featureItems[k]);
    }
  }
};

// формирует список доступных фото недвижимости
var createPhotosList = function (photoItemsContainer, mapCard, photos) {
  var photoItem = mapCard.querySelector('.popup__photo');
  var fragment = document.createDocumentFragment();

  // Заполнение существующего и создание новых img
  var className = photoItem.className;
  var width = photoItem.width;
  var height = photoItem.height;
  var alternateText = photoItem.alt;

  photoItem.src = photos[0];
  for (var i = 1; i < photos.length; ++i) {
    var imageTag = document.createElement('img');

    imageTag.src = photos[i];
    imageTag.className = className;
    imageTag.width = width;
    imageTag.height = height;
    imageTag.alt = alternateText;

    fragment.appendChild(imageTag);
  }

  photoItemsContainer.appendChild(fragment);
};

var mapCardTemplate = document
  .querySelector('#card')
  .content
  .querySelector('.map__card');
var fillAdvertisementCard = function (advertisement) {
  var mapCard = mapCardTemplate.cloneNode(true);

  // Получение блоков для вставки значений
  var title = getInformationField(mapCard, '.popup__title', advertisement.offer, 'title');
  var address = getInformationField(mapCard, '.popup__text--address', advertisement.offer, 'address');
  var price = getInformationField(mapCard, '.popup__text--price', advertisement.offer, 'price');
  var buildingType = getInformationField(mapCard, '.popup__type', advertisement.offer, 'type');

  var capacity = mapCard.querySelector('.popup__text--capacity');
  var hasRooms = advertisement.offer.hasOwnProperty('rooms');
  var hasGuests = advertisement.offer.hasOwnProperty('guests');
  if (!hasRooms && !hasGuests) {
    capacity.classList.add('hidden');
    capacity = null;
  }

  var time = mapCard.querySelector('.popup__text--time');
  var hasCheckin = advertisement.offer.hasOwnProperty('checkin');
  var hasCheckout = advertisement.offer.hasOwnProperty('checkout');
  if (!hasCheckin && !hasCheckout) {
    time.classList.add('hidden');
    time = null;
  }

  var popupFeaturesList = getInformationField(mapCard, '.popup__features', advertisement.offer, 'features');
  var description = getInformationField(mapCard, '.popup__description', advertisement.offer, 'description');
  var photoItemsContainer = getInformationField(mapCard, '.popup__photos', advertisement.offer, 'photos');
  var avatar = getInformationField(mapCard, '.popup__avatar', advertisement.author, 'avatar');

  // Вставка значений в блоки
  if (title !== null) {
    title.textContent = advertisement.offer.title;
  }

  if (address !== null) {
    address.textContent = advertisement.offer.address;
  }

  if (price !== null) {
    price.innerHTML =
      advertisement.offer.price + '&#x20bd;<span>/ночь</span>';
  }

  if (buildingType !== null) {
    buildingType.textContent = buildingDescriptions[advertisement.offer.type];
  }

  if (capacity !== null) {
    capacity.textContent = '';

    if (hasRooms) {
      capacity.textContent += 'Количество комнат: ' + advertisement.offer.rooms + '. ';
    }

    if (hasGuests) {
      capacity.textContent += 'Количество гостей: ' + advertisement.offer.guests + '.';
    }
  }

  if (time !== null) {
    time.textContent = '';

    if (hasCheckin) {
      time.textContent += 'Заезд после ' + advertisement.offer.checkin + '. ';
    }

    if (hasCheckout) {
      time.textContent += 'Выезд до ' + advertisement.offer.checkout + '.';
    }
  }

  if (popupFeaturesList !== null) {
    var featureItems = popupFeaturesList.querySelectorAll('.popup__feature');
    createFeaturesList(advertisement.offer.features, featureItems, popupFeaturesList);
  }

  if (description !== null) {
    description.textContent = advertisement.offer.description;
  }

  if (photoItemsContainer !== null) {
    createPhotosList(photoItemsContainer, mapCard, advertisement.offer.photos);
  }

  if (avatar !== null) {
    avatar.src = advertisement.author.avatar;
  }

  // Возврат заполненного элемента
  return mapCard;
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
      var mapCard = fillAdvertisementCard(advertisement);
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
  var oldMapPins = mapPinsContainer.querySelectorAll('button[data-adv-id]');
  if (oldMapPins.length > 0) {
    advertisementMapPins.length = 0;
    for (var i = 0; i < oldMapPins.length; ++i) {
      mapPinsContainer.removeChild(oldMapPins[i]);
    }
  }
  renderMapPins();

  enableForms();
  fillAddress(true);
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
  if (evt.button === LEFT_MOUSE_BUTTON) {
    activateMap();
  }
});

mainMapPin.addEventListener('keydown', function (evt) {
  window.utils.isEnterEvent(evt, activateMap);
});

mapPinsContainer.addEventListener('click', onMapPinsContainerClick);

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
    case BUILDING_TYPES[3]:
      minPrice = 0;
      break;

    // Квартира
    case BUILDING_TYPES[1]:
      minPrice = 1000;
      break;

    // Дом
    case BUILDING_TYPES[2]:
      minPrice = 5000;
      break;

    // Дворец
    case BUILDING_TYPES[0]:
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

