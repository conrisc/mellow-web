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
    const actionButtonRef = useRef(null);

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
        const note = notes.find(noteItem => noteItem._id === noteId);
        const newNote = { ...note, text };
        const newNotes = notes.filter(noteItem => noteItem._id !== noteId);
        setNotes([...newNotes, newNote]);
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
        M.FloatingActionButton.init(actionButtonRef.current, {
            direction: 'right'
        });
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
                <div ref={actionButtonRef} className="fixed-action-btn">
                    <a className="btn-floating red">
                        <i className="large material-icons">mode_edit</i>
                    </a>
                    <ul>
                        <li><a className="btn-floating red"><i className="material-icons">insert_chart</i></a></li>
                        <li><a className="btn-floating yellow darken-1"><i className="material-icons">format_quote</i></a></li>
                        <li><a className="btn-floating green"><i className="material-icons">publish</i></a></li>
                        <li><a className="btn-floating blue"><i className="material-icons">attach_file</i></a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

let Notepad = withRouter(NotepadN);

export {
    Notepad
}