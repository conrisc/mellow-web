import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { ApiClient, DevelopersApi, UserPost } from 'what_api';

function LoginX(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

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
                    sessionStorage.setItem('what_auth_token', response.data.authToken)
                    props.setAuthenticated()
                    history.replace(from);
                }
            }, error => {
                console.warn('Error while signing in', error);
                props.setUnauthenticated()
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

const mapStateToProps = state => {
    return {};
}

const mapDispatchToProps = dispatch => {
    return {
        setAuthenticated: () => dispatch({ type: 'SET_AUTHENTICATED' })
    };
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginX);
