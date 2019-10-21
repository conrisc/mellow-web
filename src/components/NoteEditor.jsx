import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { throttle } from 'throttle-debounce';
import { DevelopersApi, NoteItem } from 'what_api';

const api = new DevelopersApi();

var opts = { 
  'noteItem': new NoteItem('c290faee-6c54-4b01-90e6-d701748f0851', 'Wed Oct 09 2019 13:39:18 GMT+0200 (Central European Summer Time)', 'Some text') // {NoteItem} Note item to add
};

console.log(opts);

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.', data, response);
  }
};
api.addNote(opts, callback)

function saveNote(value) {
    console.log('Saving note...', value)
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
                    <textarea id="textarea1" className="materialize-textarea" onChange={ (e) => { const text = e.target.value; handleNoteUpdate(text); } }></textarea>
                    <label htmlFor="textarea1">Your note</label>
                </div>
            </form>
        </div>
    );
}


