import Song from '../models/Song';
import { ActionTypes } from '../actions';
import Key from '../models/Key';

const initialState = {
	songKey: <Key>null,
	capo: <number>null,
	capoOn: <boolean>null
};

const currentSongReducer = (state = initialState, action: ActionTypes): typeof initialState => {
	switch (action.type) {
		case 'SET_KEY':
			return { ...state, songKey: action.value };
		case 'SET_CAPO':
			return { ...state, capo: action.value };
		case 'SET_CAPO_ON':
			return { ...state, capoOn: action.value };
		default:
			return state;
	}
};

export default currentSongReducer;
