import React from 'react';
import { Link } from 'react-router-dom';
import { DevelopersApi, NoteItem } from 'what_api';

export function NoteCard(props) {
    const note = props.note;

    return (
        <div className="">
            <Link to={`/notepad/${note._id}`}>
                <div className="col s6 xl4">
                    <div className="card small">
                        <div className="btn-flat" onClick={(e) => { e.stopPropagation(); e.preventDefault(); props.removeNote(note._id); }}>
                            <i className="fas fa-times"></i>
                        </div>
                        <div className="card-content">
                            {note.text.split('\n', 11).map((el, i)=> {
                                return el ? <div key={i}>{el}</div> : <br key={i}></br>;
                            }
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
