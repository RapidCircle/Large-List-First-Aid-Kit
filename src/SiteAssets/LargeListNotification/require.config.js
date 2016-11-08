requirejs.config({
    baseUrl: '/sites/dmc/siteassets/largelistnotification',
    paths: {
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min',
        knockout: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min",
        listjs: "https://cdnjs.cloudflare.com/ajax/libs/list.js/1.3.0/list.min",
        listjsPagination: "https://cdnjs.cloudflare.com/ajax/libs/list.pagination.js/0.1.1/list.pagination.min",
        jaml: "vendor/jaml"
    },
    map: {
        '*': {
            'css': 'vendor/css.min'
        }
    }
});
requirejs(['app']);
