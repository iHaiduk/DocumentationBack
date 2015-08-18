define [
  'jquery'
  'taggd'
  'video'
  'Application/editor'
], ($, taggd) ->
  _docum = $(document)
  _docum.ready ->

    class Search
      constructor: (document, nameElement) ->


      Search::init = ->
        $("#search").off("submit").on "submit", ->
          Search::search $("#searchInput").val()
          false
        @

      Search::search = (text)->
        if window.find and window.getSelection
          sel = window.getSelection()
          if sel.rangeCount > 0
            sel.collapseToEnd()
          ret = window.find text
          if !ret
            $("#searchInput").blur().focus()
          ret
        return


    search = new Search
    app.Search = search.init()
    return
  return