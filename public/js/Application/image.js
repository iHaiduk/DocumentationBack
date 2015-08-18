var _local;

_local = this;

define(['jquery', 'taggd', 'Application/editor'], function($, taggd) {
  var _docum;
  _docum = $(document);
  return _docum.ready(function() {
    var ImageTolltip, image;
    ImageTolltip = (function() {
      function ImageTolltip(document, nameElement) {
        ImageTolltip.prototype.tag = _docum.find('.taggd');
        ImageTolltip.prototype.data = _local.dataImages;
        ImageTolltip.prototype.option = {
          align: {
            y: 'bottom'
          },
          offset: {
            top: -35
          },
          handlers: {
            mouseenter: 'show',
            mouseleave: 'hide',
            click: 'toggle'
          }
        };
      }

      ImageTolltip.prototype.init = function() {
        if (ImageTolltip.prototype.tag.length) {
          ImageTolltip.prototype.tag.each(function() {
            if (ImageTolltip.prototype.data[$(this).attr("id")] != null) {
              $(this).taggd($.extend(false, ImageTolltip.prototype.option, {
                edit: false,
                handlers: {
                  mouseenter: 'show',
                  mouseleave: 'hide',
                  click: 'toggle'
                }
              }), ImageTolltip.prototype.data[$(this).attr("id")]);
            }
          });
        }
        return this;
      };

      ImageTolltip.prototype.add = function(elem) {
        ImageTolltip.prototype.tag = _docum.find('.taggd');
        if (elem.length) {
          ImageTolltip.prototype.data[elem.attr("id")] = [];
          elem.taggd($.extend(true, ImageTolltip.prototype.option, {
            edit: true
          }), ImageTolltip.prototype.data[elem.attr("id")]);
        }
      };

      ImageTolltip.prototype.edit = function() {
        ImageTolltip.prototype.destroy();
        ImageTolltip.prototype.tag.each(function() {
          var _t;
          ImageTolltip.prototype.data[$(this).attr("id")] = ImageTolltip.prototype.data[$(this).attr("id")] != null ? ImageTolltip.prototype.data[$(this).attr("id")] : [];
          if (ImageTolltip.prototype.data[$(this).attr("id")] != null) {
            _t = $(this).taggd($.extend(true, ImageTolltip.prototype.option, {
              edit: true
            }), ImageTolltip.prototype.data[$(this).attr("id")]);
          }
          _t.on('change', function() {
            ImageTolltip.prototype.data[$(this).attr("id")] = _t.data;
          });
        });
      };

      ImageTolltip.prototype.save = function() {
        ImageTolltip.prototype.destroy();
        ImageTolltip.prototype.tag = _docum.find('.taggd');
        ImageTolltip.prototype.init();
      };

      ImageTolltip.prototype.destroy = function() {
        if (ImageTolltip.prototype.tag != null) {
          ImageTolltip.prototype.tag.each(function() {
            var img;
            if ($(this).wrapper != null) {
              img = $(this).wrapper.find("img");
            } else {
              img = $(this);
            }
            img.parents(".sub-section").html(img);
            ImageTolltip.prototype.tag = _docum.find('.taggd');
          });
        }
      };

      return ImageTolltip;

    })();
    image = new ImageTolltip();
    app.Image = image;
  });
});
