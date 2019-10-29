import React, { useState, useEffect, useRef } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { DevelopersApi, NoteItem } from 'what_api';

import { NoteList } from './NoteList';
import { NoteEditor } from './NoteEditor';
import { Spinner } from './Spinner';

function NotepadN(props) {
    const { noteId } = useParams();
    const [ notes, setNotes ] = useState([]);
    const [ note, setNote ] = useState(null);
    const prevNote = useRef(null);

    useEffect(() => {
        initActionButton();
        getNotes();
    }, []);

    useEffect(() => {
        if (noteId)
            displayNote();
    }, [noteId, notes]);

    useEffect(() => {
        if (prevNote.current && (!note || prevNote.current._id !== note._id))
            validateNote(prevNote.current);
        prevNote.current = note;
    }, [note])

	useEffect(() => cleanup, []);
	
	function cleanup() {
        if (prevNote.current && (!note || prevNote.current._id !== note._id))
            validateNote(prevNote.current);
    }

    function validateNote(n) {
        console.log('validate note', n);
        if (n.text === '')
            removeNote(n._id);
    }

    function onNoteChange(noteId, text) {
        const newNotes = notes.map((el) => {
            if (el._id === noteId) {
                const updatedNote = new NoteItem(el.creationDate, text);
                updatedNote._id = el._id;
                return updatedNote;
            }
            return el;
        })
        setNotes(newNotes);
    }

    // function getNote() {
    //     const api = new DevelopersApi();
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
        const newNote = notes.find(noteItem => noteItem._id === noteId) || null;
        setNote(newNote);
    }

    function getNotes() {
        return new Promise((resolve, reject) => {
            const api = new DevelopersApi();

            api.searchNote({}, (error, data, response) => {
                if (error)
                    console.error(error);
                else {
                    console.log('getNotes: ', data, response);
                    setNotes(data);
                }
            });
        });
    }

    function initActionButton() {
    }

    function removeNote(nId) {
        const api = new DevelopersApi();
        const opts = {
            id: nId
        };

        api.removeNote(nId, (error, data, response) => {
            if (error)
                console.error(error);
            else {
                getNotes();
                if (noteId === nId)
                    props.history.push('/notepad');
            }
        });
    }

    function createEmptyNote() {
        const api = new DevelopersApi();

        const opts = { 
            noteItem: new NoteItem(Date(), '') // {NoteItem} Note item to add
        };

        api.addNote(opts, (error, data, response) => {
            if (error) {
                console.error(error);
            } else {
                console.log('API called successfully.', data, response);
                getNotes();
                props.history.push(`/notepad/${data}`);
            }
        });
    }

    return (
        <div className="notepad">
            <div className="row">
                <div className={"col s12 l6" + (noteId !== undefined ? ' hide-on-med-and-down' : '' )}>
                    <NoteList noteId={noteId} notes={notes} updateNotes={getNotes} removeNote={removeNote} 
                        createEmptyNote={createEmptyNote} />
                </div>
                <div className={"col s12 l6"  + (noteId === undefined ? ' hide' : '' )}>
                    { 
                        note ?
                        <NoteEditor note={note} onNoteChange={onNoteChange} /> :
                        <Spinner />
                    }
                </div>
            </div>
        </div>
    );
}

let Notepad = withRouter(NotepadN);

export {
    Notepad
}