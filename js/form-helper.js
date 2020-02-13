'use strict';

(function () {
  var mapSection = document.querySelector('.map');
  var mapCheckFilter = mapSection.querySelector('.map__filters .map__features');
  var mapSelectFilters = mapSection.querySelectorAll('.map__filters .map__filter');

  window.formHelper = {
    enableFilter: function () {
      // Показ формы фильтров
      mapCheckFilter.removeAttribute('disabled');
      for (var j = 0; j < mapSelectFilters.length; ++j) {
        mapSelectFilters[j].removeAttribute('disabled');
      }

      mapSection.classList.remove('map--faded');
    }
  };
})();
