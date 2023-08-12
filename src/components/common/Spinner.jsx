import React from 'react';
import { Spin } from 'antd';

export function Spinner({center, padding = 4, ...props}) {
	return (
		<div
			style={{
				display: center ? 'block' : 'inline-block',
				padding: padding,
				textAlign: 'center',
			}}
		>
			<Spin {...props} />
		</div>
	);
}
