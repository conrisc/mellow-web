import React from 'react';
import { Link, withRouter} from 'react-router-dom';
import { DevelopersApi, NoteItem } from 'what_api';

function NoteCardN(props) {
    const note = props.note;

    function removeNote() {
        const api = new DevelopersApi();
        const opts = {
            id: note._id
        };

        api.removeNote(note._id, (error, data, response) => {
            if (error)
                console.error(error);
            else {
                console.log(data);
                props.updateNotes();
                props.history.push('/notepad');
            }
        });
    }

    return (
        <div className="row">
            <Link to={`/notepad/${note._id}`}>Link</Link>
            <div className="col s12 m5">
                <div className="card-panel teal">
                    <div className="btn-flat" onClick={removeNote}>
                        <i className="fas fa-times"></i>
                    </div>
                    <span className="white-text truncate">
                        {note.text}
                    </span>
                </div>
            </div>
        </div>
    );
}

let NoteCard = withRouter(NoteCardN);

export {
    NoteCard
}
