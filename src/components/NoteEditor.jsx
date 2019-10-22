import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { throttle } from 'throttle-debounce';
import { DevelopersApi, NoteItem } from 'what_api';

const api = new DevelopersApi();

function saveNote(text) {
	var opts = { 
		noteItem: new NoteItem(Date(), text) // {NoteItem} Note item to add
	};

    api.updateNote(opts, (error, data, response) => {
		if (error)
			console.log('Error while saving note: ', error);
		else 
			console.log('Note updated', data, response);
	});
}

const handleNoteUpdate = throttle(2000, saveNote);

export function NoteEditor(props) {
	const noteId = props.note._id;
	const [text, setText] = useState(props.note.text);
	const textFocus = React.createRef();

	useEffect(() => {
		setText(props.note.text)
		textFocus.current.focus();
	}, [noteId]);

    useEffect(() => saveNote, []);

    return (
        <div>
            <Link to="/notepad" className="waves-effect waves-light btn hide-on-large-only">
                <i className="fas fa-angle-left"></i>
            </Link>
            <form>
                <div className="input-field">
					<textarea autoFocus
						ref={textFocus}
						id="textarea1"
						className="materialize-textarea"
						onChange={ (e) => { const t = e.target.value; setText(t); handleNoteUpdate(t); } }
						value={text}>
					</textarea>
                    <label htmlFor="textarea1">Your note</label>
                </div>
            </form>
        </div>
    );
}


