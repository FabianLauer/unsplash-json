var MAIN_FILE = process.argv[2],
	child_process = require('child_process');

function generateTscCommand(srcFile) {
	return 'tsc ' + srcFile + ' --noImplicitAny --experimentalDecorators --target ES6 --module commonjs --moduleResolution classic --sourcemap';
}

child_process.exec(generateTscCommand(MAIN_FILE), function(err, stdout, stderr) {
	console.log(stdout + '');
	console.log(stderr + '');
    console.log('build ready');
});