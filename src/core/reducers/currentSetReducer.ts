import { ActionTypes } from '../actions';
import SongSet from '../models/SongSet';

const initialState: SongSet = null;

const currentSetReducer = (state = initialState, action: ActionTypes): typeof initialState => {
	switch (action.type) {
		case 'SET_CURRENT_SET':
			return { ...action.value };
		default:
			return state;
	}
};

export default currentSetReducer;
