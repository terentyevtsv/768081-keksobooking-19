'use strict';

var ADVERTISEMENT_COUNT = 8;
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

var ROOM_COUNTS = [1, 2, 3, 100];
var GUEST_COUNTS = [1, 2, 3];

var MIN_COORDINATE_Y = 130;
var MAX_COORDINATE_Y = 630;


var generateRandomAdvertisements = function () {
  var advertisements = [];
  var checkinCheckoutTimesMaxIndex = CHECKIN_CHECKOUT_TIMES.length - 1;
  for (var i = 0; i < ADVERTISEMENT_COUNT; ++i) {
    var advertisement = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },

      offer: {
        title: '',
        address: location.x + ', ' + location.y,
        price: 0,
        type: BUILDING_TYPES[getRandomInteger(0, BUILDING_TYPES.length - 1)],
        rooms: 0,
        guests: 0,
        checkin: CHECKIN_CHECKOUT_TIMES[getRandomInteger(0, checkinCheckoutTimesMaxIndex)],
        checkout: CHECKIN_CHECKOUT_TIMES[getRandomInteger(0, checkinCheckoutTimesMaxIndex)],
        features: getRandomFeatures(),
        description: '',
        photos: getRandomPhotos()
      },

      location: {
        x: 0,
        y: getRandomInteger(MIN_COORDINATE_Y, MAX_COORDINATE_Y)
      }
    };
  }
};

// Возвращает случайное количество удобств
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
  var photosCount = getRandomInteger(1, PHOTOS.length);
  var photos = [];
  for (var i = 0; i < photosCount; ++i) {
    photos[i] = PHOTOS[i];
  }

  return photos;
};

// Функция возвращает случайный целый элемент в выбранном диапазоне значений
var getRandomInteger = function (min, max) {
  // случайное число от min до (max+1)
  var randomValue = min + Math.random() * (max + 1 - min);
  return Math.floor(randomValue);
};
