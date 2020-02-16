'use strict';

// модуль, который отвечает за создание метки на карте
(function () {
  var onSuccess = function (data) {
    // Берем только полные объявления
    window.data.allAdvertisements = data.filter(function (datum) {
      return datum.hasOwnProperty('offer');
    });

    // Для отрисовки только первые 5
    var advertisements = window.data.allAdvertisements.slice(
        0,
        window.pinHelper.RENDERED_PINS_COUNT
    );
    window.pinHelper.renderPins(advertisements);

    // после загрузки активация фильтра
    window.formHelper.enableFilter();
    window.formHelper.enableForm();
  };

  window.pin = {
    render: function (onError) {
      window.data.loadAdvertisements(onSuccess, onError);
    }
  };
})();
