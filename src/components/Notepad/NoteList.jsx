import React from 'react';
import { Button, Col, Row } from 'antd';

import { NoteCard } from './NoteCard';

export function NoteList(props) {
	const noteId = props.noteId;
	const notes = props.notes;

	return (
		<div>
			<div>
				<Button
					type="primary"
					onClick={props.createEmptyNote}
					icon={<i className="fas fa-plus-circle"></i>}
				/>
			</div>
			<Row gutter={[8, 8]}>
				{notes.map((noteItem, index) => (
					<Col sm={12} xl={8} key={noteItem.id}>
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
		</div>
	);
}
