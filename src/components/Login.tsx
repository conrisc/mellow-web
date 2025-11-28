import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { signInUser } from 'Services/auth.service';
import { useAuth } from 'Contexts/AuthContext';

export function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { setIsAuthenticated } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { from } = location.state || { from: { pathname: '/' } };

	function loginUser() {
		signInUser(email, password).then(
			() => {
				setIsAuthenticated(true);
				navigate(from);
			},
			(error) => {
				console.warn('Error while signing in', error);
				setIsAuthenticated(false);
			}
		);
	}

	return (
		<Form labelCol={{ span: 4 }} wrapperCol={{ flex: '400px' }} style={{ padding: 40 }}>
			<Form.Item name="email" label="E-mail">
				<Input onChange={(e) => setEmail(e.target.value)} defaultValue={email} />
			</Form.Item>
			<Form.Item name="password" label="Password">
				<Input.Password onChange={(e) => setPassword(e.target.value)} defaultValue={password} />
			</Form.Item>
			<Form.Item wrapperCol={{ offset: 4, flex: '400px' }}>
				<Button type="primary" onClick={loginUser} htmlType="submit">
					Sign in
				</Button>
			</Form.Item>
		</Form>
	);
}
