var gulp = require('gulp');
var babel = require('gulp-babel');
var strip = require('gulp-strip-comments');

gulp.task('babel', function () {
	return gulp.src('./js/*.es')
		.pipe(strip())
		.pipe(babel())
		.pipe(gulp.dest('./js'))
});

gulp.task('watch', function () {
	gulp.watch('./js/*.es', ['babel']);
});

gulp.task('default', ['watch']);
