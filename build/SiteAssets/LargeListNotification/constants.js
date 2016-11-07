define(function() {
    var Constants = {};
    Constants.ThresholdMessage = [{
        locale: 1033,
        error: "This view cannot be displayed because it exceeds the list view threshold (5000 items) enforced by the administrator."
    }];
    Constants.SPBaseType = {
        UnspecifiedBaseType: -1,
        GenericList: 0,
        DocumentLibrary: 1,
        Unused: 2,
        DiscussionBoard: 0, //Deprecated
        Survey: 4,
        Issue: 5
    }
    Constants.ViewScope = {
        DefaultValue: 0,
        Recursive: 1,
        RecursiveAll: 2,
        FilesOnly: 3
    }
    Constants.Messages = {
        ErrorViewCreation: "There was a problem creating the view.",
        ErrorRetrievingValues: "Error retrieving values.",
        ErrorInsufficientPermission: "You do not have enough permissions to perform this action.",
        NotificationMessageForList: "Your view contains too many items (> 5,000 items) and so can't be displayed. <a href='#'>More information</a>. <a href='#' onclick='javascript: RC.NotificationController.RedirectToModifyView()'>Modify the view</a>, or create a new one: <a href='#' onclick='javascript:RC.NotificationController.CreateView(0)'>Most Recent</a>, <a href='#' onclick='javascript:RC.NotificationController.CreateView(1)'>Last 7 days</a>, <a href='#' onclick='javascript:RC.NotificationController.CreateView(2)'>Last 30 days</a>, <a href='#' onclick='javascript:RC.NotificationController.CreateView(4)'>My Items</a>.",
        NotificationMessageForLibrary: "Your view contains too many items (> 5,000 items) and so can't be displayed. <a href='#'>More information</a>. <a href='#' onclick='javascript: RC.NotificationController.RedirectToModifyView()'>Modify the view</a>, or create a new one: <a href='#' onclick='javascript:RC.NotificationController.CreateView(0)'>Most Recent</a>, <a href='#' onclick='javascript:RC.NotificationController.CreateView(1)'>Last 7 days</a>, <a href='#' onclick='javascript:RC.NotificationController.CreateView(2)'>Last 30 days</a>, <a href='#' onclick='javascript:RC.NotificationController.CreateView(3)'>My Documents</a>.",
        //SearchPage : "<a href='#' onclick='javascript:RC.SearchController.OpenModal()'> Open Query Tool</a>"
    }
    return Constants;
})
