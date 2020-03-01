'use strict';

// Модуль хранит самые общие широкоупотребимые функции.
// Они могут использоваться во многих программах.
(function () {
  var ENTER_KEY = 'Enter';
  var ESCAPE_KEY = 'Escape';

  var LEFT_MOUSE_BUTTON = 0;

  window.utils = {
    isEscEvent: function (evt, action) {
      // Анализ нажатия клавиши esc
      if (evt.key === ESCAPE_KEY) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      // Анализ нажатия клавиши enter
      if (evt.key === ENTER_KEY) {
        action();
      }
    },
    isLeftMouseButtonEvent: function (evt, action) {
      if (evt.button === LEFT_MOUSE_BUTTON) {
        action();
      }
    }
  };
})();
