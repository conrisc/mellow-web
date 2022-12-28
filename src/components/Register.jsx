import React, { useState } from 'react';

export function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function registerUser() {}

    return (
        <div>
            <input type="text" name="email" onChange={e => setEmail(e.target.value)} />
            <input type="password" name="password" onChange={e => setPassword(e.target.value)} />
            <button onClick={registerUser}>Sign up</button>
        </div>
    );
}
