/*!
 * Author: Tanmay Darmaraj
 * Last Modified Date: 2016-10-20
 * Revision: 1
 * Description: Large List  */

"use strict";
define([
    'jquery',
    'CustomParts/LargeListFirstAidKit/Services/ListService',
    'CustomParts/LargeListFirstAidKit/Constants',
    'CustomParts/LargeListFirstAidKit/Controller',
    'CustomParts/LargeListFirstAidKit/Search',
    'CustomParts/LargeListFirstAidKit/templates/tpl',
    'css!CustomParts/LargeListFirstAidKit/styles/main.css',
    'css!CustomParts/LargeListFirstAidKit/styles/bootstrap.css',
], function(jQuery, ListService, Constants, NotificationController, SearchController, Templates) {

    //expose the controller. The anchor tag contains click events that call the controller.
    var RC = RC || {};
    RC.NotificationController = NotificationController;
    // RC.SearchController = SearchController;
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
            ListService.GetList({
                ListId: _spPageContextInfo.pageListId,
                OData: "$select=BaseType"
            }).done(function(data) {
                if (data.d.BaseType == Constants.SPBaseType.DocumentLibrary) {
                    var statusID = SP.UI.Status.addStatus("Warning:", Constants.Messages.NotificationMessageForLibrary /*+ " " + Constants.Messages.SearchPage*/ );
                    SP.UI.Status.setStatusPriColor(statusID, 'yellow');
                } else {
                    var statusID = SP.UI.Status.addStatus("Warning:", Constants.Messages.NotificationMessageForList /*+ " " + Constants.Messages.SearchPage*/ );
                    SP.UI.Status.setStatusPriColor(statusID, 'yellow');
                }
            }).fail(function(err) {
                console.error(err);
            })

            //Create the search UI
            var deltaplaceholdermain = jQuery.find("#DeltaPlaceHolderMain")
            jQuery(deltaplaceholdermain).append(Templates.SearchPage());
            SearchController.Initialize();
        }
    }, 'sp.js');
});
