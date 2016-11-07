define([
    'Services/SearchService', 'Services/ListService', 'templates/tpl',
    'knockout',
    'jquery',
    'listjs',
    'listjsPagination'
], function(SearchService, ListService, Templates, ko, $, List, ListPagination) {
    var DataModel = function(data) {
        this.Title = data.Title;
    }
    var ViewModel = function() {
        var self = this;
        self.table_data = ko.observableArray([]);
        self.table_data_headers = ko.observableArray([]);

        self.table_heading = ko.observable("Results");
        self.current_page = ko.observable();

        self.SearchTable = function() {
            SearchService.GetManagedProperties({
                ContentType: "item",
                ListId: _spPageContextInfo.pageListId
            }).done(function(managed_properties) {
                ListService.GetView({
                    ListId: _spPageContextInfo.pageListId,
                    OData: "$filter=DefaultView eq true&$expand=ViewFields"
                }).done(function(data) {
                    var default_view_fields = data.d.results[0].ViewFields.Items.results;
                    var refiners = managed_properties.map(function(elem) {
                        return elem.RefinementName
                    });
                    //Get only some properties. Use refiners if you want to get everything.
                    var SelectProperties = default_view_fields.map(function(df) {
                        return refiners.find(function(el) {
                            return el.startsWith(df)
                        });
                    }).filter(function(el) {
                        return el != undefined;
                    });

                    var options = {
                        "request": {
                            "__metadata": {
                                "type": "Microsoft.Office.Server.Search.REST.SearchRequest"
                            },
                            "Querytext": document.getElementById('search_box').value,
                            "QueryTemplate": "{searchterms} ListId:" + _spPageContextInfo.pageListId.replace("{", "").replace("}", ""),
                            "TrimDuplicates": true,
                            "RowLimit": 50,
                            "SelectProperties": {
                                "results": SelectProperties
                            }
                        }
                    };
                    SearchService.Query(options).done(function(data) {
                        var dataSet = [];
                        for (var i = 0; i < data.d.postquery.PrimaryQueryResult.RelevantResults.Table.Rows.results.length; i++) {
                            var currentitem = data.d.postquery.PrimaryQueryResult.RelevantResults.Table.Rows.results[i].Cells.results;
                            var current_item_object_for_datatable = {}
                            for (var j = 0; j < currentitem.length; j++) {
                                current_item_object_for_datatable[currentitem[j].Key] = currentitem[j].Value ?
                                    currentitem[j].Value :
                                    "(no data)";
                            }
                            dataSet.push(current_item_object_for_datatable);
                        }

                        //Be good! don't push every single item into the observable array. We got to be performant :)
                        self.table_data([]);
                        self.table_data_headers([]);

                        self.table_data_headers.push.apply(self.table_data_headers, SelectProperties);
                        self.table_data.push.apply(self.table_data, dataSet);

                        var tbody_template = "<tr>";
                        for (var i = 0; i < self.table_data_headers().length; i++) {
                            tbody_template += "<td class='" + self.table_data_headers()[i] + "'></td>";
                        }
                        tbody_template += "</tr>";
                        var options = {
                            valueNames: self.table_data_headers(),
                            item: tbody_template,
                            page: 10,
                            plugins: [ListPagination({})]
                        };
                        var contactList = new List('results_table_container', options, self.table_data());
                    }).fail(function(err) {
                        console.log(err);
                    })
                }).fail(function(err) {
                    console.error(err)
                })
            }).fail(function(err) {
                console.error(err)
            })
        }
    };

    var SearchController = {};
    SearchController.Initialize = function() {
        ko.applyBindings(new ViewModel());

        //add a handler on a parent element that reponds to events from the children
        ko.bindingHandlers.delegatedHandler = {
            init: function(element, valueAccessor) {
                //array of events
                var events = ko.utils.unwrapObservable(valueAccessor()) || [];
                ko.utils.arrayForEach(events, function(event) {
                    ko.utils.registerEventHandler(element, event, createDelegatedHandler(event, element));
                });
            }
        };
    }
    return SearchController
})
