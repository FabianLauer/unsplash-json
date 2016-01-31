var gulp = require('gulp'),
	fs = require('fs'),
	path = require('path'),
	merge = require('merge-stream'),
	typescript = require('gulp-tsc'),
	concat = require('gulp-concat'),
	deleteLines = require('gulp-delete-lines'),
	replace = require('gulp-replace'),
	insert = require('gulp-insert'),
	shell = require('gulp-shell'),
	babel = require('gulp-babel');
	
var DECL_FILE_COMMENT = '\
/**\n\
 * Unsplash JSON API wrapper.\n\
 * COPYRIGHT (c) 2016, Fabian Lauer\n\
 * Licensed under the MIT license: https://opensource.org/licenses/MIT\n\
 */\n\
';


function log() {
	console.log.apply(console, arguments);
}


function getSubDirectories(dir) {
    return fs.readdirSync(dir)
		.filter(function (file) {
			return fs.statSync(path.join(dir, file)).isDirectory();
		});
}


function compileTypescriptSources(files, destDir, declaration) {
	return function () {
		return gulp.src([files])
			.pipe(typescript({
				target: 'ES6',
				module: 'commonjs',
				noImplicitAny: true,
				experimentalDecorators: true,
				declaration: !!declaration
			}))
			.pipe(gulp.dest(destDir));
	}
}


gulp.task('compileDevSrc', compileTypescriptSources('src/**/*.ts', 'build/src'));
gulp.task('compileTests', compileTypescriptSources('tests/**/*.ts', 'build/tests'));
gulp.task('compileDev', ['compileDevSrc', 'compileTests']);

gulp.task('compileRelease', compileTypescriptSources('src/**/*.ts', 'dist/src', true));

gulp.task('generateReleaseModuleDeclarations', function () {
	var directories = getSubDirectories('dist/src/');
	
	directories = directories.filter(function(folder) {
		switch (folder) {
			case 'test':
			case 'log':
				return false;
			default:
				return true;
		}
	});

	var tasks = directories.map(function (folder) {
		log('will generate ' + folder + '.generated.d.ts in dist/src/');
		return gulp.src(path.join('dist/src/', folder, '/**/*.ts'))
			.pipe(concat(folder + '.generated.d.ts'))
			.pipe(replace(/declare /g, ''))
			.pipe(replace(/const enum /g, 'enum '))
			.pipe(deleteLines({
				'filters': [
					/import /
				]
			}))
			.pipe(deleteLines({
				'filters': [
					/export +\{/
				]
			}))
			.pipe(insert.prepend('export module ' + folder + ' {\n'))
			.pipe(insert.append('\n} // module ' + folder))
			.pipe(gulp.dest('dist/src/'));
	});

	var root = gulp.src(['dist/src/*.d.ts'])
		.pipe(concat('unsplash.d.ts'))
		.pipe(gulp.dest('dist/'));
		
	return merge(tasks, root);
});

gulp.task('generateReleaseDeclaration', function () {
	return gulp.src(['dist/src/*.generated.d.ts'])
		.pipe(concat('unsplash.d.ts'))	
		.pipe(insert.prepend('declare module "unsplash" {\n'))
		.pipe(insert.append('\n} // module unsplash'))
		.pipe(insert.prepend(DECL_FILE_COMMENT))
		.pipe(gulp.dest('dist/'))
		.pipe(shell(['node node_modules/typescript-formatter/lib/cli.js -r dist/unsplash.d.ts']));
});

gulp.task('transpileES6', function () {
	return gulp.src(['dist/src/**/*.js'])
		.pipe(babel({
			presets: ['es2016-node5'],
			plugins: ['transform-runtime']
		}))
		.pipe(gulp.dest('dist/lib/'));
});