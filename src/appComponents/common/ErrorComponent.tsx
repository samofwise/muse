import * as React from 'react';
import { FallbackProps } from 'react-error-boundary';

// tslint:disable-next-line: variable-name
const ErrorComponent = (props: FallbackProps) => (
	<div>
		<p>
			<strong>Oops! An error occured!</strong>
		</p>
		<p>Here’s what we know…</p>
		<p>
			<strong>Error:</strong> {props.error.toString()}
		</p>
	</div>
);

export default ErrorComponent;
