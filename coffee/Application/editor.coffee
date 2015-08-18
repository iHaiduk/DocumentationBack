###*
# Created by Igor on 02.08.2015.
###

define [
  'jquery'
  'codemirror'
  'redactor'
  'Application/menu'
  'Application/image'
  'Application/video'
  'Application/search'
  'codemirror/mode/htmlmixed/htmlmixed'
  'codemirror/mode/clike/clike'
  'codemirror/mode/coffeescript/coffeescript'
  'codemirror/mode/css/css'
  'codemirror/mode/javascript/javascript'
  'codemirror/mode/php/php'
  'codemirror/mode/sass/sass'
  'codemirror/mode/sql/sql'
], ($, CodeMirror) ->
  _docum = $(document)
  _docum.ready ->


    link_insert = 0
    $.Redactor::insertHead = ->
      {
      init: ->
# add a button to the toolbar that calls the showMyModal method when clicked
        button = @button.add('header1')
        @button.addCallback button, @insertHead.insertH1
        button2 = @button.add('header2')
        @button.addCallback button2, @insertHead.insertH2
        button5 = @button.add('blockquote')
        @button.addCallback button5, @insertHead.blockquote
        button6 = @button.add('clear')
        @button.addCallback button6, @insertHead.clear
        button3 = @button.add('alignment')
        @button.addCallback button3, @insertHead.center
        button4 = @button.add('link')
        @button.addCallback button4, @insertHead.link
        return
      insertH1: (key)->
        @selection.restore()
        _block = $(@selection.getBlock())
        _block = if _block[0].tagName.toLowerCase() != "p" then _block.parent() else _block
        _html = $(@selection.getBlock()).html()
        if _html.indexOf("<sup") is -1
          $(@selection.getBlock()).html("<sup>"+$(@selection.getBlock()).text()+"<sup>")
        else
          $(@selection.getBlock()).html($(@selection.getBlock()).text())
        @code.sync()
        @observe.load()
        _block.find("sup").each ->
          $(@).remove() if !$(@).text().trim().length
          return
        return
      insertH2: (key)->
        @selection.restore()
        _block = $(@selection.getBlock())
        _block = if _block[0].tagName.toLowerCase() != "p" then _block.parent() else _block
        _html = $(@selection.getBlock()).html()
        if _html.indexOf("<sub") is -1
          $(@selection.getBlock()).html("<sub>"+$(@selection.getBlock()).text()+"<sub>")
        else
          $(@selection.getBlock()).html($(@selection.getBlock()).text())
        @code.sync()
        @observe.load()
        _block.find("sub").each ->
          $(@).remove() if !$(@).text().trim().length
          return
        return
      center: ->
        @selection.restore();
        @inline.format('center')
        @code.sync()
        @observe.load()
        return
      link: ->
        @selection.restore();
        $("#viewDoc").find("a").removeClass("selected")
        Redactor::lastLinkActive = "link_insert_"+(new Date).getTime();
        if @selection.getHtml().indexOf("<a id") isnt -1
          @insert.html(@selection.getText(), false)
        else
          @insert.html('<a id="'+Redactor::lastLinkActive+'" href="" class="selected">'+@selection.getText()+'</a>', false)
        @code.sync()
        @observe.load()
        Redactor::findLink(Redactor::redactor)
        $("#link_value").focus()
        return
      blockquote: ->
        @selection.restore()
        @inline.format('blockquote')
        @inline.format('sup') if @.selection.getParent() and $(@.selection.getParent())[0].tagName.toLowerCase() =='sup'
        @inline.format('sub') if @.selection.getParent() and $(@.selection.getParent())[0].tagName.toLowerCase() =='sub'
        @code.sync()
        @observe.load()
        return
      clear: ->
        @selection.restore();
        $(@selection.getBlock()).html($(@selection.getBlock()).text())
        @insert.html(@selection.getText(), false)
        @code.sync()
        @observe.load()
        return
      save: ->
        app.codeSave.clean()
        Redactor::document.find("#initRedactor").removeClass("btn-save").addClass "btn-edit"
        $("body").removeClass "editing"
        Redactor::save()
        app.Image.save()
        app.codeSave.send()
        return
      }

    class CodeSave
      constructor: (deafult = []) ->
        CodeSave::code = deafult

      CodeSave::init = ->
        @

      CodeSave::clean = ->
        CodeSave::code = []
        return

      CodeSave::add = ()->
        _docum.find(".section").each ->
          type = $(@).data().type
          sub = $(@).find(".sub-section")
          data = {}
          switch type
            when "image"
              if !sub.hasClass("deleted")
                code = sub.find(".image").attr("src")
                data =
                  id: sub.find(".image").attr("id")
                  data: $.map app.Image.data[sub.find(".image").attr("id")], (a)->
                    if $.trim(a.text).length
                      a
            when "video"
              code = sub.find(".videoView").data().youtubeId
            when "hr"
              code = Redactor::template.hr
            when "code"
              param_id = $(@).find(".code").attr("id").replace("#","")
              code = Redactor::CodeMirror[param_id].getValue()
              data =
                type: if Redactor::CodeMirror[param_id].getMode().name is "sql" then "text/x-mysql" else Redactor::CodeMirror[param_id].getMode().name
                id: param_id
            else
              type = "text"
              code = sub.html()
          if code?
            CodeSave::code.push(
              param: type
              code: code
              data: data
            )
            return
        return

      CodeSave::send = ->
        CodeSave::clean()
        CodeSave::add()
        $.ajax(
          url: "/save"
          type: "post"
          data: { code: JSON.stringify(CodeSave::code) }
          dataType: "json"
        )
        return

      CodeSave::cancel = (cb)->
        CodeSave::clean()
        $.ajax(
          url: "/cancel"
          type: "get"
          success: (data)->
            cb data
            return
        )
        return

    class Redactor
      constructor: (document, nameElement) ->
        Redactor::redactor = null
        Redactor::toolbar = null
        Redactor::document = document
        Redactor::nameElement = nameElement
        Redactor::elements = document.find(nameElement)
        Redactor::activeElement = null
        Redactor::CodeMirror = {}
        Redactor::lastFocus = null
        Redactor::lastSection = null
        Redactor::lastLinkActive = null
        Redactor::editLinkActive = false
        Redactor::lastSectionRemove = null
        Redactor::position =
          start:
            x: 0
            y: 0
          end:
            x: 0
            y: 0
        Redactor::template =
          empty: """<div class="section" data-type="text">
                            <div class="sub-section"></div>
                        </div>"""
          image: """<form id="form1" runat="server">
<label for='imgInp' id='uploadImage'></label>
    <input type='file' id="imgInp" />
</form>
    <img src="" class="image taggd" />"""
          code: """<textarea class='code' data-mode='htmlmixed'></textarea><ul class="language-list" >
          <li class="language active" data-type="htmlmixed">HTML</li>
          <li class="language" data-type="CSS">CSS</li>
          <li class="language" data-type="SASS">SASS</li>
          <li class="language" data-type="JavaScript">JavaScript</li>
          <li class="language" data-type="coffeescript">CoffeeScript</li>
          <li class="language" data-type="PHP">PHP</li>
          <li class="language" data-type="text/x-mysql">SQL</li>
</ul>"""
          video: """<input class='video' type='text' placeholder='Please insert youtube ID...' />"""
          hr: """<hr/>"""

      Redactor::init = ->

        Redactor::document.find("#initRedactor").off('click').on 'click', ->
          if $(@).hasClass("btn-edit")
            $(@).removeClass("btn-edit").addClass "btn-save"
            $("body").addClass "editing"
            Redactor::reset()
            Redactor::initialize()
            Redactor::showPlusButton()
            app.Image.edit()
          else
            $(@).removeClass("btn-save").addClass "btn-edit"
            $("body").removeClass "editing"
            Redactor::save()
            app.Image.save()
            _docum.find(".selected").removeClass("selected")
            app.codeSave.send()
          return

        Redactor::document.find("#cancelRedactor").off('click').on 'click', ->
          Redactor::document.find("#initRedactor").removeClass("btn-save").addClass "btn-edit"
          $("body").removeClass "editing"
          app.codeSave.cancel (html)->
            _docum.find("#viewDoc").html(html)
            _docum.find(".selected").removeClass("selected")
            Redactor::save()
            app.Image.save()
            _docum.find(".selected").removeClass("selected")
            Redactor::init();
            return
          return

        Redactor::document.find(".code").each ->

          Redactor::CodeMirror[$(@).attr("id")] = CodeMirror.fromTextArea @,
            mode: $(@).data().mode
            lineNumbers: true
            matchBrackets: true
            styleActiveLine: true
            htmlMode: true
            theme: "3024-day"
          return

        Redactor::addListen()
        Redactor::changeTypeListen()
        app.Video.activate(parent.find(".videoView"))
        app.Image.init()
        return

      Redactor::reset = ()->
        Redactor::elements.find(".code").removeClass().addClass("code").each ->
          $(@).text($(@).text())
          return
        return

      Redactor::addListen = ()->
        $("#link-toolbar").on "click", (e)->
          if !$(e.target).hasClass("close")
            Redactor::editLinkActive = true
            $(@).addClass "active"
          return

        $("#link_close").on "click", ()->
          $(@).parent().removeClass "active"
          Redactor::editLinkActive = false
          return

        $("#link_value").on "click, keydown, keyup", ->
          Redactor::editLinkActive = true
          $(@).parent().addClass "active"
          return

        Redactor::document.find('.btn-toggle').off('click').on 'click', ->
          $(@).toggleClass 'open'
          return

        Redactor::document.find('.icon-image').off('click').on 'click', ->
          Redactor::mediaButton "image", Redactor::template.image, (element)->
            $("#imgInp").parents(".noRedactor").addClass("deleted")
            $("#media-toolbar").removeClass("active")
            Redactor::preUploadImage(element)
            $("#uploadImage").click()
            return
          return

        Redactor::preUploadImage = (element) ->
          $("#imgInp").on "change", (e)->
            element = $(element[2])
            parent = element.parents(".noRedactor")
            file = e.target.files[0]
            imageType = /image.*/
            if !file.type.match(imageType)
              return
            reader = new FileReader
            reader.onload = (e)->
              parent.removeClass("deleted")
              $("#form1").remove()
              element.attr
                src: e.target.result
                id: "image_"+(new Date).getTime()
              app.Image.add(element)
              return
            reader.readAsDataURL file
            return
          return

        Redactor::getBase64Image = (imgElem)->
          canvas = document.createElement('canvas')
          canvas.width = imgElem.clientWidth
          canvas.height = imgElem.clientHeight
          ctx = canvas.getContext('2d')
          ctx.drawImage imgElem, 0, 0
          dataURL = canvas.toDataURL('image/png')
          dataURL.replace /^data:image\/(png|jpg);base64,/, ''

        Redactor::document.find('.icon-video').off('click').on 'click', ->
          Redactor::mediaButton "video", Redactor::template.video, (element)->
            element.focus().on "blur keyup", (e)->
              if (e.type is "blur" or (e.type is "keyup" and e.which is 13)) and $(@).val().length > 5
                parent = $(@).parent()
                parent.html """<div class="videoView" data-youtube-id='"""+$(@).val()+"""' data-ratio="16:9"></div>"""
                parent.after("""<span class="btn btn-toggle remove"></span>""")
                app.Video.activate(parent.find(".videoView"))
                Redactor::addListen()
                return
            return
          return

        Redactor::document.find('.icon-code').off('click').on 'click', ->
          Redactor::mediaButton "code", Redactor::template.code, (element)->
            param_id = "redactor_"+(new Date).getTime()
            $(element[0]).attr("id", param_id)
            $(element[1]).attr("data-id", param_id)
            Redactor::CodeMirror[param_id] = CodeMirror.fromTextArea element[0],
              mode: "htmlmixed"
              lineNumbers: true
              matchBrackets: true
              styleActiveLine: true
              htmlMode: true
              theme: "3024-day"
            Redactor::changeTypeListen()
            return
          return

        $("#media-toolbar").find('.icon-hr').off('click').on 'click', ->
          Redactor::mediaButton "hr", Redactor::template.hr
          return

        Redactor::document.find('.remove').off('click').on 'click', ->
          _this = $(@)
          _this.parent(".section").remove()
          Redactor::addListen()
          _this.remove()
          return
        return

      Redactor::mediaButton = (type, code, call)->
        frstSectionArray = []
        lastSectionArray = []
        parentSection = if Redactor::lastSection.hasClass("sub-section") then Redactor::lastSection else Redactor::lastSection.parents(".sub-section")
        pos = parentSection.find("p").index(parentSection.find(".empty"))

        parentSection.find("p").each ->
          if parentSection.find("p").index($(@)) >= 0
            if parentSection.find("p").index($(@)) < pos
              frstSectionArray.push($(@))
            if parentSection.find("p").index($(@)) > pos
              lastSectionArray.push($(@))
            return
        frstSectionArray = frstSectionArray.map (el) ->
          el.get()[0].outerHTML

        lastSectionArray = lastSectionArray.map (el) ->
          el.get()[0].outerHTML

        frstSectionArrayHTML = frstSectionArray.join("")
        lastSectionArrayHTML = lastSectionArray.join("")

        parentSection.redactor("code.set",frstSectionArrayHTML)
        element = $(code)
        noRedactorSection = $("<div class='section' data-type='"+type+"'><div class='sub-section noRedactor'></div><span class='btn btn-toggle remove'></span></div></div>")
        noRedactorSection.find(".sub-section").html(element)
        parentSection.find(".empty").remove()
        parentSection.parents(".section").after(noRedactorSection)
        parentSection.remove() if !$(frstSectionArrayHTML).text().trim().length
        lastSectionArrayHTML = "<p class='empty'></p>" if !$(lastSectionArrayHTML).text().trim().length
        Redactor::addSection(noRedactorSection, lastSectionArrayHTML)
        Redactor::addListen()

        $("#media-toolbar").find(".btn-toggle").removeClass("open")

        call(element, noRedactorSection) if call? and typeof call is "function"
        return

      Redactor::addSection = (block, code)->
        newBlock = $(Redactor::template.empty)
        block.after newBlock
        Redactor::elements = Redactor::document.find(Redactor::nameElement+":not(.noRedactor)")
        Redactor::lastSection = newBlock.find(".sub-section")
        Redactor::addRedactor newBlock.find(".sub-section:not(.noRedactor)"), false, code
        Redactor::addListen()
        return

      Redactor::initialize = () ->
        Redactor::loadRedactors()
        return

      Redactor::loadRedactors = ->
        Redactor::elements.not(".noRedactor").each ->
          Redactor::addRedactor $(@)
          return
        return

      Redactor::addRedactor = (element, focus = false, code) ->
        if element? and !element.hasClass("noRedactor")
          _elements = Redactor::elements
          element.redactor
            iframe: true
            cleanStyleOnEnter: false
            focus: focus
            tabAsSpaces: 4
            buttons: ['bold', 'italic', 'deleted']
            plugins: ['insertHead']
            shortcutsAdd:
              'ctrl+enter':
                func: 'insertHead.newRedactor'
              'ctrl+s':
                func: 'insertHead.save'
            initCallback: ->
              Redactor::redactor = @
              @code.set(code) if code?
              element.off 'click'
              Redactor::activeElement = element
              Redactor::listenEvent element
              Redactor::showPlusButton(@)
              @$element.find("p, br").each ->
                $(@).remove() if !$(@).text().trim().length
                return
              @$element.find("p").each ->
                if $(@).text().length and !$(@).html().replace(/\u200B/g, '').length
                  $(@).html("<br/>")
                  return
              @code.sync()
              @observe.load()
              return
            changeCallback: ()->
              @$element.find("p").each ->
                if $(@).text().length and !$(@).html().replace(/\u200B/g, '').length
                  $(@).html("<br/>")
                  return
              Redactor::showPlusButton(@, true)
              _elements.parent().find('.redactor-toolbar').stop().fadeOut 400 if @sel.type isnt "Range"
              $("#viewDoc").find(".section-wrap > span").remove()
              return
            blurCallback: () ->
              @$element.removeClass("focus")
              _elements.parent().find('.redactor-toolbar').stop().fadeOut 400
              redactor = @
              setTimeout(->
                Redactor::showPlusButton(redactor, true)
                return
              , 10)
              return
            keydownCallback: (e) ->
              if (e.keyCode is 8) and $(@selection.getBlock()).hasClass("empty")
                $(@selection.getBlock()).remove()
                if !@$element.find("p:not(.empty)").length and ($("#viewDoc").find(".sub-section:not(.noRedactor)").length-1)
                  @$element.parents(".section").remove()
                  _docum.find("#media-toolbar").removeClass("active")
                  Redactor::lastSectionRemove = true
                  return false
                return
            keyupCallback: (e) ->
              if e.keyCode is 8 and Redactor::lastSectionRemove
                Redactor::lastSectionRemove = false
                return false

              Redactor::lastSection = $(@selection.getBlock())
              if (e.keyCode is 13)
                @selection.restore()
                aselect = $(@selection.getBlock()).parent()
                if $(@selection.getBlock()).text() is ""
                  aselect.toggleClass("empty", true)
                  $(@selection.getBlock()).html("<br/>")
                @code.sync()
                @observe.load()
              return
            focusCallback: (e)->
              Redactor::lastFocus = _docum.find("#viewDoc").find(".section").index(@$element.parent().parent())
              Redactor::showPlusButton(@, true)
              @$element.addClass("focus")
              _elements.not(@$element).parent().find('.redactor-toolbar').stop().fadeOut 400
              @$element.parents(".section").find(".media-toolbar .btn-toggle").removeClass("open")
              return

          return

      Redactor::showPlusButton = (_redactor = Redactor::redactor, focus = false)->
        if _redactor? and _redactor.selection?
          block = if $(_redactor.selection.getCurrent())[0]? then $(_redactor.selection.getCurrent()) else $(_redactor.selection.getBlock())
          _docum.find("#viewDoc").find(".media-toolbar").toggleClass("active", false)
          _docum.find("#viewDoc").find(".empty").toggleClass("empty", false)
          if Redactor::isEmpty(block, true)
            block = block.parent() unless block[0].tagName?
            block = block.parent() if block[0].tagName.toLowerCase() isnt "p"
            $("#media-toolbar").toggleClass("active", true).css("top", (block.offset().top-107)+"px").find(".btn-toggle").removeClass("open")
            block.toggleClass("empty", true)
        return

      Redactor::listenEvent = (element)->
        $("#link_value").off('keyup').on('keyup', (event) ->
          $("#"+Redactor::lastLinkActive).attr("href",$(@).val())
          Redactor::redactor.code.sync()
          Redactor::redactor.observe.load()
          Redactor::listenEvent(element)
          return
        )
        element.off('mousedown mouseup keyup').on('mousedown mouseup keyup', (event) ->
          if event.type == 'mousedown'
            Redactor::position.start.y = event.pageY
            Redactor::position.start.x = event.pageX
          else
            Redactor::position.end.y = event.pageY
            Redactor::position.end.x = event.pageX
            Redactor::showPlusButton(null, true)
            Redactor::lastSection = $(@)
            $("#link-toolbar").removeClass("active").find("#link_value").val("")
            elem = $(event.target)
            $("#viewDoc").find("a").each ->
              $(@).removeClass("selected")
              if !$(@).attr("href").trim().length
                $(@).replaceWith($(@).text())
              return
            if elem[0].tagName.toLowerCase() == "a"
              offset = elem.offset()
              Redactor::lastLinkActive = elem.attr("id")
              $("#link_value").val(elem.attr("href"))
              elem.addClass "selected"
              offset.top = parseInt(offset.top) - 57
              offset.left = parseInt(offset.left) - 120 + elem.width()/2
              Redactor::linkShow(offset)

            selection = if not window.getSelection? then window.getSelection() else document.getSelection()
            # TODO return selection http://stackoverflow.com/questions/1181700/set-cursor-position-on-contenteditable-div/3323835#3323835
            if selection.type is 'Range'
              toolbar = $(@).prev()
              Redactor::toolbar = toolbar
              Redactor::toolbarPosition(toolbar)
            else
              element.parent().find('.redactor-toolbar').hide()

          return
        )
        return

      Redactor::findLink = (_redactor)->
        parent = if (_ref =_redactor.selection.getParent()) then $(_ref) else false
        $("#link-toolbar").removeClass("active")
        if parent and parent[0].tagName.toLowerCase() is "a"
          Redactor::lastLinkActive = parent.attr("id")
          offset = _docum.find(".redactor-toolbar").offset();
          Redactor::linkShow(offset)
          return
        else
          $("#link-toolbar").removeClass("active") if !Redactor::editLinkActive
          return

      Redactor::linkShow = (offset)->
        if offset.left and offset.top
          Redactor::editLinkActive = true
          $("#link-toolbar").addClass("active").css(
            "left": parseInt(offset.left) - parseInt($("#viewDoc").offset().left) + "px"
            "top": parseInt(offset.top) - parseInt($("#viewDoc").offset().top) + "px"
          )
          return

      Redactor::removeRedactor = (element)->
        Redactor::elements = Redactor::document.find(Redactor::nameElement)
        if element? and Redactor::elements.length > 1 and element.hasClass("redactor-editor")
          element.redactor 'core.destroy'
          element.parents(".section").remove()
          return

      Redactor::save = (codeSave = true)->
        Redactor::codeSave() if codeSave
        Redactor::elements = Redactor::document.find(Redactor::nameElement)
        Redactor::elements.each ->
          if $(@).hasClass("redactor-editor") and !$(@).hasClass("noRedactor")
            if $.trim($(@).redactor('code.get')) is ""
              Redactor::removeRedactor $(@)
              return
            else
              $(@).redactor("core.destroy")
              return
        app.Menu.treeGenerate()
        cnt = $("#viewDoc").find("p").length
        $($("#viewDoc").find("p").get().reverse()).each ->
          if !$(@).text().trim().length and cnt > 1
            $(@).remove()
            cnt--
          return
        return

      Redactor::codeSave = ->
        $.each Redactor::CodeMirror, (val)->
          Redactor::CodeMirror[val].setOption("readOnly", true)
          return
        return

      Redactor::changeTypeListen = ->
        _docum.find(".language-list").find(".language").off("click").on "click", ->
          $(@).parents(".language-list").find(".language").removeClass("active")
          $(@).addClass("active")
          Redactor::changeTypeCode($(@).parent().data().id, $(@).data().type)
          return
        return

      Redactor::changeTypeCode = (id, type)->
        Redactor::CodeMirror[id].setOption("mode", type.toLowerCase())
        _docum.find("#"+id).attr("data-mode", type.toLowerCase())
        return

      Redactor::isEmpty = (_redactor, element = false)->
        if element
          block = html = _redactor
        else
          block = if $(_redactor.selection.getCurrent())[0]? then $(_redactor.selection.getCurrent()) else $(_redactor.selection.getBlock())
          html = $(_redactor.selection.getBlock()).html()

        text = block.text()
        html = html.html().replace(/[\u200B]/g, '').trim() if typeof html is "object" and html.html()?
        lnght = text.length

        ((!lnght or !html[0]? or (lnght and !(html[0].length))) and block.length)

      Redactor::toolbarPosition = (toolbar = Redactor::toolbar)->
        readTop = if Redactor::position.start.y < Redactor::position.end.y then 'start' else 'end'

        if toolbar.next().length
          top = Redactor::position[readTop].y - (toolbar.next().offset().top) - toolbar.height()*1.7+ 'px'
          left = Math.abs(Redactor::position.start.x + Redactor::position.end.x) / 2 - (toolbar.next().offset().left) - (toolbar.width() / 2) - 42 + 'px'

          if ((parseInt(left) + toolbar.width() + parseInt($("#viewDoc").offset().left) + 90) >= $(window).width() )
            left = $(window).width() - toolbar.width() - toolbar.next().offset().left - 90 + "px"

          if toolbar.is(':visible') and toolbar.next().offset()?
            toolbar.stop().animate {
              top
              left
              opacity: 1
            }, 150

          else
            if toolbar.next().offset()?
              toolbar.stop().fadeIn(400).css({
                top
                left
              }).find(".redactor-act").removeClass("redactor-act")


          toolbar.find(".redactor-act").removeClass("redactor-act")
          $("#link-toolbar").removeClass("active")

          toolbar.find(".re-header1").addClass("redactor-act") if Redactor::redactor.selection.getHtml().indexOf("<sup") isnt -1 or (Redactor::redactor.selection.getParent().tagName? and  Redactor::redactor.selection.getParent().tagName.toLowerCase() == "sup")
          toolbar.find(".re-header2").addClass("redactor-act") if Redactor::redactor.selection.getHtml().indexOf("<sub") isnt -1 or (Redactor::redactor.selection.getParent().tagName? and  Redactor::redactor.selection.getParent().tagName.toLowerCase()) == "sub"
          toolbar.find(".re-link").addClass("redactor-act") if Redactor::redactor.selection.getHtml().indexOf("<a") isnt -1 or (Redactor::redactor.selection.getParent().tagName? and  Redactor::redactor.selection.getParent().tagName.toLowerCase()) == "a"
          toolbar.find(".re-bold").addClass("redactor-act") if Redactor::redactor.selection.getHtml().indexOf("<strong") isnt -1 or (Redactor::redactor.selection.getParent().tagName? and  Redactor::redactor.selection.getParent().tagName.toLowerCase()) == "strong"
          toolbar.find(".re-italic").addClass("redactor-act") if Redactor::redactor.selection.getHtml().indexOf("<em") isnt -1 or (Redactor::redactor.selection.getParent().tagName? and  Redactor::redactor.selection.getParent().tagName.toLowerCase()) == "em"
          toolbar.find(".re-deleted").addClass("redactor-act") if Redactor::redactor.selection.getHtml().indexOf("<del") isnt -1 or (Redactor::redactor.selection.getParent().tagName? and  Redactor::redactor.selection.getParent().tagName.toLowerCase()) == "del"
          toolbar.find(".re-blockquote").addClass("redactor-act") if Redactor::redactor.selection.getHtml().indexOf("<blockquote") isnt -1 or (Redactor::redactor.selection.getParent().tagName? and Redactor::redactor.selection.getParent().tagName.toLowerCase() == "blockquote")
          toolbar.find(".re-alignment").addClass("redactor-act") if Redactor::redactor.selection.getHtml().indexOf("<center") isnt -1 or (Redactor::redactor.selection.getParent().tagName? and  Redactor::redactor.selection.getParent().tagName.toLowerCase()) == "center"
          return

      Redactor
    redactor = new Redactor(_docum, '.sub-section')
    codeSave = new CodeSave()
    app.Editor = redactor.init()
    app.codeSave = codeSave.init()

    return
  return