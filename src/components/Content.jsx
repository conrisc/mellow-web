import React from 'react';
import { Switch, Route, Link} from 'react-router-dom';

import { Notepad } from './Notepad';
import { Musiq } from './Musiq';

export function Content() {
    return (
        <Switch>
            <Route exact path="/notepad/:noteId?">
                <Notepad />
            </Route>
            <Route exact path="/musiq">
                <Musiq />
            </Route>
            <Route path="/">
                <h1>Home page</h1>
                <ul>
                    <li>
                        <Link to="/notepad">Notepad</Link>
                    </li>
                    <li>
                        <Link to="/musiq">Musiq</Link>
                    </li>
                </ul>
            </Route>
        </Switch>
    );
}