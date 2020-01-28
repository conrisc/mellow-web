import React, { useEffect, useState } from 'react';
import { throttle } from 'throttle-debounce';
import { DevelopersApi, NoteItem } from 'what_api';


function saveNote(noteId, text) {
	const opts = { 
		noteItem: new NoteItem(Date(), text) // {NoteItem} Note item to add
	};
	opts.noteItem.id = noteId;

	const api = new DevelopersApi();
	api.updateNote(opts)
		.then(() => {
			console.log('Note updated');
		 }, error => {
			console.warn('Error while saving note: ', error);
		 });
}

const handleNoteUpdate = throttle(2000, saveNote);

export function NoteEditor(props) {
	const noteId = props.note.id;
	const text = props.note.text;
	const textRef = React.createRef();

	useEffect(() => {
		// textRef.current.focus();
		textRef.current.value = text;
		M.textareaAutoResize(textRef.current);
		M.updateTextFields();
	}, [noteId]);

    return (
        <div className="mt-3">
            <form>
                <div className="input-field">
					<textarea autoFocus
						ref={textRef}
						id="textarea1"
						className="materialize-textarea"
						onChange={ (e) => { const t = e.target.value; props.onNoteChange(noteId, t); handleNoteUpdate(noteId, t); } }>
					</textarea>
                    <label htmlFor="textarea1">Your note</label>
                </div>
            </form>
        </div>
    );
}


