import * as React from 'react';
import { resetDatabase } from '../../../core/data/database';

const Reset = () => {
	const onClick = async () => {
		if (confirm('Do you really want to reset the db?')) {
			await resetDatabase();
			alert('done');
		}
	};

	return (
		<div>
			<button {...{ onClick }}>Reset Db</button>
		</div>
	);
};

export default Reset;
