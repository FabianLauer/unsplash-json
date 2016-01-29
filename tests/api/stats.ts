import * as test from '../../src/test';
import {ApiObjectTest} from './ApiObjectTest';
import {TEST_CONFIG} from '../config';
import * as api from '../../src/api';

@ApiObjectTest.testName('Load Stats')
class LoadStats extends ApiObjectTest {
	protected async performTest() {
		const stats = await api.Stats.load(this.createClientWithPublicAccess());
		await this.assert(LoadStats.isValidStatNumber(stats.getBatchDownloads()), 'batch downloads is a valid number');
		await this.assert(LoadStats.isValidStatNumber(stats.getPhotoDownloads()), 'photo downloads is a valid number');
	}
	
	
	private static isValidStatNumber(num: number): boolean {
		return typeof num === 'number' && num >= 0 && isFinite(num) && !isNaN(num);
	}
}


@TestRunner.testName('Stats Test Runner')
export class TestRunner extends test.TestRunner.runs(
	LoadStats
) { }