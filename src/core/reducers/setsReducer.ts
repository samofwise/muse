import { ActionTypes } from '../actions';
import SongSlim from '../models/SongSlim';
import SongSet from '../models/SongSet';

const initialState = <SongSet[]>null;

const setsReducer = (state = initialState, action: ActionTypes): typeof initialState => {
	switch (action.type) {
		case 'SET_SETS':
			return action.value;
		default:
			return state;
	}
};

export default setsReducer;
