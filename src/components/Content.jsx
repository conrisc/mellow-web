import React from 'react';
import { Switch, Route, Link} from 'react-router-dom';

import { Notepad } from './Notepad'

export function Content() {
    return (
        <Switch>
            <Route exact path="/notepad/:noteId?">
                <Notepad />
            </Route>
            <Route path="/">
                <h1>Home page</h1>
                <Link to="/notepad">Notepad</Link>
            </Route>
        </Switch>
    );
}