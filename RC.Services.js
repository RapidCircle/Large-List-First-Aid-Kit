define([
    'RC.Config', 'RC.Messages', 'RC.Helpers', 'RC.Constants'
], function(Config, Messages, Helpers, Constants) {
    //TODO: function name is repeated. change to something more meaningful
    function _CreateView(options) {
        Helpers.GetView({
            ListId: _spPageContextInfo.pageListId,
            OData: "$select=ServerRelativeUrl,Id,PersonalView&$filter=Title eq '" + options.view_configuration.view_name + "'"
        }).done(function(data) {
            //We found a view with a same name. Cannot create the view automatically.
            if (data.d.results.length > 0) {
                //default view
                if (options.Type == 0) {
                    var url = data.d.results[0].ServerRelativeUrl;
                    window.location.href = window.location.protocol + "//" + window.location.host + url;
                    //Personal View
                    return;
                } else if (options.Type == 1) {
                    //We found a view with a same name. Cannot create the view automatically.
                    var url = data.d.results[0].ServerRelativeUrl;
                    window.location.href = window.location.protocol + "//" + window.location.host + url + "?PageView=Personal&ShowWebPart={" + data.d.results[0].Id + "}";
                    return;
                }
            }

            Helpers.GetView({ListId: _spPageContextInfo.pageListId, OData: "$filter=DefaultView eq true&$expand=ViewFields"}).done(function(data) {
                var default_view_fields = data.d.results[0].ViewFields.SchemaXml;
                var bodyContent = {};
                bodyContent.__metadata = {
                    type: 'SP.View'
                };
                bodyContent.Title = options.view_configuration.view_name;
                bodyContent.PersonalView = options.PersonalView;
                bodyContent.ViewData = default_view_fields;
                bodyContent.ViewQuery = options.view_configuration.query;

                if (options.isLibrary) {
                    bodyContent.Scope = Constants.ViewScope.DefaultValue;
                } else {
                    bodyContent.Scope = Constants.ViewScope.RecursiveAll;
                }

                Helpers.AddView({ListId: _spPageContextInfo.pageListId, bodyContent: JSON.stringify(bodyContent)}).done(function(data) {
                    Helpers.GetView({
                        ListId: _spPageContextInfo.pageListId,
                        OData: "$select=ServerRelativeUrl,Id&$filter=Title eq '" + options.view_configuration.view_name + "'"
                    }).done(function(data) {
                        if (options.Type == 0) {
                            var url = data.d.results[0].ServerRelativeUrl;
                            window.location.href = window.location.protocol + "//" + window.location.host + url;
                            //Personal View
                            return;
                        } else if (options.Type == 1) {
                            //We found a view with a same name. Cannot create the view automatically.
                            var url = data.d.results[0].ServerRelativeUrl;
                            window.location.href = window.location.protocol + "//" + window.location.host + url + "?PageView=Personal&ShowWebPart={" + data.d.results[0].Id + "}";
                            return;
                        }
                    }).fail(function(err) {
                        console.error(Messages.ErrorRetrievingValues);
                        console.error(err);
                    })
                }).fail(function(err) {
                    console.error(err);
                })
            }).fail(function(err) {
                console.error(err)
            })
        }).fail(function(err) {
            console.error(err)
        })
    }
    function CreateDefaultView(requested_view_type) {
        var view_configuration = null;
        for (var i = 0; i < Config.length; i++) {
            if (Config[i].type == requested_view_type) {
                view_configuration = Config[i];
                break;
            }
        }
        Helpers.GetList({ListId: _spPageContextInfo.pageListId, OData: "$select=BaseType"}).done(function(data) {
            if (data.d.BaseType == Constants.SPBaseType.DocumentLibrary) {
                _CreateView({Type: 0, PersonalView: false, view_configuration: view_configuration, isLibrary: true})
            } else {
                _CreateView({Type: 0, PersonalView: false, view_configuration: view_configuration, isLibrary: false})
            }
        }).fail(function(err) {
            console.error(err)
        });

    }

    function CreatePersonalView(requested_view_type) {
        var view_configuration = null;
        for (var i = 0; i < Config.length; i++) {
            if (Config[i].type == requested_view_type) {
                view_configuration = Config[i];
                break;
            }
        }

        Helpers.GetList({ListId: _spPageContextInfo.pageListId, OData: "$select=BaseType"}).done(function(data) {
            if (data.d.BaseType == Constants.SPBaseType.DocumentLibrary) {
                _CreateView({Type: 1, PersonalView: true, view_configuration: view_configuration, isLibrary: true})
            } else {
                _CreateView({Type: 1, PersonalView: true, view_configuration: view_configuration, isLibrary: true})
            }
        }).fail(function(err) {
            console.error(err)
        });

    }

    return {CreateDefaultView: CreateDefaultView, CreatePersonalView: CreatePersonalView}
})
