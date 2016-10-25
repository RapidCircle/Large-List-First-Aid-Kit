define(['jquery'], function($) {
    var self = this;
    this.requestDigest = null;

    var GetRequestDigest = function() {
        var dfd = $.Deferred();
        if (self.requestDigest && self.requestDigest.expiresOn > (new Date())) {
            return dfd.resolve();
        } else {
            $.ajax({
                type: "POST",
                url: _spPageContextInfo.siteAbsoluteUrl + "/_api/contextinfo",
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            }).done(function(resp) {
                var now = (new Date()).getTime();
                self.requestDigest = resp.d.GetContextWebInformation;
                self.requestDigest.expiresOn = now + (resp.d.GetContextWebInformation.FormDigestTimeoutSeconds * 1000) - 60000; // -60000 To prevent any calls to fail at all, by refreshing a minute before
                console.log("Token", self.requestDigest.FormDigestValue);
                dfd.resolve();
            }).fail(function(err) {
                console.log("Error fetching Request Digest. Some parts won't work.");
                dfd.reject();
            });
        }

        return dfd.promise();
    };

    function CheckPermissions(permissions_array) {
        var dfd = jQuery.Deferred();
        var ctx = new SP.ClientContext.get_current();
        var web = ctx.get_web();
        var ob = new SP.BasePermissions();
        for (var i = 0; i < permissions_array.length; i++) {
            //ob.set(SP.PermissionKind.manageWeb)
            ob.set(permissions_array[i]);
        }
        var per = web.doesUserHavePermissions(ob)
        ctx.executeQueryAsync(function() {
            var isAllowed = per.get_value();
            dfd.resolve(isAllowed)
        }, function(a, b) {
            dfd.reject(b.get_message());
        });
        return dfd.promise();
    }

    return {CheckPermissions: CheckPermissions}
})
