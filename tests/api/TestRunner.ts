import * as test from '../../src/test';
import * as user from './user';
import * as stats from './stats';

@TestRunner.testName('API Test Suite')
export class TestRunner extends test.TestRunner.runs(
	user.TestRunner,
	stats.TestRunner
) { }