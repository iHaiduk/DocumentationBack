define(['jquery', 'taggd', 'video', 'Application/editor'], function($, taggd) {
  var _docum;
  _docum = $(document);
  _docum.ready(function() {
    var Video, video;
    Video = (function() {
      function Video(document, nameElement) {}

      Video.prototype.init = function() {
        Video.prototype.activate(_docum.find(".videoView"));
        return this;
      };

      Video.prototype.activate = function(element) {
        if (element.length) {
          element.lazyYT();
        }
      };

      return Video;

    })();
    video = new Video;
    app.Video = video.init();
  });
});
