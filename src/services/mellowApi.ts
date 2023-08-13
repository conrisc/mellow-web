import { createConfiguration, ServerConfiguration, UsersApi } from 'mellov_api';
import { MELLOV_API_URL } from 'Constants/environment';
import { getAccessToken, isLoggedIn } from './auth.service';

const AUTHORIZER_NAME = 'MellovAuthorizer';
const serverConfig = new ServerConfiguration(MELLOV_API_URL, {});

export async function getUsersApi(): Promise<UsersApi | null>{
	if (await isLoggedIn()) {
		const accessToken = await getAccessToken();

		const apiConfiguration = createConfiguration({
			baseServer: serverConfig,
			authMethods: { [AUTHORIZER_NAME]: accessToken },
		});
		return new UsersApi(apiConfiguration);
	} else {
		console.log('User is not logged in. Redirecting to login page');
		window.location.assign('/login');
		return null;
	}
}
