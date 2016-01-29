import * as test from '../src/test';
import * as api from './api/TestRunner';

@TestRunner.testName('Full Test Suite')
export class TestRunner extends test.TestRunner.runs(
	api.TestRunner
) { }