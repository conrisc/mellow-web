import React, { useEffect, useState } from 'react';
import { throttle } from 'throttle-debounce';
import { WhatApi } from 'what_api';

const api = new WhatApi.DevelopersApi();

function saveNote(noteId, text) {
	var opts = { 
		noteItem: new WhatApi.NoteItem(Date(), text) // {NoteItem} Note item to add
	};

	opts.noteItem._id = noteId;

	api.updateNote(opts)
		.then(() => {
			console.log('Note updated');
		 }, error => {
			console.log('Error while saving note: ', error);
		 });
}

const handleNoteUpdate = throttle(2000, saveNote);

export function NoteEditor(props) {
	const noteId = props.note._id;
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
						className="materialize-textarea white-text"
						onChange={ (e) => { const t = e.target.value; props.onNoteChange(noteId, t); handleNoteUpdate(noteId, t); } }>
					</textarea>
                    <label htmlFor="textarea1">Your note</label>
                </div>
            </form>
        </div>
    );
}


