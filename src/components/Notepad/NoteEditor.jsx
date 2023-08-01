import React, { useCallback, useEffect, useState } from 'react';
import { throttle } from 'throttle-debounce';
import { NoteItem } from 'mellov_api';
import { Input } from 'antd';
import { getUsersApi } from 'Services/mellowApi';

const { TextArea } = Input;

export function NoteEditor(props) {
	const noteId = props.note.id;
	const [text, setText] = useState(props.note.text);
	const [isSaved, setIsSaved] = useState(true);
	const textRef = React.createRef();

	const handleNoteUpdate = useCallback(
		throttle(3000, async (noteId, text) => {
			await saveNote(noteId, text);
			setIsSaved(true);
		}),
		[]
	);

	useEffect(() => {
		setText(props.note.text);
		textRef.current.focus();
	}, [noteId]);

	async function saveNote(noteId, text) {
		const noteItem = new NoteItem();
		noteItem.id = noteId;
		noteItem.creationDate = new Date().toISOString();
		noteItem.text = text;

		const api = await getUsersApi();
		api.updateNote(noteId, noteItem).then(
			() => {
				console.log('Note updated');
			},
			(error) => {
				console.warn('Error while saving note: ', error);
			}
		);
	}

	return (
		<div style={{ position: 'relative' }}>
			{isSaved && (
				<div
					style={{
						position: 'absolute',
						top: 4,
						right: 8,
						zIndex: 10,
						color: '#52c41a',
					}}
				>
					<i className="fas fa-check"></i>
				</div>
			)}
			<TextArea
				ref={textRef}
				autoFocus
				autoSize={{ minRows: 4 }}
				value={text}
				onChange={(e) => {
					const t = e.target.value;
					setText(t);
					setIsSaved(false);
					props.onNoteChange(noteId, t);
					handleNoteUpdate(noteId, t);
				}}
			/>
		</div>
	);
}
