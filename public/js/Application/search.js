define(['jquery', 'taggd', 'video', 'Application/editor'], function($, taggd) {
  var _docum;
  _docum = $(document);
  _docum.ready(function() {
    var Search, search;
    Search = (function() {
      function Search(document, nameElement) {}

      Search.prototype.init = function() {
        $("#search").off("submit").on("submit", function() {
          Search.prototype.search($("#searchInput").val());
          return false;
        });
        return this;
      };

      Search.prototype.search = function(text) {
        var ret, sel;
        if (window.find && window.getSelection) {
          sel = window.getSelection();
          if (sel.rangeCount > 0) {
            sel.collapseToEnd();
          }
          ret = window.find(text);
          if (!ret) {
            $("#searchInput").blur().focus();
          }
          ret;
        }
      };

      return Search;

    })();
    search = new Search;
    app.Search = search.init();
  });
});
