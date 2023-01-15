import { ApiClient } from 'mellov_api';
import { isLoggedIn, getAccessToken } from './auth.service';

export const AUTHORIZER_NAME = 'MellovAuthorizer';

export function setApiKey(accessToken) {
    const AuthorizationHeader = ApiClient.instance.authentications[AUTHORIZER_NAME];
    AuthorizationHeader.apiKeyPrefix = 'Bearer';
    AuthorizationHeader.apiKey = accessToken;
}

export async function authorizedRequest(request) {
    let response;

    try {
        response = await request();
    } catch (ex) {
        if (ex.status === 401) {
            console.warn('Unauthorized request');
            if (await isLoggedIn()) {
                const accessToken = await getAccessToken();
                setApiKey(accessToken);

                response = await request();
            } else {
                console.log('Redirecting to login page');
                window.location.assign('/login');
            }
        }
        else {
            console.error(`Request failed ${ex.message || ex}`)
            throw ex;
        }
    }

    return response;
}
