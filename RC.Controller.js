define([
    'RC.Helpers', 'RC.Services'
], function() {
    function CreateView(requested_view_type) {
        Helpers.CheckPermissions([SP.PermissionKind.manageLists]).done(function(hasPermission) {
            if (hasPermission) {
                Services.CreateDefaultView(requested_view_type);
            } else {
                Helpers.CheckPermissions([SP.PermissionKind.managePersonalViews]).done(function(hasPersonaViewPermission) {
                    if (hasPersonaViewPermission) {
                        Services.CreatePersonalView(requested_view_type);
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
