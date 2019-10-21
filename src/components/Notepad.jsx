import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DevelopersApi } from 'what_api';

import { NoteList } from './NoteList';
import { NoteEditor } from './NoteEditor';
import { Spinner } from './Spinner';

export function Notepad(props) {
    const { noteId } = useParams();
    const [ note, setNote ] = useState(null);

    useEffect(() => {
        if (noteId)
            getNote();
    }, [noteId]);

    function getNote() {
        const api = new DevelopersApi();
        const opts = { 
            'id': noteId
        };
        api.searchNote(opts, (error, data, response) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Found some notes', data, response);
                if (data.length > 0)
                    setNote({ id: data[0].id + noteId, text: data[0].text + 'lo ' + Date(), creationDate: Date() })
            }
        });
    }

    return (
        <div className="row notepad">
            <div className={"col s12 l6" + (noteId !== undefined ? ' hide-on-med-and-down' : '' )}>
                <NoteList noteId={noteId} />
            </div>
            <div className={"col s12 l6"  + (noteId === undefined ? ' hide' : '' )}>
                { 
                    note ?
                    <NoteEditor note={note} /> :
                    <Spinner />
                }
            </div>
        </div>
    );
}