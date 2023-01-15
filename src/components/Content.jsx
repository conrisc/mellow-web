import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Home } from './Home';
import { Notepad } from './Notepad/Notepad';
import { Musiq } from './Musiq/Musiq';
import { Login } from './Login';
import { Register } from './Register';
import { useAuth } from 'Hooks/useAuth';

export function Content() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <PrivateRoute exact path="/notepad/:noteId?">
                <Notepad />
            </PrivateRoute>
            <PrivateRoute exact path="/musiq">
                <Musiq />
            </PrivateRoute>
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/register">
                <Register />
            </Route>
        </Switch>
    );
}

export function PrivateRoute({ children, ...rest }) {
    const { checkingAuth, isAuthenticated } = useAuth();


    return checkingAuth ? null : (
        <Route
            {...rest}
            render={({ location }) =>
                isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}
