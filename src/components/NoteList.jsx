import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { DevelopersApi, NoteItem } from 'what_api';


function NoteListN(props) {
    const noteId = props.noteId;
    const notes = props.notes;

    function createEmptyNote() {
        const api = new DevelopersApi();

        var opts = { 
            noteItem: new NoteItem(Date(), '') // {NoteItem} Note item to add
        };

        api.addNote(opts, (error, data, response) => {
            if (error) {
                console.error(error);
            } else {
                console.log('API called successfully.', data, response);
                props.history.push(`/notepad/${data}`);
            }
        });
    }


    return (
        <div>
            <div>
                <button onClick={createEmptyNote} className="waves-effect waves-light btn">
                    <i className="fas fa-plus-circle"></i>
                </button>
            </div>
            <div>
                {
                    notes.map((noteItem, index) =>
                        <Link to={`/notepad/${noteItem._id}`} key={index}>Note {index}</Link>
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