var gulp = require('gulp');
var spsync = require('gulp-spsync-creds').sync;
var secrets = require('./secrets.json')
var watch = require('gulp-watch');

var source = './src',
    destination = './build';

gulp.task('spsave', function() {
    return gulp.src(source + '/**/*.*', {base: source})
    .pipe(spsync({"username": secrets.username, "password": secrets.password, "site": secrets.site, "cache": true, "publish": true}))
})

gulp.task('default', function() {
    return gulp.src(source + '/**/*.*', {base: source})
    .pipe(watch(source, {base: source, ignoreInitial: true}))
    .pipe(spsync({"username": secrets.username, "password": secrets.password, "site": secrets.site, "cache": true, "publish": true}))
    .pipe(gulp.dest('build'));
});
