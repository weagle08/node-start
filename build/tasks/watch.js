var gulp = require('gulp');
var paths = require('../paths');

// outputs changes to files to the console
function reportChange(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

// this task wil watch for changes
// to js, html, and css files and call the
// reportChange method. Also, by depending on the
// serve task, it will instantiate a browserSync session
gulp.task('watch', function() {
  gulp.watch(paths.source, ['build-system']).on('change', reportChange);
  gulp.watch(paths.move).on('change', reportChange);
});
