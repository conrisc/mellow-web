import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Home } from './Home';
import { Notepad } from './Notepad/Notepad';
import { Musiq } from './Musiq/Musiq';
import { Login } from './Login';
import { Register } from './Register';
import { getAccessToken, isLoggedIn } from '../services/auth.service';
import { setApiKey } from '../services/apiConfig.service';

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

function PrivateRouteX({ children, setAuthenticated, setUnauthenticated, isAuthenticated, ...rest }) {
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        checkIfAuthorized();
    }, []);

    async function checkIfAuthorized() {
        if (await isLoggedIn()) {
            const accessToken = await getAccessToken();
            setApiKey(accessToken);
            setAuthenticated();
        } else {
            setUnauthenticated();
        }

        setChecking(false);
    }

    return checking ? null : (
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
    return {
        setAuthenticated: () => dispatch({ type: 'SET_AUTHENTICATED' }),
        setUnauthenticated: () => dispatch({ type: 'SET_UNAUTHENTICATED' }),
    };
}

const PrivateRoute = connect(mapStateToProps, mapDispatchToProps)(PrivateRouteX);
