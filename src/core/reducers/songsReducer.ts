import { ActionTypes } from '../actions';
import SongSlim from '../models/SongSlim';
import Song from '../models/Song';

const initialState = <Song[]>null;

const songsReducer = (state = initialState, action: ActionTypes): typeof initialState => {
	switch (action.type) {
		case 'SET_SONGS':
			return action.value;
		default:
			return state;
	}
};

export default songsReducer;
