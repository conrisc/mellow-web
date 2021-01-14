import React, { useState, useEffect, useRef } from 'react';
import { useParams, withRouter, Link } from 'react-router-dom';
import { UsersApi, NoteItem } from 'what_api';
import { Row, Col, Button } from 'antd';

import { Info } from 'CommonComponents/Info';
import { NoteList } from './NoteList';
import { NoteEditor } from './NoteEditor';

function NotepadN(props) {
    const { noteId } = useParams();
    const [ notes, setNotes ] = useState([]);
    const [ note, setNote ] = useState(null);
    const [ shouldShowSpinner, setSpinnerState ] = useState(true);
    const prevNote = useRef(null);

    useEffect(() => {
        initActionButton();
        getNotes();
        document.querySelector('#manifest-placeholder').setAttribute('href', '/manifest-notepad.json');
    }, []);

    useEffect(() => {
        if (noteId)
            displayNote();
    }, [noteId, notes]);

    useEffect(() => {
        if (prevNote.current && (!note || prevNote.current.id !== note.id))
            validateNote(prevNote.current);
        prevNote.current = note;
    }, [note])

	useEffect(() => cleanup, []);
	
	function cleanup() {
        if (prevNote.current && (!note || prevNote.current.id !== note.id))
            validateNote(prevNote.current);
    }

    function validateNote(n) {
        console.log('validate note', n);
        if (n.text === '')
            removeNote(n.id);
    }

    function onNoteChange(noteId, text) {
        const newNotes = notes.map((el) => {
            if (el.id === noteId) {
                const updatedNote = new NoteItem(el.creationDate, text);
                updatedNote.id = el.id;
                return updatedNote;
            }
            return el;
        })
        setNotes(newNotes);
    }

    // function getNote() {
    //     const api = new UsersApi();
    //     const opts = { 
    //         id: noteId
    //     };
    //     api.searchNote(opts, (error, data, response) => {
    //         if (error) {
    //             console.error(error);
    //         } else {
    //             console.log('Found some notes', data, response);
    //             if (data.length > 0)
    //                 setNote(data[0])
    //         }
    //     });
    // }

    function displayNote() {
        const newNote = notes.find(noteItem => noteItem.id === noteId) || null;
        setNote(newNote);
    }

    function getNotes() {
        return new Promise((resolve, reject) => {
            const api = new UsersApi();

            api.searchNote({})
                .then(data => {
                    console.log('getNotes: ', data);
                    setNotes(data);
                    setSpinnerState(false);
                    resolve();
                }, error => {
                    console.error(error);
                    resolve();
                });
        });
    }

    function initActionButton() {
    }

    function removeNote(nId) {
        const api = new UsersApi();
        const opts = {
            id: nId
        };

        api.removeNote(nId)
            .then(() => {
                getNotes();
                if (noteId === nId)
                    props.history.push('/notepad');
            }, error => {
                console.error(error);
            });
    }

    function createEmptyNote() {
        const api = new UsersApi();

        const opts = { 
            noteItem: new NoteItem(Date(), '') // {NoteItem} Note item to add
        };

        api.addNote(opts)
            .then(data => {
                console.log('API called successfully.', data);
                getNotes();
                props.history.push(`/notepad/${data}`);
            }, error => {
                console.error(error);
            });
    }

    return (
        <div className="notepad">
            <Row className={"smooth-transform width-2x-sm" + (noteId ? ' transform-left-50' : '')} gutter={16}>
                <Col span={12}>
                    <NoteList noteId={noteId} notes={notes} updateNotes={getNotes} removeNote={removeNote} 
                        createEmptyNote={createEmptyNote} />
                </Col>
                <Col span={noteId ? 12 : 0}>
                    <Button href="/notepad" type="primary" icon={<i className="fas fa-angle-left"></i>} className="hide-on-lg" />
                    { 
                        note ?
                        <NoteEditor note={note} onNoteChange={onNoteChange} /> :
                        <Info shouldShowSpinner={shouldShowSpinner} msg={'Note not found! :('} />
                    }
                </Col>
            </Row>
        </div>
    );
}

let Notepad = withRouter(NotepadN);

export {
    Notepad
}