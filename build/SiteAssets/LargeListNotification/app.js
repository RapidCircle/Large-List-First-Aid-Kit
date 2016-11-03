/*!
 * Author: Tanmay Darmaraj
 * Last Modified Date: 2016-10-20
 * Revision: 1
 * Description: Large List  */

"use strict";
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '/sites/dmc/siteassets/largelistnotification',
    paths: {
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min',
        // datatables : "https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min",
        ko: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min",
        listjs: "https://cdnjs.cloudflare.com/ajax/libs/list.js/1.3.0/list.min",
        listjsPagination: "https://cdnjs.cloudflare.com/ajax/libs/list.pagination.js/0.1.1/list.pagination.min"
    }
});

define([
    'jquery',
    'services/ListService',
    'Constants',
    'Controller',
    'Search',
    'templates/tpl'
], function(jQuery, ListService, Constants, NotificationController, SearchController, Templates) {

    //expose the controller. The anchor tag contains click events that call the controller.
    var RC = RC || {};
    RC.NotificationController = NotificationController;
    // RC.SearchController = SearchController;
    window.RC = RC;

    //Show the notification message on the page.
    ExecuteOrDelayUntilScriptLoaded(function() {

        //Injecting css. yuck!
        var injected_css = [
          "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
          require.toUrl("styles/main.css") //Wow! :P
        ]
        for (var i = 0; i < injected_css.length; i++) {
          var link = document.createElement("link");
          link.type = "text/css";
          link.rel = "stylesheet";
          link.href = injected_css[i];
          document.getElementsByTagName("head")[0].appendChild(link);

        }

        SP.UI.Status.removeAllStatus(true);
        //Improve this if you are handling multiple locales
        var large_list_string = Constants.ThresholdMessage[0].error;
        var inners = jQuery.map(jQuery.find("div[webpartid]"), function(item) {
            return item.innerHTML;
        });
        var items = inners.filter(function(item, index) {
            return item.indexOf(large_list_string) >= 0;
        });
        if (items.length > 0) {
            ListService.GetList({ListId: _spPageContextInfo.pageListId, OData: "$select=BaseType"}).done(function(data) {
                if (data.d.BaseType == Constants.SPBaseType.DocumentLibrary) {
                    var statusID = SP.UI.Status.addStatus("Warning:", Constants.Messages.NotificationMessageForLibrary/*+ " " + Constants.Messages.SearchPage*/);
                    SP.UI.Status.setStatusPriColor(statusID, 'yellow');
                } else {
                    var statusID = SP.UI.Status.addStatus("Warning:", Constants.Messages.NotificationMessageForList/*+ " " + Constants.Messages.SearchPage*/);
                    SP.UI.Status.setStatusPriColor(statusID, 'yellow');
                }
            }).fail(function(err) {
                console.error(err);
            })

            //Create the search UI
            var deltaplaceholdermain = jQuery.find("#DeltaPlaceHolderMain")
            $(deltaplaceholdermain).append(Templates.SearchPage());
            SearchController.Initialize();
        }
    }, 'sp.js');
});
