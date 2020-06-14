import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link, Redirect } from 'react-router-dom';

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
                        <Link to="/notepad">Notepad</Link>
                    </li>
                    <li>
                        <Link to="/musiq">Musiq</Link>
                    </li>
                </ul>
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

function PrivateRouteX({ children, isAuthenticated, setAuthenticated, ...rest }) {
    return (
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

const mapStateToProps = state => {
    return {
        isAuthenticated: state.isAuthenticated
    };
}

const mapDispatchToProps = dispatch => {
    return {};
}

const PrivateRoute = connect(mapStateToProps, mapDispatchToProps)(PrivateRouteX);
