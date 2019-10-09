import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export function Notepad(props) {
    const { noteId } = useParams();
    // const [ noteId, setNoteId ] = useState(null);

    return (
        <div className="row notepad">
            <div className={"col l6" + (noteId !== undefined ? ' hide-on-med-and-down' : '' )}>
                <Link to="/notepad/1">Note 1</Link>
                <Link to="/notepad/2">Note 2</Link>
                <Link to="/notepad/3">Note 3</Link>
                <Link to="/notepad/4">Note 4</Link>
            </div>

            <form className={"col s12 l6"  + (noteId === undefined ? ' hide-on-med-and-down' : '' )}>
                <Link to="/notepad" className="waves-effect waves-light btn hide-on-large-only">
                    <i className="fas fa-angle-left"></i>
                </Link>
                <div className="">
                    <div className="input-field">
                        <textarea id="textarea1" className="materialize-textarea"></textarea>
                        <label htmlFor="textarea1">Your note</label>
                    </div>
                </div>
            </form>
        </div>
    );
}