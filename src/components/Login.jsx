import React, { useState } from 'react';
import { ApiClient, DevelopersApi, UserPost } from 'what_api';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function loginUser() {
        const opts = {
            userCredentials: new UserPost(email, password)
        };
        const api = new DevelopersApi();
        api.signInUser(opts)
            .then((response) => {
                console.log(response);
                if (response.data && response.data.authToken) {
                    const AuthorizationHeader = ApiClient.instance.authentications['AuthorizationHeader'];
                    AuthorizationHeader.apiKey = response.data.authToken;
                }
            }, error => {
                console.warn('Error while signing in', error);
            });
    }

    return (
        <div>
            <input type="text" name="email" onChange={e => setEmail(e.target.value)} />
            <input type="password" name="password" onChange={e => setPassword(e.target.value)} />
            <button onClick={loginUser}>Sign in</button>
        </div>
    );
}
