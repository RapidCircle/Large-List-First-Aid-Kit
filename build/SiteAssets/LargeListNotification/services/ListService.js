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
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/contextinfo",
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            }).done(function(resp) {
                var now = (new Date()).getTime();
                self.requestDigest = resp.d.GetContextWebInformation;
                self.requestDigest.expiresOn = now + (resp.d.GetContextWebInformation.FormDigestTimeoutSeconds * 1000) - 60000; // -60000 To prevent any calls to fail at all, by refreshing a minute before
                dfd.resolve();
            }).fail(function(err) {
                console.log("Error fetching Request Digest. Some parts won't work.");
                dfd.reject();
            });
        }
        return dfd.promise();
    };
    function GetView(options) {
        var deferred = jQuery.Deferred();
        jQuery.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists('" + options.ListId + "')/views?" + options.OData,
            type: 'GET',
            headers: {
                "accept": "application/json;odata=verbose"
            }
        }).done(function(data) {
            deferred.resolve(data);
        }).fail(function(err) {
            deferred.reject(err);
        })
        return deferred.promise();
    }

    function AddView(options) {
        var deferred = jQuery.Deferred();
        GetRequestDigest().then(function() {
            jQuery.ajax({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists('" + options.ListId + "')/views",
                method: "POST",
                data: options.bodyContent,
                headers: {
                    "accept": "application/json;odata=verbose",
                    "content-type": "application/json;odata=verbose",
                    "X-RequestDigest": self.requestDigest.FormDigestValue
                }
            }).done(function(data) {
                deferred.resolve(data);
            }).fail(function(err) {
                deferred.reject(err);
            })
        })

        return deferred.promise();
    }

    function GetIndexedColumns(options) {
        var deferred = jQuery.Deferred();
        jQuery.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists('" + options.ListId + "')/fields?$filter=Indexed eq true&" + options.OData,
            type: 'GET',
            headers: {
                "accept": "application/json;odata=verbose"
            }
        }).done(function(data) {
            deferred.resolve(data);
        }).fail(function(err) {
            deferred.reject(err);
        })
        return deferred.promise();
    }

    function GetList(options) {
        var deferred = jQuery.Deferred();
        jQuery.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists('" + options.ListId + "')?" + options.OData,
            type: 'GET',
            headers: {
                "accept": "application/json;odata=verbose"
            }
        }).done(function(data) {
            deferred.resolve(data);
        }).fail(function(err) {
            deferred.reject(err);
        })
        return deferred.promise();
    }

    return {GetView: GetView, GetIndexedColumns: GetIndexedColumns, GetList: GetList, AddView: AddView}
})
