import React from 'react';
import { Switch, Route, Link} from 'react-router-dom';

import { Notepad } from './Notepad/Notepad';
import { Musiq } from './Musiq/Musiq';
import { Login } from './Login';
import { Register } from './Register';

export function Content() {
    return (
        <Switch>
            <Route exact path="/">
                <h1>Home page</h1>
                <ul>
                    <li>
                        <Link to="/login">Sign in</Link>
                    </li>
                    <li>
                        <Link to="/register">Sign up</Link>
                    </li>
                    <li>
                        <Link to="/notepad">Notepad</Link>
                    </li>
                    <li>
                        <Link to="/musiq">Musiq</Link>
                    </li>
                </ul>
            </Route>
            <Route exact path="/notepad/:noteId?">
                <Notepad />
            </Route>
            <Route exact path="/musiq">
                <Musiq />
            </Route>
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/register">
                <Register />
            </Route>
        </Switch>
    );
}
