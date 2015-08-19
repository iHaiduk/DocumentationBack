
/**
 * Created by Igor on 02.08.2015.
 */
define(['jquery', 'codemirror', 'redactor', 'Application/menu', 'Application/image', 'Application/video', 'Application/search', 'codemirror/mode/htmlmixed/htmlmixed', 'codemirror/mode/clike/clike', 'codemirror/mode/coffeescript/coffeescript', 'codemirror/mode/css/css', 'codemirror/mode/javascript/javascript', 'codemirror/mode/php/php', 'codemirror/mode/sass/sass', 'codemirror/mode/sql/sql'], function($, CodeMirror) {
  var _docum;
  _docum = $(document);
  _docum.ready(function() {
    var CodeSave, Redactor, codeSave, link_insert, redactor;
    link_insert = 0;
    $.Redactor.prototype.insertHead = function() {
      return {
        init: function() {
          var button, button2, button3, button4, button5, button6;
          button = this.button.add('header1');
          this.button.addCallback(button, this.insertHead.insertH1);
          button2 = this.button.add('header2');
          this.button.addCallback(button2, this.insertHead.insertH2);
          button5 = this.button.add('blockquote');
          this.button.addCallback(button5, this.insertHead.blockquote);
          button6 = this.button.add('clear');
          this.button.addCallback(button6, this.insertHead.clear);
          button3 = this.button.add('alignment');
          this.button.addCallback(button3, this.insertHead.center);
          button4 = this.button.add('link');
          this.button.addCallback(button4, this.insertHead.link);
        },
        insertH1: function(key) {
          var _block, _html;
          this.selection.restore();
          _block = $(this.selection.getBlock());
          _block = _block[0].tagName.toLowerCase() !== "p" ? _block.parent() : _block;
          _html = $(this.selection.getBlock()).html();
          if (_html.indexOf("<sup") === -1) {
            $(this.selection.getBlock()).html("<sup>" + $(this.selection.getBlock()).text() + "<sup>");
          } else {
            $(this.selection.getBlock()).html($(this.selection.getBlock()).text());
          }
          this.code.sync();
          this.observe.load();
          _block.find("sup").each(function() {
            if (!$(this).text().trim().length) {
              $(this).remove();
            }
          });
        },
        insertH2: function(key) {
          var _block, _html;
          this.selection.restore();
          _block = $(this.selection.getBlock());
          _block = _block[0].tagName.toLowerCase() !== "p" ? _block.parent() : _block;
          _html = $(this.selection.getBlock()).html();
          if (_html.indexOf("<sub") === -1) {
            $(this.selection.getBlock()).html("<sub>" + $(this.selection.getBlock()).text() + "<sub>");
          } else {
            $(this.selection.getBlock()).html($(this.selection.getBlock()).text());
          }
          this.code.sync();
          this.observe.load();
          _block.find("sub").each(function() {
            if (!$(this).text().trim().length) {
              $(this).remove();
            }
          });
        },
        center: function() {
          this.selection.restore();
          this.inline.format('center');
          this.code.sync();
          this.observe.load();
        },
        link: function() {
          this.selection.restore();
          $("#viewDoc").find("a").removeClass("selected");
          Redactor.prototype.lastLinkActive = "link_insert_" + (new Date).getTime();
          if (this.selection.getHtml().indexOf("<a id") !== -1) {
            this.insert.html(this.selection.getText(), false);
          } else {
            this.insert.html('<a id="' + Redactor.prototype.lastLinkActive + '" href="" class="selected">' + this.selection.getText() + '</a>', false);
          }
          this.code.sync();
          this.observe.load();
          Redactor.prototype.findLink(Redactor.prototype.redactor);
          $("#link_value").focus();
        },
        blockquote: function() {
          this.selection.restore();
          this.inline.format('blockquote');
          if (this.selection.getParent() && $(this.selection.getParent())[0].tagName.toLowerCase() === 'sup') {
            this.inline.format('sup');
          }
          if (this.selection.getParent() && $(this.selection.getParent())[0].tagName.toLowerCase() === 'sub') {
            this.inline.format('sub');
          }
          this.code.sync();
          this.observe.load();
        },
        clear: function() {
          this.selection.restore();
          $(this.selection.getBlock()).html($(this.selection.getBlock()).text());
          this.insert.html(this.selection.getText(), false);
          this.code.sync();
          this.observe.load();
        },
        save: function() {
          app.codeSave.clean();
          Redactor.prototype.document.find("#initRedactor").removeClass("btn-save").addClass("btn-edit");
          $("body").removeClass("editing");
          Redactor.prototype.save();
          app.Image.save();
          app.codeSave.send();
        }
      };
    };
    CodeSave = (function() {
      function CodeSave(deafult) {
        if (deafult == null) {
          deafult = [];
        }
        CodeSave.prototype.code = deafult;
      }

      CodeSave.prototype.init = function() {
        return this;
      };

      CodeSave.prototype.clean = function() {
        CodeSave.prototype.code = [];
      };

      CodeSave.prototype.add = function() {
        _docum.find(".section").each(function() {
          var code, data, param_id, sub, type;
          type = $(this).data().type;
          sub = $(this).find(".sub-section");
          data = {};
          switch (type) {
            case "image":
              if (!sub.hasClass("deleted")) {
                code = sub.find(".image").attr("src");
                data = {
                  id: sub.find(".image").attr("id"),
                  data: $.map(app.Image.data[sub.find(".image").attr("id")], function(a) {
                    if ($.trim(a.text).length) {
                      return a;
                    }
                  })
                };
              }
              break;
            case "video":
              code = sub.find(".videoView").data().youtubeId;
              break;
            case "hr":
              code = Redactor.prototype.template.hr;
              break;
            case "code":
              param_id = $(this).find(".code").attr("id").replace("#", "");
              code = Redactor.prototype.CodeMirror[param_id].getValue();
              data = {
                type: Redactor.prototype.CodeMirror[param_id].getMode().name === "sql" ? "text/x-mysql" : Redactor.prototype.CodeMirror[param_id].getMode().name,
                id: param_id
              };
              break;
            default:
              type = "text";
              code = sub.html();
          }
          if (code != null) {
            CodeSave.prototype.code.push({
              param: type,
              code: code,
              data: data
            });
          }
        });
      };

      CodeSave.prototype.send = function() {
        CodeSave.prototype.clean();
        CodeSave.prototype.add();
        $("#loader").removeClass("hide");
        setTimeout(function() {
          return $.ajax({
            url: "/save",
            type: "post",
            data: {
              code: JSON.stringify(CodeSave.prototype.code)
            },
            dataType: "json",
            async: false,
            success: function(data) {
              $("#loader").addClass("hide");
              return $("#viewDoc").find(".section:last").after("<div class=\"section\" data-type=\"text\">\n    <div class=\"sub-section\">\n        <p>&#8203</p>\n        <p>&#8203</p>\n        <p style=\"display:none\">&#8203</p>\n    </div>\n</div>");
            },
            error: function() {
              return $("#loader").addClass("hide");
            }
          });
        }, 50);
      };

      CodeSave.prototype.cancel = function(cb) {
        CodeSave.prototype.clean();
        $.ajax({
          url: "/cancel",
          type: "get",
          success: function(data) {
            $("#loader").addClass("hide");
            cb(data);
          },
          error: function() {
            return $("#loader").addClass("hide");
          }
        });
      };

      return CodeSave;

    })();
    Redactor = (function() {
      function Redactor(document, nameElement) {
        Redactor.prototype.redactor = null;
        Redactor.prototype.toolbar = null;
        Redactor.prototype.document = document;
        Redactor.prototype.nameElement = nameElement;
        Redactor.prototype.elements = document.find(nameElement);
        Redactor.prototype.activeElement = null;
        Redactor.prototype.CodeMirror = {};
        Redactor.prototype.lastFocus = null;
        Redactor.prototype.lastSection = null;
        Redactor.prototype.lastLinkActive = null;
        Redactor.prototype.editLinkActive = false;
        Redactor.prototype.lastSectionRemove = null;
        Redactor.prototype.position = {
          start: {
            x: 0,
            y: 0
          },
          end: {
            x: 0,
            y: 0
          }
        };
        Redactor.prototype.template = {
          empty: "<div class=\"section\" data-type=\"text\">\n    <div class=\"sub-section\"></div>\n</div>",
          image: "<form id=\"form1\" runat=\"server\">\n<label for='imgInp' id='uploadImage'></label>\n    <input type='file' id=\"imgInp\" />\n</form>\n    <img src=\"\" class=\"image taggd\" />",
          code: "<textarea class='code' data-mode='htmlmixed'></textarea><ul class=\"language-list\" >\n<li class=\"language active\" data-type=\"htmlmixed\">HTML</li>\n<li class=\"language\" data-type=\"CSS\">CSS</li>\n<li class=\"language\" data-type=\"SASS\">SASS</li>\n<li class=\"language\" data-type=\"JavaScript\">JavaScript</li>\n<li class=\"language\" data-type=\"coffeescript\">CoffeeScript</li>\n<li class=\"language\" data-type=\"PHP\">PHP</li>\n<li class=\"language\" data-type=\"text/x-mysql\">SQL</li>\n</ul>",
          video: "<input class='video' type='text' placeholder='Please insert youtube ID...' />",
          hr: "<hr/>"
        };
      }

      Redactor.prototype.init = function() {
        Redactor.prototype.document.find("#initRedactor").off('click').on('click', function() {
          if ($(this).hasClass("btn-edit")) {
            Redactor.prototype.elements = Redactor.prototype.document.find(Redactor.prototype.nameElement);
            $(this).removeClass("btn-edit").addClass("btn-save");
            $("body").addClass("editing");
            Redactor.prototype.reset();
            Redactor.prototype.initialize();
            Redactor.prototype.showPlusButton();
            app.Image.edit();
          } else {
            $(this).removeClass("btn-save").addClass("btn-edit");
            $("body").removeClass("editing");
            Redactor.prototype.save();
            app.Image.save();
            _docum.find(".selected").removeClass("selected");
            app.codeSave.send();
          }
        });
        Redactor.prototype.document.find("#cancelRedactor").off('click').on('click', function() {
          Redactor.prototype.document.find("#initRedactor").removeClass("btn-save").addClass("btn-edit");
          $("body").removeClass("editing");
          app.codeSave.cancel(function(html) {
            _docum.find("#viewDoc").html(html);
            _docum.find(".selected").removeClass("selected");
            Redactor.prototype.save();
            app.Image.save();
            _docum.find(".selected").removeClass("selected");
            Redactor.prototype.init();
          });
        });
        Redactor.prototype.document.find(".code").each(function() {
          Redactor.prototype.CodeMirror[$(this).attr("id")] = CodeMirror.fromTextArea(this, {
            mode: $(this).data().mode,
            lineNumbers: true,
            matchBrackets: true,
            styleActiveLine: true,
            htmlMode: true,
            theme: "3024-day"
          });
        });
        Redactor.prototype.addListen();
        Redactor.prototype.changeTypeListen();
        app.Video.activate(parent.find(".videoView"));
        app.Image.init();
        $("#loader").addClass("hide");
      };

      Redactor.prototype.reset = function() {
        Redactor.prototype.elements.find(".code").removeClass().addClass("code").each(function() {
          $(this).text($(this).text());
        });
      };

      Redactor.prototype.addListen = function() {
        $("#link-toolbar").on("click", function(e) {
          if (!$(e.target).hasClass("close")) {
            Redactor.prototype.editLinkActive = true;
            $(this).addClass("active");
          }
        });
        $("#link_close").on("click", function() {
          $(this).parent().removeClass("active");
          Redactor.prototype.editLinkActive = false;
        });
        $("#link_value").on("click, keydown, keyup", function() {
          Redactor.prototype.editLinkActive = true;
          $(this).parent().addClass("active");
        });
        Redactor.prototype.document.find('.btn-toggle').off('click').on('click', function() {
          $(this).toggleClass('open');
        });
        Redactor.prototype.document.find('.icon-image').off('click').on('click', function() {
          Redactor.prototype.mediaButton("image", Redactor.prototype.template.image, function(element) {
            $("#imgInp").parents(".noRedactor").addClass("deleted");
            $("#media-toolbar").removeClass("active");
            Redactor.prototype.preUploadImage(element);
            $("#uploadImage").click();
          });
        });
        Redactor.prototype.preUploadImage = function(element) {
          $("#imgInp").on("change", function(e) {
            var file, imageType, parent, reader;
            element = $(element[2]);
            parent = element.parents(".noRedactor");
            file = e.target.files[0];
            imageType = /image.*/;
            if (!file.type.match(imageType)) {
              return;
            }
            reader = new FileReader;
            reader.onload = function(e) {
              parent.removeClass("deleted");
              $("#form1").remove();
              element.attr({
                src: e.target.result,
                id: "image_" + (new Date).getTime()
              });
              app.Image.add(element);
            };
            reader.readAsDataURL(file);
          });
        };
        Redactor.prototype.getBase64Image = function(imgElem) {
          var canvas, ctx, dataURL;
          canvas = document.createElement('canvas');
          canvas.width = imgElem.clientWidth;
          canvas.height = imgElem.clientHeight;
          ctx = canvas.getContext('2d');
          ctx.drawImage(imgElem, 0, 0);
          dataURL = canvas.toDataURL('image/png');
          return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
        };
        Redactor.prototype.document.find('.icon-video').off('click').on('click', function() {
          Redactor.prototype.mediaButton("video", Redactor.prototype.template.video, function(element) {
            element.focus().on("blur keyup", function(e) {
              var parent;
              if ((e.type === "blur" || (e.type === "keyup" && e.which === 13)) && $(this).val().length > 5) {
                parent = $(this).parent();
                parent.html("<div class=\"videoView\" data-youtube-id='" + $(this).val() + "' data-ratio=\"16:9\"></div>");
                parent.after("<span class=\"btn btn-toggle remove\"></span>");
                app.Video.activate(parent.find(".videoView"));
                Redactor.prototype.addListen();
              }
            });
          });
        });
        Redactor.prototype.document.find('.icon-code').off('click').on('click', function() {
          Redactor.prototype.mediaButton("code", Redactor.prototype.template.code, function(element) {
            var param_id;
            param_id = "redactor_" + (new Date).getTime();
            $(element[0]).attr("id", param_id);
            $(element[1]).attr("data-id", param_id);
            Redactor.prototype.CodeMirror[param_id] = CodeMirror.fromTextArea(element[0], {
              mode: "htmlmixed",
              lineNumbers: true,
              matchBrackets: true,
              styleActiveLine: true,
              htmlMode: true,
              theme: "3024-day"
            });
            Redactor.prototype.changeTypeListen();
          });
        });
        $("#media-toolbar").find('.icon-hr').off('click').on('click', function() {
          Redactor.prototype.mediaButton("hr", Redactor.prototype.template.hr);
        });
        Redactor.prototype.document.find('.remove').off('click').on('click', function() {
          var _this;
          _this = $(this);
          _this.parent(".section").remove();
          Redactor.prototype.addListen();
          _this.remove();
        });
      };

      Redactor.prototype.mediaButton = function(type, code, call) {
        var element, frstSectionArray, frstSectionArrayHTML, lastSectionArray, lastSectionArrayHTML, noRedactorSection, parentSection, pos;
        frstSectionArray = [];
        lastSectionArray = [];
        parentSection = Redactor.prototype.lastSection.hasClass("sub-section") ? Redactor.prototype.lastSection : Redactor.prototype.lastSection.parents(".sub-section");
        pos = parentSection.find("p").index(parentSection.find(".empty"));
        parentSection.find("p").each(function() {
          if (parentSection.find("p").index($(this)) >= 0) {
            if (parentSection.find("p").index($(this)) < pos) {
              frstSectionArray.push($(this));
            }
            if (parentSection.find("p").index($(this)) > pos) {
              lastSectionArray.push($(this));
            }
          }
        });
        frstSectionArray = frstSectionArray.map(function(el) {
          return el.get()[0].outerHTML;
        });
        lastSectionArray = lastSectionArray.map(function(el) {
          return el.get()[0].outerHTML;
        });
        frstSectionArrayHTML = frstSectionArray.join("");
        lastSectionArrayHTML = lastSectionArray.join("");
        parentSection.redactor("code.set", frstSectionArrayHTML);
        element = $(code);
        noRedactorSection = $("<div class='section' data-type='" + type + "'><div class='sub-section noRedactor'></div><span class='btn btn-toggle remove'></span></div></div>");
        noRedactorSection.find(".sub-section").html(element);
        parentSection.find(".empty").remove();
        parentSection.parents(".section").after(noRedactorSection);
        if (!$(frstSectionArrayHTML).text().trim().length) {
          parentSection.remove();
        }
        if (!$(lastSectionArrayHTML).text().trim().length) {
          lastSectionArrayHTML = "<p class='empty'></p>";
        }
        Redactor.prototype.addSection(noRedactorSection, lastSectionArrayHTML);
        Redactor.prototype.addListen();
        $("#media-toolbar").find(".btn-toggle").removeClass("open");
        if ((call != null) && typeof call === "function") {
          call(element, noRedactorSection);
        }
      };

      Redactor.prototype.addSection = function(block, code) {
        var newBlock;
        newBlock = $(Redactor.prototype.template.empty);
        block.after(newBlock);
        Redactor.prototype.elements = Redactor.prototype.document.find(Redactor.prototype.nameElement + ":not(.noRedactor)");
        Redactor.prototype.lastSection = newBlock.find(".sub-section");
        Redactor.prototype.addRedactor(newBlock.find(".sub-section:not(.noRedactor)"), false, code);
        Redactor.prototype.addListen();
      };

      Redactor.prototype.initialize = function() {
        Redactor.prototype.loadRedactors();
      };

      Redactor.prototype.loadRedactors = function() {
        Redactor.prototype.elements.not(".noRedactor").each(function() {
          Redactor.prototype.addRedactor($(this));
        });
      };

      Redactor.prototype.addRedactor = function(element, focus, code) {
        var _elements;
        if (focus == null) {
          focus = false;
        }
        if ((element != null) && !element.hasClass("noRedactor")) {
          _elements = Redactor.prototype.elements;
          element.redactor({
            iframe: true,
            cleanStyleOnEnter: false,
            focus: focus,
            tabAsSpaces: 4,
            buttons: ['bold', 'italic', 'deleted'],
            plugins: ['insertHead'],
            shortcutsAdd: {
              'ctrl+enter': {
                func: 'insertHead.newRedactor'
              },
              'ctrl+s': {
                func: 'insertHead.save'
              }
            },
            initCallback: function() {
              Redactor.prototype.redactor = this;
              if (code != null) {
                this.code.set(code);
              }
              element.off('click');
              Redactor.prototype.activeElement = element;
              Redactor.prototype.listenEvent(element);
              Redactor.prototype.showPlusButton(this);
              this.$element.find("p").each(function() {
                if ($(this).text().length && !$(this).html().replace(/\u200B/g, '').length) {
                  $(this).html("<br/>");
                }
              });
              this.code.sync();
              this.observe.load();
            },
            changeCallback: function() {
              if (!(this.$element.find("p").length) && $("#viewDoc").find(".sub-section:not(.noRedactor)").length > 1) {
                this.$element.parents(".section").remove();
                _docum.find("#media-toolbar").removeClass("active");
                Redactor.prototype.lastSectionRemove = true;
              }
              this.$element.find("p").each(function() {
                if (!$(this).text().length || !$(this).html().replace(/\u200B/g, '').length) {
                  $(this).html("<br/>");
                }
              });
              Redactor.prototype.showPlusButton(this, true);
              if (this.sel.type !== "Range") {
                _elements.parent().find('.redactor-toolbar').stop().fadeOut(400);
              }
              $("#viewDoc").find(".section-wrap > span").remove();
            },
            blurCallback: function() {
              var redactor;
              this.$element.removeClass("focus");
              _elements.parent().find('.redactor-toolbar').stop().fadeOut(400);
              redactor = this;
              setTimeout(function() {
                Redactor.prototype.showPlusButton(redactor, true);
              }, 10);
            },
            keydownCallback: function(e) {
              if (e.keyCode === 8) {
                if (this.$element.find("p").length === 1 && this.$element.find(".empty").length === 1 && $("#viewDoc").find(".section:not(.noRedactor)").length === 1) {
                  return false;
                }
              }
            },
            keyupCallback: function(e) {
              var aselect;
              Redactor.prototype.lastSection = $(this.selection.getBlock());
              if (e.keyCode === 13) {
                this.selection.restore();
                aselect = $(this.selection.getBlock()).parent();
                if ($(this.selection.getBlock()).text() === "") {
                  aselect.toggleClass("empty", true);
                  $(this.selection.getBlock()).html("<br/>");
                }
                this.code.sync();
                this.observe.load();
              }
            },
            focusCallback: function(e) {
              Redactor.prototype.lastFocus = _docum.find("#viewDoc").find(".section").index(this.$element.parent().parent());
              Redactor.prototype.showPlusButton(this, true);
              this.$element.addClass("focus");
              _elements.not(this.$element).parent().find('.redactor-toolbar').stop().fadeOut(400);
              this.$element.parents(".section").find(".media-toolbar .btn-toggle").removeClass("open");
            }
          });
        }
      };

      Redactor.prototype.showPlusButton = function(_redactor, focus) {
        var block;
        if (_redactor == null) {
          _redactor = Redactor.prototype.redactor;
        }
        if (focus == null) {
          focus = false;
        }
        if ((_redactor != null) && (_redactor.selection != null)) {
          block = $(_redactor.selection.getCurrent())[0] != null ? $(_redactor.selection.getCurrent()) : $(_redactor.selection.getBlock());
          _docum.find("#viewDoc").find(".media-toolbar").toggleClass("active", false);
          _docum.find("#viewDoc").find(".empty").toggleClass("empty", false);
          if (Redactor.prototype.isEmpty(block, true)) {
            if (block[0].tagName == null) {
              block = block.parent();
            }
            if (block[0].tagName.toLowerCase() !== "p") {
              block = block.parent();
            }
            $("#media-toolbar").toggleClass("active", true).css("top", (block.offset().top - 107) + "px").find(".btn-toggle").removeClass("open");
            block.toggleClass("empty", true);
          }
        }
      };

      Redactor.prototype.listenEvent = function(element) {
        $("#link_value").off('keyup').on('keyup', function(event) {
          $("#" + Redactor.prototype.lastLinkActive).attr("href", $(this).val());
          Redactor.prototype.redactor.code.sync();
          Redactor.prototype.redactor.observe.load();
          Redactor.prototype.listenEvent(element);
        });
        element.off('mousedown mouseup keyup').on('mousedown mouseup keyup', function(event) {
          var elem, offset, selection, toolbar;
          if (event.type === 'mousedown') {
            Redactor.prototype.position.start.y = event.pageY;
            Redactor.prototype.position.start.x = event.pageX;
          } else {
            Redactor.prototype.position.end.y = event.pageY;
            Redactor.prototype.position.end.x = event.pageX;
            Redactor.prototype.showPlusButton(null, true);
            Redactor.prototype.lastSection = $(this);
            $("#link-toolbar").removeClass("active").find("#link_value").val("");
            elem = $(event.target);
            $("#viewDoc").find("a").each(function() {
              $(this).removeClass("selected");
              if (!$(this).attr("href").trim().length) {
                $(this).replaceWith($(this).text());
              }
            });
            if (elem[0].tagName.toLowerCase() === "a") {
              offset = elem.offset();
              Redactor.prototype.lastLinkActive = elem.attr("id");
              $("#link_value").val(elem.attr("href"));
              elem.addClass("selected");
              offset.top = parseInt(offset.top) - 57;
              offset.left = parseInt(offset.left) - 120 + elem.width() / 2;
              Redactor.prototype.linkShow(offset);
            }
            selection = window.getSelection == null ? window.getSelection() : document.getSelection();
            if (selection.type === 'Range') {
              toolbar = $(this).prev();
              Redactor.prototype.toolbar = toolbar;
              Redactor.prototype.toolbarPosition(toolbar);
            } else {
              element.parent().find('.redactor-toolbar').hide();
            }
          }
        });
      };

      Redactor.prototype.findLink = function(_redactor) {
        var _ref, offset, parent;
        parent = (_ref = _redactor.selection.getParent()) ? $(_ref) : false;
        $("#link-toolbar").removeClass("active");
        if (parent && parent[0].tagName.toLowerCase() === "a") {
          Redactor.prototype.lastLinkActive = parent.attr("id");
          offset = _docum.find(".redactor-toolbar").offset();
          Redactor.prototype.linkShow(offset);
        } else {
          if (!Redactor.prototype.editLinkActive) {
            $("#link-toolbar").removeClass("active");
          }
        }
      };

      Redactor.prototype.linkShow = function(offset) {
        if (offset.left && offset.top) {
          Redactor.prototype.editLinkActive = true;
          $("#link-toolbar").addClass("active").css({
            "left": parseInt(offset.left) - parseInt($("#viewDoc").offset().left) + "px",
            "top": parseInt(offset.top) - parseInt($("#viewDoc").offset().top) + "px"
          });
        }
      };

      Redactor.prototype.removeRedactor = function(element) {
        Redactor.prototype.elements = Redactor.prototype.document.find(Redactor.prototype.nameElement);
        if ((element != null) && Redactor.prototype.elements.length > 1 && element.hasClass("redactor-editor")) {
          element.redactor('core.destroy');
          element.parents(".section").remove();
        }
      };

      Redactor.prototype.save = function(codeSave) {
        var cnt;
        if (codeSave == null) {
          codeSave = true;
        }
        if (codeSave) {
          Redactor.prototype.codeSave();
        }
        Redactor.prototype.elements = Redactor.prototype.document.find(Redactor.prototype.nameElement);
        Redactor.prototype.elements.each(function() {
          if ($(this).hasClass("redactor-editor") && !$(this).hasClass("noRedactor")) {
            if ($.trim($(this).redactor('code.get')) === "") {
              Redactor.prototype.removeRedactor($(this));
            } else {
              $(this).redactor("core.destroy");
            }
          }
        });
        app.Menu.treeGenerate();
        cnt = $("#viewDoc").find("p").length;
        $($("#viewDoc").find("p").get().reverse()).each(function() {
          if (!$(this).text().trim().length && cnt > 1) {
            $(this).remove();
            cnt--;
          }
        });
      };

      Redactor.prototype.codeSave = function() {
        $.each(Redactor.prototype.CodeMirror, function(val) {
          Redactor.prototype.CodeMirror[val].setOption("readOnly", true);
        });
      };

      Redactor.prototype.changeTypeListen = function() {
        _docum.find(".language-list").find(".language").off("click").on("click", function() {
          $(this).parents(".language-list").find(".language").removeClass("active");
          $(this).addClass("active");
          Redactor.prototype.changeTypeCode($(this).parent().data().id, $(this).data().type);
        });
      };

      Redactor.prototype.changeTypeCode = function(id, type) {
        Redactor.prototype.CodeMirror[id].setOption("mode", type.toLowerCase());
        _docum.find("#" + id).attr("data-mode", type.toLowerCase());
      };

      Redactor.prototype.isEmpty = function(_redactor, element) {
        var block, html, lnght, text;
        if (element == null) {
          element = false;
        }
        if (element) {
          block = html = _redactor;
        } else {
          block = $(_redactor.selection.getCurrent())[0] != null ? $(_redactor.selection.getCurrent()) : $(_redactor.selection.getBlock());
          html = $(_redactor.selection.getBlock()).html();
        }
        text = block.text();
        if (typeof html === "object" && (html.html() != null)) {
          html = html.html().replace(/[\u200B]/g, '').trim();
        }
        lnght = text.length;
        return (!lnght || (html[0] == null) || (lnght && !html[0].length)) && block.length;
      };

      Redactor.prototype.toolbarPosition = function(toolbar) {
        var left, readTop, top;
        if (toolbar == null) {
          toolbar = Redactor.prototype.toolbar;
        }
        readTop = Redactor.prototype.position.start.y < Redactor.prototype.position.end.y ? 'start' : 'end';
        if (toolbar.next().length) {
          top = Redactor.prototype.position[readTop].y - (toolbar.next().offset().top) - toolbar.height() * 1.7 + 'px';
          left = Math.abs(Redactor.prototype.position.start.x + Redactor.prototype.position.end.x) / 2 - (toolbar.next().offset().left) - (toolbar.outerWidth() / 2) + 'px';
          if ((parseInt(left) + toolbar.width() + parseInt($("#viewDoc").offset().left) + 90) >= $(window).width()) {
            left = $(window).width() - toolbar.width() - toolbar.next().offset().left - 90 + "px";
          }
          if (toolbar.is(':visible') && (toolbar.next().offset() != null)) {
            toolbar.stop().animate({
              top: top,
              left: left,
              opacity: 1
            }, 150);
          } else {
            if (toolbar.next().offset() != null) {
              toolbar.stop().fadeIn(400).css({
                top: top,
                left: left
              }).find(".redactor-act").removeClass("redactor-act");
            }
          }
          toolbar.find(".redactor-act").removeClass("redactor-act");
          $("#link-toolbar").removeClass("active");
          if (Redactor.prototype.redactor.selection.getHtml().indexOf("<sup") !== -1 || ((Redactor.prototype.redactor.selection.getParent().tagName != null) && Redactor.prototype.redactor.selection.getParent().tagName.toLowerCase() === "sup")) {
            toolbar.find(".re-header1").addClass("redactor-act");
          }
          if (Redactor.prototype.redactor.selection.getHtml().indexOf("<sub") !== -1 || ((Redactor.prototype.redactor.selection.getParent().tagName != null) && Redactor.prototype.redactor.selection.getParent().tagName.toLowerCase()) === "sub") {
            toolbar.find(".re-header2").addClass("redactor-act");
          }
          if (Redactor.prototype.redactor.selection.getHtml().indexOf("<a") !== -1 || ((Redactor.prototype.redactor.selection.getParent().tagName != null) && Redactor.prototype.redactor.selection.getParent().tagName.toLowerCase()) === "a") {
            toolbar.find(".re-link").addClass("redactor-act");
          }
          if (Redactor.prototype.redactor.selection.getHtml().indexOf("<strong") !== -1 || ((Redactor.prototype.redactor.selection.getParent().tagName != null) && Redactor.prototype.redactor.selection.getParent().tagName.toLowerCase()) === "strong") {
            toolbar.find(".re-bold").addClass("redactor-act");
          }
          if (Redactor.prototype.redactor.selection.getHtml().indexOf("<em") !== -1 || ((Redactor.prototype.redactor.selection.getParent().tagName != null) && Redactor.prototype.redactor.selection.getParent().tagName.toLowerCase()) === "em") {
            toolbar.find(".re-italic").addClass("redactor-act");
          }
          if (Redactor.prototype.redactor.selection.getHtml().indexOf("<del") !== -1 || ((Redactor.prototype.redactor.selection.getParent().tagName != null) && Redactor.prototype.redactor.selection.getParent().tagName.toLowerCase()) === "del") {
            toolbar.find(".re-deleted").addClass("redactor-act");
          }
          if (Redactor.prototype.redactor.selection.getHtml().indexOf("<blockquote") !== -1 || ((Redactor.prototype.redactor.selection.getParent().tagName != null) && Redactor.prototype.redactor.selection.getParent().tagName.toLowerCase() === "blockquote")) {
            toolbar.find(".re-blockquote").addClass("redactor-act");
          }
          if (Redactor.prototype.redactor.selection.getHtml().indexOf("<center") !== -1 || ((Redactor.prototype.redactor.selection.getParent().tagName != null) && Redactor.prototype.redactor.selection.getParent().tagName.toLowerCase()) === "center") {
            toolbar.find(".re-alignment").addClass("redactor-act");
          }
        }
      };

      Redactor;

      return Redactor;

    })();
    redactor = new Redactor(_docum, '.sub-section');
    codeSave = new CodeSave();
    app.Editor = redactor.init();
    app.codeSave = codeSave.init();
  });
});
