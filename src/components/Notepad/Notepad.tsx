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
	const [notes, setNotes] = useState<NoteItem[]>([]);
	const [note, setNote] = useState<NoteItem | null>(null);
	const [noteForDeletion, setNoteForDeletion] = useState<NoteItem | null>(null);
	const [isLoadingNote, setIsLoadingNote] = useState(false);
	const [isLoadingNotes, setIsLoadingNotes] = useState(false);
	const navigate = useNavigate();
	const prevNoteRef = useRef<NoteItem | null>(null);
	const isLargeScreen = useMatchMedia('(min-width: 992px)');

	useEffect(() => {
		getNotes();
		document
			.querySelector('#manifest-placeholder')
			.setAttribute('href', '/manifest-notepad.json');
	}, []);

	useEffect(() => {
		if (noteId) displayNote();
	}, [noteId, notes]);

	useEffect(() => {
		removePrevNoteIfEmpty();
		prevNoteRef.current = note;
	}, [note]);

	useEffect(() => cleanup, []);

	function cleanup() {
		removePrevNoteIfEmpty();
	}

	function removePrevNoteIfEmpty(): void {
		const previousNote = prevNoteRef.current;
		const previousNotSelected = previousNote && (!note || previousNote.id !== note.id);
		if (previousNotSelected && previousNote.text === '') deleteNote(previousNote.id);
	}

	function onNoteChange(nId: string, text: string): void {
		const newNotes = notes.map((el) => {
			if (el.id === nId) {
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

	async function getNote(nId: string): Promise<NoteItem | null> {
		const api = await getUsersApi();
		try {
			return await api.searchNote(nId);
		} catch (error) {
			console.error(`Failed to fetch note with id ${nId}. Error: ${error.message}`);
		}
	}

	function displayNote(): void {
		const newNote = notes.find((noteItem) => noteItem.id === noteId) || null;
		setNote(newNote);
	}

	async function getNotes(): Promise<void> {
		const api = await getUsersApi();

		setIsLoadingNotes(true);
		api.searchNotes()
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

	async function deleteNote(nId: string): Promise<void> {
		console.log('Deleting note', nId);
		const api = await getUsersApi();

		api.deleteNote(nId)
			.then(() => {
				if (noteId === nId) navigateToList();
				const filteredNotes = notes.filter((it) => it.id !== nId);
				setNotes(filteredNotes);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	async function createEmptyNote(): Promise<void> {
		const api = await getUsersApi();

		const newNoteItem = new NoteItem();
		newNoteItem.creationDate = new Date().toISOString();
		newNoteItem.text = '';

		console.log('Adding new note', newNoteItem);
		setIsLoadingNote(true);

		let nId: string | undefined;
		try {
			const result = await api.addNote(newNoteItem);
			console.log('Got response from API', result);
			nId = result.id;
		} catch (error) {
			console.error('Failed to create note. Got error:', error.message);
		}
		const addedNoteItem = await getNote(nId);
		setNotes([...notes, addedNoteItem]);
		navigateToNote(nId);
		setIsLoadingNote(false);
	}

	function onDeleteNoteClick(nId: string): void {
		const noteForDeletion = notes.find((it) => it.id === nId);
		if (!noteForDeletion) {
			console.warn(`Cannot find note with id ${nId}`);
			return;
		}

		setNoteForDeletion(noteForDeletion);
	}

	function navigateToList(): void {
		navigate('/notepad');
	}

	function navigateToNote(nId: string): void {
		navigate(`/notepad/${nId}`);
	}

	function getNotePreviewLanes(): string[] {
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
					<NoteList noteId={noteId} notes={notes} removeNote={onDeleteNoteClick} />
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
						onClick={navigateToList}
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
					{!isLoadingNote && note ? (
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
