define(['jquery'], function($) {
    var SearchService = {};
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
    SearchService.Query = function(query) {
        var dfd = $.Deferred();
        GetRequestDigest().then(function() {
            $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/search/postquery",
                type: "POST",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "content-type": "application/json;odata=verbose",
                    "X-RequestDigest": self.requestDigest.FormDigestValue
                },
                data: JSON.stringify(query)
            }).done(function(data) {
                dfd.resolve(data);
            }).fail(function(err) {
                dfd.reject(err);
            });
        }, function(err) {
            dfd.reject(err);
        });

        return dfd.promise();
    }
    SearchService.GetManagedProperties = function(options) {
        var dfd = $.Deferred();
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/search/query?querytext='contenttype:"+ options.ContentType+ "+ListId:" + options.ListId + "'",
            type: "get",
            headers: {
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose"
            }
        }).done(function(data) {
            if (data.d.query.PrimaryQueryResult.RelevantResults.RowCount > 0) {
                var oWorkId = null;
                var firstItem = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results["0"].Cells.results;
                for (var i = 0; i < firstItem.length; i++) {
                    if (firstItem[i].Key == "WorkId") {
                        oWorkId = firstItem[i];
                        break;
                    }
                }
                //Got workId now.
                //secret sauce to get all properties back (https://blogs.technet.microsoft.com/searchguys/2013/12/10/how-to-find-all-managed-properties-of-a-document/)
                $.ajax({
                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/search/query?querytext='" + oWorkId.Key + ":" + oWorkId.Value + "'&refiners='ManagedProperties(filter=600/0/*)'",
                    type: "get",
                    headers: {
                        "accept": "application/json;odata=verbose",
                        "content-type": "application/json;odata=verbose"
                    }
                }).done(function(data) {
                    if (data.d.query.PrimaryQueryResult == null || data.d.query.PrimaryQueryResult.RefinementResults == null) {
                        dfd.reject(new Error({
                            name: "RC Search Service Error",
                            message: "Error detected. Could not retrieve managed properties.",
                            htmlMessage: "The ManagedProperties property does not contain values. See https://github.com/wobba/SPO-Trigger-Reindex for more information on how to enable this feature.",
                            toString: function() {
                                return this.name + ": " + this.message + " " + this.htmlMessage;
                            }
                        }));
                    } else {
                        var refiners = data.d.query.PrimaryQueryResult.RefinementResults.Refiners.results["0"].Entries.results;

                        dfd.resolve(refiners);
                    }
                }).fail(function(err) {
                    dfd.reject(err);
                });
            }
        })
        return dfd.promise();
    }

    return SearchService
})
