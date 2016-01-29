var gulp = require('gulp'),
	typescript = require('gulp-tsc');

gulp.task('tsc', function() {
  return gulp.src(['src/**/*.ts'])
			.pipe(typescript({
				target: 'ES6',
				module: 'commonjs',
				noImplicitAny: true,
				experimentalDecorators: true
			}));
});