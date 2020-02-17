'use strict';

(function () {
  window.filter = {
    makeFilterByPrice: function (advertisement, priceInterval) {
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
    },

    makeFilterByRooms: function (advertisement, roomsCount) {
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
    },

    makeFilterByGuests: function (advertisement, guestCount) {
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
    }
  };
})();
