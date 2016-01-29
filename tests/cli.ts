import * as test from '../src/test';
import {TestRunner} from './TestRunner';
import {TEST_CONFIG} from './config';

const argv = require('optimist')
	.string('id')
	.describe('id', 'The application ID used to authorize in the Unsplash API.')
	.demand('id')
	.alias('id', 'application-id')
	.argv;

TEST_CONFIG.applicationId = argv.id;

(async () => {
	process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
		console.log("Unhandled rejection:", reason, "at Promise ", promise);
		console.trace();
	});
	
	const runner = new TestRunner(),
		renderer = new test.CliRenderer(runner);
	renderer.pipeLogMessagesTo(process.stdout);
	await runner.run();
})();