import React from 'react';
import { useParams } from 'react-router-dom';

import { NoteList } from './NoteList';
import { NoteEditor } from './NoteEditor';

export function Notepad(props) {
    const { noteId } = useParams();

    return (
        <div className="row notepad">
            <div className={"col s12 l6" + (noteId !== undefined ? ' hide-on-med-and-down' : '' )}>
                <NoteList />
            </div>
            <div className={"col s12 l6"  + (noteId === undefined ? ' hide-on-med-and-down' : '' )}>
                <NoteEditor />
            </div>
        </div>
    );
}