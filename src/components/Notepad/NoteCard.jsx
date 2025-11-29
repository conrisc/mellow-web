import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export function NoteCard(props) {
	const note = props.note;
	const noteClasses = props.active ? 'note-active' : '';

	function handleRemoveClick(event) {
		event.stopPropagation();
		event.preventDefault();
		props.removeNote(note.id);
	}

	const lines = note.text?.split('\n') ?? [];

	return (
		<Link to={`/notepad/${note.id}`}>
			<Card
				className={`note smooth-bg ${noteClasses}`}
				bordered={false}
				size="small"
				headStyle={{ color: '#ffffff' }}
				title={<span>{lines.length > 0 ? lines[0] : ''}</span>}
				extra={
					<Button
						danger
						onClick={handleRemoveClick}
                        size="small"
                        type="text"
						icon={<FontAwesomeIcon icon={faTimes} />}
                        style={{
                            transition: 'background 0s',
                        }}
					/>
				}
			>
				<div className="note-content">
					{lines.slice(1, 11).map((el, i) => {
						return el ? <div key={i}>{el}</div> : <br key={i}></br>;
					})}
				</div>
			</Card>
		</Link>
	);
}
