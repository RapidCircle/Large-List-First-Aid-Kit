define(function() {
    var Constants = {};
    Constants.ThresholdMessage = [
        {
            locale: 1033,
            error: "This view cannot be displayed because it exceeds the list view threshold (5000 items) enforced by the administrator."
        }
    ];
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
       DefaultValue : 0,
       Recursive : 1,
       RecursiveAll : 2,
       FilesOnly : 3
    }
    return Constants;
})
