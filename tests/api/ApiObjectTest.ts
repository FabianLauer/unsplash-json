import * as test from '../../src/test';
import {TEST_CONFIG} from '../config';
import * as api from '../../src/api';

@ApiObjectTest.timeout(TEST_CONFIG.defaultTestTimeout)
export abstract class ApiObjectTest extends test.UnitTest {
	protected createClientWithPublicAccess(): api.Client {
		return new api.Client({ applicationId: TEST_CONFIG.applicationId, callbackUrl: undefined, secret: undefined });
	}
}