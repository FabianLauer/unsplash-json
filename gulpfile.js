var gulp = require('gulp'),
	typescript = require('gulp-tsc');

function compileTypescript(files, destDir) {
  return function() {
	  return gulp.src([files])
		.pipe(typescript({
			target: 'ES6',
			module: 'commonjs',
			noImplicitAny: true,
			experimentalDecorators: true
		}))
		.pipe(gulp.dest(destDir));
  }
}

gulp.task('compileSrc', compileTypescript('src/**/*.ts', 'build/src'));
gulp.task('compileTests', compileTypescript('tests/**/*.ts', 'build/tests'));
gulp.task('tsc', ['compileSrc', 'compileTests']);