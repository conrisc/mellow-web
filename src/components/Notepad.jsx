import React, { useState } from 'react';

export function Notepad() {
    const [ noteId, setNoteId ] = useState(null);

    return (
        <div className="row notepad">
            <div className={"col l6" + (noteId !== null ? ' hide-on-med-and-down' : '' )}>
               Notes
            </div>

            <form className={"col s12 l6"  + (noteId === null ? ' hide-on-med-and-down' : '' )}>
                <button className="waves-effect waves-light btn hide-on-large-only" >
                    <i className="fas fa-angle-left"></i>
                </button>
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