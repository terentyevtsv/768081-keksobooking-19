'use strict';

(function () {
  var avatarChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');

  avatarChooser.addEventListener('change', function () {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      avatarPreview.src = reader.result;
    });

    reader.readAsDataURL(avatarChooser.files[0]);
  });

  var photosChooser = document.querySelector('#images');
  var photosPreview = document.querySelector('.ad-form__photo');
  photosChooser.addEventListener('change', function () {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      var photo = photosPreview.querySelector('img');
      if (photo === null) {
        photo = document.createElement('img');
        photo.width = photosPreview.offsetWidth;
        photo.height = photosPreview.offsetHeight;
        photo.alt = 'Фото недвижимости';

        photosPreview.appendChild(photo);
      }

      photo.src = reader.result;
    });

    reader.readAsDataURL(photosChooser.files[0]);
  });

})();
