import * as test from '../../src/test';
import {ApiObjectTest} from './ApiObjectTest';
import {TEST_CONFIG} from '../config';
import * as api from '../../src/api';

abstract class BaseUserTest extends ApiObjectTest {
	protected getUsername(): string {
		return 'crew';
	}
	
	
	protected async loadUser(): Promise<api.User> {
		return await api.User.loadByUsername(this.createClientWithPublicAccess(), this.getUsername());
	}
}


@ApiObjectTest.testName('Load Single User by Username')
class LoadSingleUserByUsername extends BaseUserTest {
	protected async performTest() {
		const user = await this.loadUser();
		await this.assert(user.getUsername() === this.getUsername(), 'is same user as requested one');
	}
}

@ApiObjectTest.testName('Load User Photos')
class LoadUserPhotos extends BaseUserTest {
	protected async performTest() {
		const user = await this.loadUser(),
			  photos = await user.loadPhotos();
		await this.assert(photos.findIndex(photo => !(photo instanceof api.Photo)) === -1, 'photo array only contains `Photo` instances');
	}
}


@TestRunner.testName('User Test Runner')
export class TestRunner extends test.TestRunner.runs(
	LoadSingleUserByUsername,
	LoadUserPhotos
) { }