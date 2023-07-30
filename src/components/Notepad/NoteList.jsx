import React from 'react';
import { Col, Row } from 'antd';

import { NoteCard } from './NoteCard';

export function NoteList(props) {
	const noteId = props.noteId;
	const notes = props.notes;

	return (
		<Row gutter={[8, 8]}>
			{notes.map((noteItem, index) => (
				<Col xs={24} sm={12} xl={8} key={noteItem.id}>
					<NoteCard
						note={noteItem}
						key={index}
						updateNotes={props.updateNotes}
						removeNote={props.removeNote}
						active={noteId === noteItem.id}
					/>
				</Col>
			))}
		</Row>
	);
}
