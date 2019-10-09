import React from 'react';
import { Link } from 'react-router-dom';

export function NoteList(props) {
    return (
        <div>
            <Link to="/notepad/1">Note 1</Link>
            <Link to="/notepad/2">Note 2</Link>
            <Link to="/notepad/3">Note 3</Link>
            <Link to="/notepad/4">Note 4</Link>
        </div>
    );
}
