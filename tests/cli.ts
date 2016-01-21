import * as test from '../src/test';
import {TestRunner} from './TestRunner';

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