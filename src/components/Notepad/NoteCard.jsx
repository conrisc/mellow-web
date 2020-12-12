import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd'

export function NoteCard(props) {
    const note = props.note;
    const noteColor = props.active ? 'note-active' : 'note-inactive';
    const textColor = props.active ? 'white-text' : 'black-text'

    function handleRemoveClick(event) {
        event.stopPropagation();
        event.preventDefault();
        props.removeNote(note.id);
    }


    return (
        <Link to={`/notepad/${note.id}`}>
            <Card
                className={`note ${noteColor} smooth-bg`}
                size="small"
                title={<span>Title</span>}
                extra={
                    <div onClick={handleRemoveClick}>
                        <i className="fas fa-times"></i>
                    </div>
                }
            >
                <div className={`card-content ${textColor}`}>
                    {note.text.split('\n', 11).map((el, i)=> {
                        return el ? <div key={i}>{el}</div> : <br key={i}></br>;
                    })}
                </div>
            </Card>
        </Link>
    );
}
