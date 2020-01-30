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
    var tmpItemWeight = {
      weight: Math.random(),
      arrayContent: array[i]
    };
    tmpItemWeights[i] = tmpItemWeight;
  }

  tmpItemWeights.sort(compareFunction);
  return tmpItemWeights.slice(0, arrayLength);
};

var compareFunction = function (a, b) {
  return (a.weight - b.weight);
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
    var mapPin = renderMapPin(advertisements[i]);
    fragment.appendChild(mapPin);
  }

  var mapPinsContainer = mapSection
    .querySelector('.map__pins');
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

activateMap();
renderMapPins();
