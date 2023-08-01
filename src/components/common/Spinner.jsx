import React from 'react';
import { Spin } from 'antd';

export function Spinner({center, ...props}) {
	return (
		<div
			style={{
				display: center ? 'block' : 'inline-block',
				padding: 2,
				textAlign: 'center',
			}}
		>
			<Spin {...props} />
		</div>
	);
}
