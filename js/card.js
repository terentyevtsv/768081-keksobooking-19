'use strict';

// модуль, который отвечает за создание карточки объявлений
(function () {
  var BUILDING_DESCRIPTIONS = [
    'Дворец',
    'Квартира',
    'Дом',
    'Бунгало',
  ];

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

  var getBuildingDescriptions = function () {
    var buildingDescriptions = {};

    for (var k = 0; k < window.data.BUILDING_TYPES.length; ++k) {
      buildingDescriptions[window.data.BUILDING_TYPES[k]] = BUILDING_DESCRIPTIONS[k];
    }

    return buildingDescriptions;
  };

  var buildingDescriptions = getBuildingDescriptions();

  window.card = {
    fillAdvertisementCard: function (advertisement) {
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
    }
  };
})();
