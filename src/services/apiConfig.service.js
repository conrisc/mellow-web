import { ApiClient } from 'mellov_api';

export const AUTHORIZER_NAME = 'MellovAuthorizer';

export function setApiKey(accessToken) {
    const AuthorizationHeader = ApiClient.instance.authentications[AUTHORIZER_NAME];
    AuthorizationHeader.apiKey = `Bearer ${accessToken}`;
}