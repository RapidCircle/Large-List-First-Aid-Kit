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
        jquery: 'https://code.jquery.com/jquery-2.2.4.min'
    }
});

define([
    'jquery', 'services/ListService', 'Constants', 'Controller'
], function(jQuery, ListService, Constants, Controller) {

    //expose the controller. The anchor tag contains click events that call the controller.
    var RC = RC || {};
    RC.Controller = Controller;
    window.RC = RC;

    //Show the notification message on the page.
    ExecuteOrDelayUntilScriptLoaded(function() {
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
                    var statusID = SP.UI.Status.addStatus("Warning:", Constants.Messages.NotificationMessageForLibrary);
                    SP.UI.Status.setStatusPriColor(statusID, 'yellow');
                } else {
                    var statusID = SP.UI.Status.addStatus("Warning:", Constants.Messages.NotificationMessageForList);
                    SP.UI.Status.setStatusPriColor(statusID, 'yellow');
                }
            }).fail(function(err) {
              console.error(err);
            })
        }
    }, 'sp.js');
});
