_local = @
define [
  'jquery'
  'taggd'
  'Application/editor'
], ($, taggd) ->
  _docum = $(document)
  _docum.ready ->

    class ImageTolltip
      constructor: (document, nameElement) ->
        ImageTolltip::tag = _docum.find('.taggd')
        ImageTolltip::data = _local.dataImages
        ImageTolltip::option =
          align: y: 'bottom'
          offset: top: -35
          handlers:
            mouseenter: 'show',
            mouseleave: 'hide',
            click: 'toggle'

      ImageTolltip::init = ->
        if ImageTolltip::tag.length
          ImageTolltip::tag.each ->
            $(@).taggd $.extend(true, ImageTolltip::option,{edit:false}), ImageTolltip::data[$(@).attr("id")] if ImageTolltip::data[$(@).attr("id")]?
            return
        @

      ImageTolltip::add = (elem)->
        ImageTolltip::tag = _docum.find('.taggd')
        if elem.length
          ImageTolltip::data[elem.attr("id")] = []
          elem.taggd $.extend(true, ImageTolltip::option,{edit:true}), ImageTolltip::data[elem.attr("id")]
        return

      ImageTolltip::edit = ->
        ImageTolltip::destroy()
        ImageTolltip::tag.each ->
          ImageTolltip::data[$(@).attr("id")] = if ImageTolltip::data[$(@).attr("id")]? then ImageTolltip::data[$(@).attr("id")] else []
          _t = $(@).taggd $.extend(true, ImageTolltip::option,{edit:true}), ImageTolltip::data[$(@).attr("id")] if ImageTolltip::data[$(@).attr("id")]?
          _t.on 'change', ->
            ImageTolltip::data[$(@).attr("id")] = _t.data
            return
          return
        return

      ImageTolltip::save = ->
        ImageTolltip::destroy()
        ImageTolltip::init()
        return

      ImageTolltip::destroy = ->
        if ImageTolltip::tag?
          ImageTolltip::tag.each ->
            if $(@).wrapper?
              img = $(@).wrapper.find("img")
            else
              img = $(@)
            img.parents(".sub-section").html(img)
            ImageTolltip::tag = _docum.find('.taggd')
            return
        return



    image = new ImageTolltip()
    app.Image = image.init()
    return