'use strict';

(function () {
  var filterByBuildingType = function (advertisement, buildingType) {
    if (!advertisement.offer.hasOwnProperty('type')) {
      return false;
    }

    if (buildingType === 'any') {
      return true;
    }

    return advertisement.offer.type === buildingType;
  };

  var filterByPrice = function (advertisement, priceInterval) {
    if (!advertisement.offer.hasOwnProperty('price')) {
      return false;
    }

    var price = advertisement.offer.price;
    switch (priceInterval) {
      case 'any':
        return true;

      case 'middle':
        if (price >= 10000 && price <= 50000) {
          return true;
        }
        break;

      case 'low':
        if (price < 10000) {
          return true;
        }
        break;

      case 'high':
        if (price > 50000) {
          return true;
        }
        break;

      default:
        throw new Error('Неправильный диапазон цен!');
    }

    return false;
  };

  var filterByRooms = function (advertisement, roomsCount) {
    if (!advertisement.offer.hasOwnProperty('rooms')) {
      return false;
    }

    switch (roomsCount) {
      case 'any':
        return true;

      case '1':
      case '2':
      case '3':
        if (advertisement.offer.rooms === parseInt(roomsCount, 10)) {
          return true;
        }
        break;

      default:
        throw new Error('Неправильное количество комнат!');
    }

    return false;
  };

  var filterByGuests = function (advertisement, guestCount) {
    if (!advertisement.offer.hasOwnProperty('guests')) {
      return false;
    }

    switch (guestCount) {
      case 'any':
        return true;

      case '2':
      case '1':
      case '0':
        if (advertisement.offer.guests === parseInt(guestCount, 10)) {
          return true;
        }
        break;

      default:
        throw new Error('Неправильное количество гостей!');
    }

    return false;
  };

  var filterByFeatures = function (advertisement, checkedFeatures) {
    if (!advertisement.offer.hasOwnProperty('features')) {
      return false;
    }

    for (var i = 0; i < checkedFeatures.length; ++i) {
      var okFeature = false;
      for (var j = 0; j < advertisement.offer.features.length; ++j) {
        if (advertisement.offer.features[j] === checkedFeatures[i].value) {
          // Выбранная в фильтре характеристика  есть в объявлении
          okFeature = true;
          break;
        }
      }

      // Если в объявлении не оказалось выбранной хар-ки,
      // то объявление не удовлетворяет условиям фильтра
      if (!okFeature) {
        return false;
      }
    }

    return true;
  };

  window.filter = {
    filterItem: function (
        advertisement,
        typeSelector,
        priceSelector,
        roomsSelector,
        guestsSelector,
        checkedFeatures
    ) {
      return (
        filterByBuildingType(advertisement, typeSelector[typeSelector.selectedIndex].value) &&
        filterByPrice(advertisement, priceSelector[priceSelector.selectedIndex].value) &&
        filterByRooms(advertisement, roomsSelector[roomsSelector.selectedIndex].value) &&
        filterByGuests(advertisement, guestsSelector[guestsSelector.selectedIndex].value) &&
        filterByFeatures(advertisement, checkedFeatures)
      );
    }
  };
})();
