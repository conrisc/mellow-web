import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Notepad } from './Notepad'

export function Content() {
    return (
        <Switch>
            <Route exact path="/notepad/:noteId?">
                <Notepad />
            </Route>
            <Route path="/">
                <p>This is home</p>
            </Route>
        </Switch>
    );
}