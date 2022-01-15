import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd'

export function NoteCard(props) {
    const note = props.note;
    const noteClasses = props.active ? 'note-active' : '';

    function handleRemoveClick(event) {
        event.stopPropagation();
        event.preventDefault();
        props.removeNote(note.id);
    }

    const lines = note.text.split('\n');

    return (
        <Link to={`/notepad/${note.id}`}>
            <Card
                className={`note smooth-bg ${noteClasses}`}
                bordered={false}
                size="small"
                headStyle={{color: '#ffffff' }}
                title={<span>{lines.length > 0 ? lines[0] : ''}</span>}
                extra={
                    <div onClick={handleRemoveClick}>
                        <i className="fas fa-times text-red"></i>
                    </div>
                }
            >
                <div className="note-content">
                    {lines.slice(1,11).map((el, i)=> {
                        return el ? <div key={i}>{el}</div> : <br key={i}></br>;
                    })}
                </div>
            </Card>
        </Link>
    );
}
