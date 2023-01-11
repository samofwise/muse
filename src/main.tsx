import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './appComponents/App';
import 'typeface-roboto';
import { createStore, applyMiddleware } from 'redux';
import { appReducer } from './core/reducers/reducers';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

if (module && module.hot) module.hot.accept();

const store = createStore(appReducer, applyMiddleware(thunk));

ReactDOM.render(
	<Provider {...{ store }}>
		<App />
	</Provider>,
	document.getElementById('app')
);
