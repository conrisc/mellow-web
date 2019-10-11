import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { throttle } from 'throttle-debounce';

function saveNote() {
    console.log('Saving note...')
}

const handleNoteUpdate = throttle(2000, saveNote);

export function NoteEditor(props) {
    const noteId = props.noteId;

    useEffect(() => saveNote, []);

    return (
        <div>
            <Link to="/notepad" className="waves-effect waves-light btn hide-on-large-only">
                <i className="fas fa-angle-left"></i>
            </Link>
            <form>
                <div className="input-field">
                    <textarea id="textarea1" className="materialize-textarea" onChange={ handleNoteUpdate }></textarea>
                    <label htmlFor="textarea1">Your note</label>
                </div>
            </form>
        </div>
    );
}


