define(['jquery'], function($, Typekit) {
  var _document;
  _document = $(document);
  _document.ready(function() {
    $('.btn-product, .close').off('click').on('click', function() {
      var bool;
      bool = $(this).hasClass('btn-product');
      $('.popup').toggleClass('visible', bool);
    });
  });
});
