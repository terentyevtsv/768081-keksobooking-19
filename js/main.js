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

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var mapPinTemplate = document
    .querySelector('#pin')
    .content
    .querySelector('.map__pin');

var mapSection = document.querySelector('.map');

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

    advertisement['address'] =
      advertisement.location.x +
      ', ' +
      advertisement.location.y;

    advertisements[i] = advertisement;
  }

  return advertisements;
};

// Возвращает случайное количество неповторяющихся удобств
var getRandomFeatures = function () {
  // Случайная длина массива удобств
  var featuresCount = getRandomInteger(1, FEATURES.length);
  var features = [];
  for (var i = 0; i < featuresCount; ++i) {
    features[i] = FEATURES[i];
  }

  return features;
};

// Возвращает случайное количество фото
var getRandomPhotos = function () {
  // Случайное количество фото
  var photosCount = getRandomInteger(1, PHOTOS.length);

  // Случайное фото
  var randomPhoto = PHOTOS[getRandomInteger(0, PHOTOS.length - 1)];

  var photos = [];

  // 1 фото
  if (photosCount === 1) {
    // Берем случайное фото
    photos[0] = randomPhoto;
    return photos;
  }

  // 2 фото
  if (photosCount === 2) {
    var j = 0;
    for (var i = 0; i < PHOTOS.length; ++i) {
      // Не берем случайное фото
      if (PHOTOS[i] !== randomPhoto) {
        photos[j++] = PHOTOS[i];
      }
    }
    return photos;
  }

  // Берем все фото
  for (var k = 0; k < PHOTOS.length; ++k) {
    photos[k] = PHOTOS[k];
  }

  return photos;
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
  mapPin.style.left = (advertisement.location.x - 0.5 * PIN_WIDTH) + 'px';
  mapPin.style.top = (advertisement.location.y - PIN_HEIGHT) + 'px';

  var icon = mapPin.querySelector('img');
  icon.src = advertisement.author.avatar;
  icon.alt = advertisement.offer.title;

  return mapPin;
};

var renderMapPins = function () {
  var advertisements = generateRandomAdvertisements();
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < advertisements.length; ++i) {
    var mapPin = renderMapPin(advertisements[i]);
    fragment.appendChild(mapPin);
  }

  mapSection.querySelector('.map__pins').appendChild(fragment);
};

activateMap();
renderMapPins();
