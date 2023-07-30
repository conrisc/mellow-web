import React, { useEffect, useState } from 'react';
import { throttle } from 'throttle-debounce';
import { NoteItem } from 'mellov_api';
import { Input } from 'antd';

const { TextArea } = Input;

async function saveNote(noteId, text) {
	const noteItem = new NoteItem(new Date().toISOString(), text);
	noteItem.id = noteId;

	const api = await getUsersApi();
	api.updateNote(noteId, noteItem)
		.then(() => {
			console.log('Note updated');
		 }, error => {
			console.warn('Error while saving note: ', error);
		 });
}

const handleNoteUpdate = throttle(2000, saveNote);

export function NoteEditor(props) {
	const noteId = props.note.id;
	const [text, setText] = useState(props.note.text);
	const textRef = React.createRef();

	useEffect(() => {
		setText(props.note.text);
		textRef.current.focus();
	}, [noteId]);

    return (
        <div>
			<TextArea
				ref={textRef}
				autoFocus
				autoSize={{ minRows: 4 }}
				value={text}
				onChange={(e) => {
					const t = e.target.value;
					setText(t);
					props.onNoteChange(noteId, t);
					handleNoteUpdate(noteId, t);
				}} 
			/>
        </div>
    );
}


