'use strict';

(function () {
  var avatarChooserElement = document.querySelector('#avatar');
  var avatarPreviewElement = document.querySelector('.ad-form-header__preview img');

  avatarChooserElement.addEventListener('change', function () {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      avatarPreviewElement.src = reader.result;
    });

    reader.readAsDataURL(avatarChooserElement.files[0]);
  });

  var photosChooserElement = document.querySelector('#images');
  var photosPreviewElement = document.querySelector('.ad-form__photo');
  photosChooserElement.addEventListener('change', function () {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      var photoElement = photosPreviewElement.querySelector('img');
      if (photoElement === null) {
        photoElement = document.createElement('img');
        photoElement.width = photosPreviewElement.offsetWidth;
        photoElement.height = photosPreviewElement.offsetHeight;
        photoElement.alt = 'Фото недвижимости';

        photosPreviewElement.appendChild(photoElement);
      }

      photoElement.src = reader.result;
    });

    reader.readAsDataURL(photosChooserElement.files[0]);
  });

})();
