import { combineReducers } from 'redux';
import songsReducer from './songsReducer';
import currentSongReducer from './currentSongReducer';
import setsReducer from './setsReducer';
import currentSetReducer from './currentSetReducer';

export const appReducer = combineReducers({
	currentSongPage: currentSongReducer,
	songs: songsReducer,
	sets: setsReducer,
	currentSet: currentSetReducer
});

export type IState = ReturnType<typeof appReducer>;
// my list
// my sets
