var gulp = require('gulp');
var spsync = require('gulp-spsync-creds').sync;
var secrets =  require('./secrets.json')

gulp.task('default', function () {
  gulp.src('./src/**/*')
  .pipe(spsync({
      "username": secrets.username,
      "password": secrets.password,
      "site": secrets.site,
  }));
})
