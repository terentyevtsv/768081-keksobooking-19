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
  var getInformationFieldElement = function (
      mapCardElement,
      cssClass,
      parentObject,
      currentProperty
  ) {
    var cardsItemElement = mapCardElement.querySelector(cssClass);

    if (!parentObject.hasOwnProperty(currentProperty)) {
      cardsItemElement.classList.add('hidden');
      return null;
    }

    return cardsItemElement;
  };

  // Скрывает не содержащиеся в списке удобства
  var createFeaturesList = function (features, featureElements, popupFeatureListElement) {
    var featureExistFlags = {};
    var keys = [];

    // Полный список удобств
    for (var i = 0; i < featureElements.length; ++i) {
      keys[i] = featureElements[i].classList[1].replace('popup__feature--', '');
      featureExistFlags[keys[i]] = false;
    }

    // Выставляем true для списка доступных
    for (var j = 0; j < features.length; ++j) {
      featureExistFlags[features[j]] = true;
    }

    for (var k = 0; k < keys.length; ++k) {
      if (!featureExistFlags[keys[k]]) {
        popupFeatureListElement.removeChild(featureElements[k]);
      }
    }
  };

  // формирует список доступных фото недвижимости
  var createPhotosList = function (photosContainerElement, mapCardElement, photos) {
    var photoElement = mapCardElement.querySelector('.popup__photo');
    var fragment = document.createDocumentFragment();

    // Заполнение существующего и создание новых img
    var className = photoElement.className;
    var width = photoElement.width;
    var height = photoElement.height;
    var alternateText = photoElement.alt;

    photoElement.src = photos[0];
    for (var i = 1; i < photos.length; ++i) {
      var imageElement = document.createElement('img');

      imageElement.src = photos[i];
      imageElement.className = className;
      imageElement.width = width;
      imageElement.height = height;
      imageElement.alt = alternateText;

      fragment.appendChild(imageElement);
    }

    photosContainerElement.appendChild(fragment);
  };

  var mapCardTemplateElement = document
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

  var mapSectionElement = document.querySelector('.map');

  window.card = {
    fillAdvertisement: function (advertisement) {
      var mapCardElement = mapCardTemplateElement.cloneNode(true);

      // Получение блоков для вставки значений
      var titleElement = getInformationFieldElement(
          mapCardElement,
          '.popup__title',
          advertisement.offer,
          'title'
      );
      var textAddressElement = getInformationFieldElement(
          mapCardElement,
          '.popup__text--address',
          advertisement.offer,
          'address'
      );
      var textPriceElement = getInformationFieldElement(
          mapCardElement,
          '.popup__text--price',
          advertisement.offer,
          'price'
      );
      var buildingTypeElement = getInformationFieldElement(
          mapCardElement,
          '.popup__type',
          advertisement.offer,
          'type'
      );

      var textCapacityElement = mapCardElement.querySelector('.popup__text--capacity');
      var hasRooms = advertisement.offer.hasOwnProperty('rooms');
      var hasGuests = advertisement.offer.hasOwnProperty('guests');
      if (!hasRooms && !hasGuests) {
        textCapacityElement.classList.add('hidden');
        textCapacityElement = null;
      }

      var textTimeElement = mapCardElement.querySelector('.popup__text--time');
      var hasCheckin = advertisement.offer.hasOwnProperty('checkin');
      var hasCheckout = advertisement.offer.hasOwnProperty('checkout');
      if (!hasCheckin && !hasCheckout) {
        textTimeElement.classList.add('hidden');
        textTimeElement = null;
      }

      var popupFeaturesListElement = getInformationFieldElement(
          mapCardElement,
          '.popup__features',
          advertisement.offer,
          'features'
      );
      var descriptionElement = getInformationFieldElement(
          mapCardElement,
          '.popup__description',
          advertisement.offer,
          'description'
      );
      var photosContainerElement = getInformationFieldElement(
          mapCardElement,
          '.popup__photos',
          advertisement.offer,
          'photos'
      );
      var avatarElement = getInformationFieldElement(
          mapCardElement,
          '.popup__avatar',
          advertisement.author,
          'avatar'
      );

      // Вставка значений в блоки
      if (titleElement !== null) {
        titleElement.textContent = advertisement.offer.title;
      }

      if (textAddressElement !== null) {
        textAddressElement.textContent = advertisement.offer.address;
      }

      if (textPriceElement !== null) {
        textPriceElement.textContent = advertisement.offer.price + '₽/ночь';
      }

      if (buildingTypeElement !== null) {
        buildingTypeElement.textContent = buildingDescriptions[advertisement.offer.type];
      }

      if (textCapacityElement !== null) {
        textCapacityElement.textContent = '';

        if (hasRooms) {
          textCapacityElement.textContent += 'Количество комнат: ' + advertisement.offer.rooms + '. ';
        }

        if (hasGuests) {
          textCapacityElement.textContent += 'Количество гостей: ' + advertisement.offer.guests + '.';
        }
      }

      if (textTimeElement !== null) {
        textTimeElement.textContent = '';

        if (hasCheckin) {
          textTimeElement.textContent += 'Заезд после ' + advertisement.offer.checkin + '. ';
        }

        if (hasCheckout) {
          textTimeElement.textContent += 'Выезд до ' + advertisement.offer.checkout + '.';
        }
      }

      if (popupFeaturesListElement !== null) {
        var featureElements = popupFeaturesListElement.querySelectorAll('.popup__feature');
        createFeaturesList(advertisement.offer.features, featureElements, popupFeaturesListElement);
      }

      if (descriptionElement !== null) {
        descriptionElement.textContent = advertisement.offer.description;
      }

      if (photosContainerElement !== null) {
        createPhotosList(photosContainerElement, mapCardElement, advertisement.offer.photos);
      }

      if (avatarElement !== null) {
        avatarElement.src = advertisement.author.avatar;
      }

      // Возврат заполненного элемента
      return mapCardElement;
    },
    close: function () {
      // Закрытие карточки
      var mapCardElement = mapSectionElement.querySelector('.map__card');
      if (mapCardElement !== null) {
        mapSectionElement.removeChild(mapCardElement);
        document.removeEventListener('keydown', window.card.onDialogEscPress);
      }
    },
    onDialogEscPress: function (evt) {
      window.utils.isEscEvent(evt, window.card.close);
    }
  };
})();
