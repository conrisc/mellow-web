import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const userPoolId = 'eu-central-1_6DPW3zDLR';
const clientId = '6ov1c2mh20ea2go0nlvue6fqb0';
const region = 'eu-central-1';

export async function signInUser(username, password) {
    const poolData = {
        UserPoolId: userPoolId,
        ClientId: clientId,
    };
    const userPool = new CognitoUserPool(poolData);

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