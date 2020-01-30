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

var mapPinTemplate = document
    .querySelector('#pin')
    .content
    .querySelector('.map__pin');

var mapSection = document.querySelector('.map');

var mapCardTemplate = document
  .querySelector('#card')
  .content
  .querySelector('.map__card');

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
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
        type: BUILDING_TYPES[getRandomInteger(0, BUILDING_TYPES.length - 1)],
        rooms: getRandomInteger(MIN_ROOM_COUNT, MAX_ROOM_COUNT),
        guests: getRandomInteger(MIN_GUEST_COUNT, MAX_GUEST_COUNT),
        checkin: CHECKIN_CHECKOUT_TIMES[getRandomInteger(0, checkinCheckoutTimesMaxIndex)],
        checkout: CHECKIN_CHECKOUT_TIMES[getRandomInteger(0, checkinCheckoutTimesMaxIndex)],
        features: getRandomFeatures(),
        description: DESCRIPTIONS[i],
        photos: getRandomPhotos()
      },
      location: {
        x: getRandomInteger(0, mapSection.clientWidth),
        y: getRandomInteger(MIN_COORDINATE_Y, MAX_COORDINATE_Y)
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

// Возвращает случайное количество неповторяющихся удобств
var getRandomFeatures = function () {
  var features = [];

  var randomFeatures = getRandomArrayElements(FEATURES);
  for (var i = 0; i < randomFeatures.length; ++i) {
    features[i] = randomFeatures[i].arrayContent;
  }

  return features;
};

// Возвращает случайное количество фото
var getRandomPhotos = function () {
  var photos = [];

  var randomPhotos = getRandomArrayElements(PHOTOS);

  for (var k = 0; k < randomPhotos.length; ++k) {
    photos[k] = randomPhotos[k].arrayContent;
  }

  return photos;
};

var getRandomArrayElements = function (array) {
  var arrayLength = getRandomInteger(1, array.length);
  var tmpItemWeights = [];
  for (var i = 0; i < array.length; ++i) {
    tmpItemWeights[i] = {
      weight: Math.random(),
      arrayContent: array[i]
    };
  }

  tmpItemWeights.sort(function (a, b) {
    return (a.weight - b.weight);
  });
  return tmpItemWeights.slice(0, arrayLength);
};

// Функция возвращает случайный целый элемент в выбранном диапазоне значений
var getRandomInteger = function (min, max) {
  // случайное число от min до (max+1)
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var activateMap = function () {
  mapSection.classList.remove('map--faded');
};

var renderMapPin = function (advertisement) {
  var mapPin = mapPinTemplate.cloneNode(true);

  var icon = mapPin.querySelector('img');
  icon.src = advertisement.author.avatar;
  icon.alt = advertisement.offer.title;

  return mapPin;
};

var renderMapPins = function () {
  var advertisements = generateRandomAdvertisements();
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < advertisements.length; ++i) {
    if (i === 0) {
      var mapCard = fillAdvertisementCard(advertisements[i]);
      var mapFiltersContainer = mapSection
        .querySelector('.map__filters-container');
      mapSection.insertBefore(mapCard, mapFiltersContainer);
    }
    var mapPin = renderMapPin(advertisements[i]);
    fragment.appendChild(mapPin);
  }

  var mapPinsContainer = mapSection.querySelector('.map__pins');
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
    }
  }
};

var fillAdvertisementCard = function (advertisement) {
  var mapCard = mapCardTemplate.cloneNode(true);

  var buildingDescriptions = {};
  for (var i = 0; i < BUILDING_TYPES.length; ++i) {
    buildingDescriptions[BUILDING_TYPES[i]] = BUILDING_DESCRIPTIONS[i];
  }

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

  var className;
  var width;
  var height;
  var alternateText;

  // Заполнение существующего и создание новых img
  for (var i = 0; i < photos.length; ++i) {
    if (i === 0) {
      className = photoItem.className;
      width = photoItem.width;
      height = photoItem.height;
      alternateText = photoItem.alt;

      photoItem.src = photos[i];

      continue;
    }

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

activateMap();
renderMapPins();

