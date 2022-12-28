import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { ApiClient } from 'mellov_api';
import { Form, Input, Button } from 'antd';
import { signInUser } from '../services/auth.service';

function LoginX(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

    function loginUser() {
        signInUser(email, password)
            .then((accessToken) => {
                const AuthorizationHeader = ApiClient.instance.authentications['MellovAuthorizer'];
                const authToken = `Bearer ${accessToken}`
                AuthorizationHeader.apiKey = authToken;
                sessionStorage.setItem('mellov_api_auth_token', authToken);
                props.setAuthenticated();
                history.replace(from);
            }, error => {
                console.warn('Error while signing in', error);
                props.setUnauthenticated();
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
                <Input onChange={e => setEmail(e.target.value)} defaultValue={email}/>
            </Form.Item>
            <Form.Item
                name="password"
                label="Password"
           >
                <Input.Password onChange={e => setPassword(e.target.value)} defaultValue={password} />
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
