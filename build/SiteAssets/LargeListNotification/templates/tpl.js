define(['jaml'], function(Jaml) {
    var Templates = {};
    Templates.SearchPage = function() {
        //register the template
        Jaml.register('simple', function() {
          div({cls:"row col-xs-12"},
            div({cls:"panel panel-default"},
              div({cls:"panel-heading"}, h5("Try searching for something...")),
              div({cls:"panel-body text-center"},
                input({type: "text", name: "search_box", id: "search_box"}),
                input({type: "button", value: "Search", "data-bind": "click: SearchTable"})
              )
            ),
            div({id: "results_table_container"},
              div({cls: "panel panel-default"},
                div({cls: "panel-heading"},
                  div({cls: "row"},
                    div({cls: "col-xs-6"},
                      h3({cls: "panel-title", "data-bind": "text: table_heading"})
                    ),
                    div({cls: "col-xs-6 text-right"},
                      input({cls: "search", placeholder: "Search"})
                    )
                  )
                ),
                div({cls:"panel-body"},
                  div({"data-bind":"visible: table_data().length <= 0", cls:"text-center", style:"color: #ccc"}, "No data to display. Try searching for something"),
                  table({cls:"table table-striped table-bordered table-list", "data-bind":"visible: table_data().length > 0" },
                    thead(
                      tr({"data-bind":"foreach: table_data_headers"},
                        td({"data-bind": "text: $data"})
                      )
                    ),
                    tbody({cls: "list"})
                  )
                ),
                div({cls:"panel-footer"},
                  div({cls:"row"},
                    div({cls:"col col-xs-4"},
                      span({"data-bind": "text: current_page"})
                    ),
                    div({cls:"col col-xs-8 text-right"},
                      ul({cls:"pagination"})
                    )
                  )
                )
              )
            )
          )
        })
        //return the DOM
        var div = document.createElement('div');
        div.innerHTML = Jaml.render('simple');
        return div;
    };

    return Templates;
})
