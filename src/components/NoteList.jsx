import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import { NoteCard } from './NoteCard';


function NoteListN(props) {
    const noteId = props.noteId;
    const notes = props.notes;


    return (
        <div>
            <div>
                <button onClick={props.createEmptyNote} className="waves-effect waves-light btn  light-blue accent-2">
                    <i className="fas fa-plus-circle"></i>
                </button>
            </div>
            <div>
                {
                    notes.map((noteItem, index) =>
                        <NoteCard
                            note={noteItem}
                            key={index}
                            updateNotes={props.updateNotes}
                            removeNote={props.removeNote}
                            active={noteId === noteItem._id}
                        />
                    )
                }
            </div>
        </div>
    );
}

let NoteList = withRouter(NoteListN);

export {
    NoteList
}