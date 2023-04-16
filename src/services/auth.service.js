import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const userPoolId = 'eu-central-1_6DPW3zDLR';
const clientId = '6ov1c2mh20ea2go0nlvue6fqb0';
const region = 'eu-central-1';

const poolData = {
    UserPoolId: userPoolId,
    ClientId: clientId,
};
const userPool = new CognitoUserPool(poolData);


export function isLoggedIn() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
        return new Promise((resolve) => {
            // getSession automatically refreshes session using RefreshToken if Id/Access token expire
            cognitoUser.getSession((error, session) => {
                if (error) {
                    console.warn(`Retriving session failed: ${error.message | error}`);
                    resolve(false);
                } else {
                    console.log(`Session validity: ${session.isValid()}`);
                    resolve(session.isValid());
                }
            });
        });
    }

    return Promise.resolve(false);
}

export function signInUser(username, password) {
    const userData = {
        Username: username,
        Pool: userPool,
    }
    const cognitoUser = new CognitoUser(userData);

    const authenticationData = {
        Username: username,
        Password: password,
    }
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                const accessToken = result.getAccessToken().getJwtToken();

                resolve(accessToken);
            },
            onFailure: (error) => {
                console.error(`Failed to authenticate. Error: ${error.message || errro}`);
                reject(error);
            }
        });
    });
}

export function signOutUser() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) cognitoUser.signOut();
}

export function getAccessToken() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
        return new Promise((resolve, reject) => {
            // getSession automatically refreshes session using RefreshToken if Id/Access token expire
            cognitoUser.getSession((error, session) => {
                if (error) {
                    console.error(`Retriving session failed: ${error.message | error}`);
                    reject(Error('Failed to get session'));
                }

                if (session.isValid()) {
                    resolve(session.getAccessToken().getJwtToken());
                } else {
                    reject(Error('Session is not valid'));
                }
            });
        });
    }

    return Promise.reject(Error('No user logged in'));
}
