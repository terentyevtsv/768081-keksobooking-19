'use strict';

// модуль, который создаёт данные
(function () {
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

  var mapSection = document.querySelector('.map');

  window.data = {
    BUILDING_TYPES: BUILDING_TYPES,
    MIN_COORDINATE_Y: MIN_COORDINATE_Y,
    MAX_COORDINATE_Y: MAX_COORDINATE_Y,
    generateRandomAdvertisements: function () {
      // Генератор случайных объявлений
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
    },
    loadAdvertisements: function (onSuccess) {
      var onError = function (message) {
        return message;
      };

      window.load.getData('https://js.dump.academy/keksobooking/data', onSuccess, onError);
    }
  };
})();
