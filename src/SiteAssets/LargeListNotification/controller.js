define([
    'Services/SPWebService', 'Services/ListService',
], function(SPWebService, ListService) {
    //private abstracted function.
    function CreateViewHelper(options) {
        ListService.GetView({
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

            ListService.GetView({ListId: _spPageContextInfo.pageListId, OData: "$filter=DefaultView eq true&$expand=ViewFields"}).done(function(data) {
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

                ListService.AddView({ListId: _spPageContextInfo.pageListId, bodyContent: JSON.stringify(bodyContent)}).done(function(data) {
                    ListService.GetView({
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

    function CreateView(requested_view_type) {
        ListService.CheckPermissions([SP.PermissionKind.manageLists]).done(function(hasPermission) {
            //Create default view
            if (hasPermission) {
                var view_configuration = null;
                for (var i = 0; i < Config.length; i++) {
                    if (Config[i].type == requested_view_type) {
                        view_configuration = Config[i];
                        break;
                    }
                }
                ListService.GetList({ListId: _spPageContextInfo.pageListId, OData: "$select=BaseType"}).done(function(data) {
                    if (data.d.BaseType == Constants.SPBaseType.DocumentLibrary) {
                        CreateViewHelper({Type: 0, PersonalView: false, view_configuration: view_configuration, isLibrary: true})
                    } else {
                        CreateViewHelper({Type: 0, PersonalView: false, view_configuration: view_configuration, isLibrary: false})
                    }
                }).fail(function(err) {
                    console.error(err)
                });
            } else {
                SPWebService.CheckPermissions([SP.PermissionKind.managePersonalViews]).done(function(hasPersonaViewPermission) {
                    if (hasPersonaViewPermission) {
                        var view_configuration = null;
                        for (var i = 0; i < Config.length; i++) {
                            if (Config[i].type == requested_view_type) {
                                view_configuration = Config[i];
                                break;
                            }
                        }

                        ListService.GetList({ListId: _spPageContextInfo.pageListId, OData: "$select=BaseType"}).done(function(data) {
                            if (data.d.BaseType == Constants.SPBaseType.DocumentLibrary) {
                                CreateViewHelper({Type: 1, PersonalView: true, view_configuration: view_configuration, isLibrary: true})
                            } else {
                                CreateViewHelper({Type: 1, PersonalView: true, view_configuration: view_configuration, isLibrary: true})
                            }
                        }).fail(function(err) {
                            console.error(err)
                        });
                    } else {
                        alert(Messages.ErrorInsufficientPermission);
                    }
                }).fail(function(err) {
                    console.error("Error retrieing permissions for user")
                    console.error(err);
                });
            }
        }).fail(function(err) {
            console.error("Error retrieing permissions for user")
            console.error(err);
        })
    }

    function RedirectToModifyView() {
        var currentPageUrl = _spPageContextInfo.serverRequestPath;
        var path_array = currentPageUrl.split('/');
        var view_aspx = path_array[path_array.length - 1];

        var context = SP.ClientContext.get_current();
        var pagesListViews = context.get_web().get_lists().getById(_spPageContextInfo.pageListId).get_views();
        context.load(pagesListViews, 'Include(Id,ServerRelativeUrl)');
        context.executeQueryAsync(function(sender, args) {
            var viewEnumerator = pagesListViews.getEnumerator();
            while (viewEnumerator.moveNext()) {
                var view = viewEnumerator.get_current();
                var url = view.get_serverRelativeUrl();
                // If url.contains(viewUrl)
                if (url == _spPageContextInfo.serverRequestPath) {
                    var view_id = view.get_id();
                    var viewEditUrl = _spPageContextInfo.webAbsoluteUrl + "/" + _spPageContextInfo.layoutsUrl + "/ViewEdit.aspx?List=" + _spPageContextInfo.pageListId + "&View={" + view_id + "}"
                    window.location.href = viewEditUrl;
                    break;
                }
            }
        }, function(sender, args) {
            console.error(args.get_message());
        });
    }

    return {CreateView: CreateView, RedirectToModifyView: RedirectToModifyView}
})
