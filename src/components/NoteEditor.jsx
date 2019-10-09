import React from 'react';
import { Link } from 'react-router-dom';

export function NoteEditor(props) {
    return (
        <div>
            <Link to="/notepad" className="waves-effect waves-light btn hide-on-large-only">
                <i className="fas fa-angle-left"></i>
            </Link>
            <form>
                <div className="input-field">
                    <textarea id="textarea1" className="materialize-textarea"></textarea>
                    <label htmlFor="textarea1">Your note</label>
                </div>
            </form>
        </div>
    );
}
