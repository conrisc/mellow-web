import React, { useState } from 'react';
import { DevelopersApi, UserPost } from 'mellov_api';

export function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function registerUser() {
        const opts = {
            userCredentials: new UserPost(email, password)
        };
        const api = new DevelopersApi();
        api.signUpUser(opts)
            .then((data) => {
                console.log(data);
            }, error => {
                console.warn('Error while signing up', error);
            });
    }

    return (
        <div>
            <input type="text" name="email" onChange={e => setEmail(e.target.value)} />
            <input type="password" name="password" onChange={e => setPassword(e.target.value)} />
            <button onClick={registerUser}>Sign up</button>
        </div>
    );
}
