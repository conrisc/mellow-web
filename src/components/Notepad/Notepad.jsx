import React, { useState, useEffect, useRef } from 'react';
import './Notepad.css';
import { useParams, useNavigate } from 'react-router-dom';
import { NoteItem } from 'mellov_api';
import { Row, Col, Button } from 'antd';

import { Info } from 'CommonComponents/Info';
import { NoteList } from './NoteList';
import { NoteEditor } from './NoteEditor';
import { getUsersApi } from 'Services/mellowApi';
import { useMatchMedia } from 'Hooks/useMatchMedia';

export function Notepad(props) {
	const { noteId } = useParams();
	const [notes, setNotes] = useState([]);
	const [note, setNote] = useState(null);
	const [shouldShowSpinner, setSpinnerState] = useState(true);
	const navigate = useNavigate();
	const prevNoteRef = useRef(null);
	const isLargeScreen = useMatchMedia('(min-width: 992px)');

	useEffect(() => {
		initActionButton();
		getNotes();
		document
			.querySelector('#manifest-placeholder')
			.setAttribute('href', '/manifest-notepad.json');
	}, []);

	useEffect(() => {
		if (noteId) displayNote();
	}, [noteId, notes]);

	useEffect(() => {
		removePrevNoteIfEmpty(prevNoteRef.current);
		prevNoteRef.current = note;
	}, [note]);

	useEffect(() => cleanup, []);

	function cleanup() {
		removePrevNoteIfEmpty(prevNoteRef.current);
	}

	function removePrevNoteIfEmpty(n) {
		const previousNote = prevNoteRef.current;
		const previousNotSelected = previousNote && (!note || previousNote.id !== note.id);
		if (previousNotSelected && previousNote.text === '') removeNote(previousNote.id);
	}

	function onNoteChange(noteId, text) {
		const newNotes = notes.map((el) => {
			if (el.id === noteId) {
				const updatedNote = new NoteItem(el.creationDate, text);
				updatedNote.id = el.id;
				return updatedNote;
			}
			return el;
		});
		setNotes(newNotes);
	}

	async function getNote() {
		const api = await getUsersApi();
		api.searchNote(noteId)
			.then((data) => {
				console.log('Found the note', data, response);
				if (data.length > 0) setNote(data[0]);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	function displayNote() {
		const newNote = notes.find((noteItem) => noteItem.id === noteId) || null;
		setNote(newNote);
	}

	async function getNotes() {
		const api = await getUsersApi();

		return api
			.searchNotes()
			.then((data) => {
				console.log('Fetched notes');
				setNotes(data);
				setSpinnerState(false);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	function initActionButton() {}

	async function removeNote(nId) {
		const api = await getUsersApi();

		api.deleteNote(nId)
			.then(() => {
				getNotes();
				if (noteId === nId) redirectToList();
			})
			.catch((error) => {
				console.error(error);
			});
	}

	async function createEmptyNote() {
		const api = await getUsersApi();

		const noteItem = new NoteItem(new Date().toISOString(), '');

		api.addNote(noteItem)
			.then((data) => {
				console.log('API called successfully.', data);
				getNotes();
				navigateToNote(data.id);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	function redirectToList() {
		navigate('/notepad');
	}

	function navigateToNote(noteId) {
		navigate(`/notepad/${noteId}`);
	}

	return (
		<div className="notepad">
			<Row className="notepad-row" gutter={8}>
				<Col span={isLargeScreen ? 12 : noteId ? 0 : 24}>
					<Button
						style={{ marginBottom: '8px' }}
						type="default"
						onClick={createEmptyNote}
						icon={<i className="fas fa-plus-circle"></i>}
					/>
					<div
						style={{
							height: 'calc(100vh - 80px)',
							overflowY: 'auto',
							overflowX: 'hidden',
						}}
					>
						<NoteList
							noteId={noteId}
							notes={notes}
							updateNotes={getNotes}
							removeNote={removeNote}
							createEmptyNote={createEmptyNote}
						/>
					</div>
				</Col>
				<Col
					span={isLargeScreen && noteId ? 12 : noteId ? 24 : 0}
					style={{
						paddingTop: isLargeScreen ? 32 : 0,
					}}
				>
					{!isLargeScreen && (
						<Button
							style={{ marginBottom: '8px' }}
							onClick={redirectToList}
							type="primary"
							icon={<i className="fas fa-angle-left"></i>}
						/>
					)}
					<div
						style={{
							height: 'calc(100vh - 80px)',
							overflowY: 'auto',
						}}
					>
						{note ? (
							<NoteEditor note={note} onNoteChange={onNoteChange} />
						) : (
							<Info
								shouldShowSpinner={shouldShowSpinner}
								msg={'Note not found! :('}
							/>
						)}
					</div>
				</Col>
			</Row>
		</div>
	);
}
