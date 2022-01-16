import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { ApiClient, DevelopersApi, UserPost } from 'mellov_api';
import { Form, Input, Button } from 'antd';

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
                    sessionStorage.setItem('mellov_api_auth_token', response.data.authToken)
                    props.setAuthenticated()
                    history.replace(from);
                }
            }, error => {
                console.warn('Error while signing in', error);
                props.setUnauthenticated()
            });
    }

    return (
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ flex: "400px" }}
            style={{ padding: 40 }}
        >
            <Form.Item
                name="email"
                label="E-mail"
            >
                <Input onChange={e => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item
                name="password"
                label="Password"
           >
                <Input.Password onChange={e => setPassword(e.target.value)} />
            </Form.Item>
            <Form.Item
                wrapperCol={{ offset: 4, flex: "400px" }}
            >
                <Button type="primary" onClick={loginUser} htmlType="submit">Sign in</Button>
            </Form.Item>
        </Form>
    );
}

const mapStateToProps = state => {
    return {};
}

const mapDispatchToProps = dispatch => {
    return {
        setAuthenticated: () => dispatch({ type: 'SET_AUTHENTICATED' }),
        setUnauthenticated: () => dispatch({ type: 'SET_UNAUTHENTICATED' })
    };
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginX);
