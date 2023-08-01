import React, { useState, useEffect, useRef } from 'react';
import './Notepad.css';
import { useParams, useNavigate } from 'react-router-dom';
import { NoteItem } from 'mellov_api';
import { Row, Col, Button, Modal } from 'antd';

import { Info } from 'CommonComponents/Info';
import { NoteList } from './NoteList';
import { NoteEditor } from './NoteEditor';
import { getUsersApi } from 'Services/mellowApi';
import { useMatchMedia } from 'Hooks/useMatchMedia';
import { Spinner } from 'CommonComponents/Spinner';

export function Notepad(props) {
	const { noteId } = useParams();
	const [notes, setNotes] = useState([]);
	const [note, setNote] = useState(null);
	const [noteForDeletion, setNoteForDeletion] = useState(null);
	const [isLoadingNote, setIsLoadingNote] = useState(false);
	const [isLoadingNotes, setIsLoadingNotes] = useState(false);
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
		if (previousNotSelected && previousNote.text === '') deleteNote(previousNote.id);
	}

	function onNoteChange(noteId, text) {
		const newNotes = notes.map((el) => {
			if (el.id === noteId) {
				const updatedNote = new NoteItem();
				updatedNote.id = el.id;
				updatedNote.creationDate = el.creationDate;
				updatedNote.text = text;
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

		setIsLoadingNotes(true);
		return api
			.searchNotes()
			.then((data) => {
				console.log('Fetched notes');
				setNotes(data);
				setIsLoadingNotes(false);
			})
			.catch((error) => {
				console.error(error);
				setIsLoadingNotes(false);
			});
	}

	function initActionButton() {}

	async function deleteNote(noteId) {
		console.log('Deleting note', noteForDeletion.id);
		const api = await getUsersApi();

		api.deleteNote(noteId)
			.then(() => {
				getNotes();
				if (noteId === noteId) redirectToList();
			})
			.catch((error) => {
				console.error(error);
			});
	}

	async function createEmptyNote() {
		const api = await getUsersApi();

		const noteItem = new NoteItem();
		noteItem.creationDate = new Date().toISOString();
		noteItem.text = '';

		setIsLoadingNote(true);
		api.addNote(noteItem)
			.then((data) => {
				console.log('API called successfully.', data);
				getNotes();
				navigateToNote(data.id);
				setIsLoadingNote(false);
			})
			.catch((error) => {
				console.error(error);
				setIsLoadingNote(false);
			});
	}

	function onDeleteNoteClick(noteId) {
		const noteForDeletion = notes.find((it) => it.id === noteId);
		if (!noteForDeletion) {
			console.warn(`Cannot find note with id ${noteId}`);
			return;
		}

		setNoteForDeletion(noteForDeletion);
	}

	function redirectToList() {
		navigate('/notepad');
	}

	function navigateToNote(noteId) {
		navigate(`/notepad/${noteId}`);
	}

	function getNotePreviewLanes() {
		const lanes = noteForDeletion?.text?.split('\n') ?? [];
		const previewLanes = lanes.slice(0, 5);
		return previewLanes.length < lanes.length ? [...previewLanes, '...'] : previewLanes;
	}

	const NotepadRow = (
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
						removeNote={onDeleteNoteClick}
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
						<Info showSpinner={isLoadingNote} msg={'Note not found :('} />
					)}
				</div>
			</Col>
		</Row>
	);

	return (
		<div className="notepad">
			{isLoadingNotes ? (
				<div style={{ margin: 16 }}>
					<Spinner center={true} size="large" />
				</div>
			) : (
				NotepadRow
			)}

			<Modal
				title="Confirm delete"
				open={!!noteForDeletion}
				onOk={() => {
					deleteNote(noteForDeletion.id);
					setNoteForDeletion(null);
				}}
				onCancel={() => {
					setNoteForDeletion(null);
				}}
			>
				<p>Are you sure you want to delete this note?</p>
				<div className="note-preview">
					{getNotePreviewLanes().map((it, index) => (
						<p key={index}>{it}</p>
					))}
				</div>
			</Modal>
		</div>
	);
}
