define([], function() {
    return [{
        type: 0,
        view_name: "Most Recent",
        query: ""
    }, {
        type: 1,
        view_name: "Last Week",
        query: "<Where><Geq><FieldRef Name='Modified' /><Value Type='DateTime'><Today OffsetDays='-7' /></Value></Geq></Where>"
    }, {
        type: 2,
        view_name: "Last 30 days",
        query: "<Where><Geq><FieldRef Name='Modified' /><Value Type='DateTime'><Today OffsetDays='-30' /></Value></Geq></Where>"
    }, {
        type: 3,
        view_name: "My Documents",
        query: "<Where><Or><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID Type='Integer' /></Value></Eq><Eq><FieldRef Name='Editor'/><Value Type='Integer'><UserID Type='Integer' /></Value></Eq></Or></Where><OrderBy><FieldRef Name='FileLeafRef' Ascending='TRUE' /></OrderBy>"
    }, {
        type: 4,
        view_name: "My Items",
        query: "<Where><Or><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID Type='Integer' /></Value></Eq><Eq><FieldRef Name='Editor'/><Value Type='Integer'><UserID Type='Integer' /></Value></Eq></Or></Where><OrderBy><FieldRef Name='ID' Ascending='FALSE' /></OrderBy>"
    }];
})
