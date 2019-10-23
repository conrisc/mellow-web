import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { DevelopersApi, NoteItem } from 'what_api';


function NoteListN(props) {
    const noteId = props.noteId;

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
                <Link to="/notepad/1">Note 1</Link>
                <Link to="/notepad/2">Note 2</Link>
                <Link to="/notepad/3">Note 3</Link>
                <Link to="/notepad/4">Note 4</Link>
            </div>
        </div>
    );
}

let NoteList = withRouter(NoteListN);

export {
    NoteList
}