import Song from './models/Song';
import Key from './models/Key';
import SongSlim from './models/SongSlim';
import SongSet from './models/SongSet';
import { IState } from './reducers/reducers';
import { ThunkAction } from 'redux-thunk';
import localStorageService from './localStorageService';
import { songsApi } from './api/songsApi';
import { setsApi } from './api/setsApi';

export interface Action<T> {
	type: T;
}

export interface ValueAction<T, R> extends Action<T> {
	value: R;
}

export const setValueAction = <T, R>(type: T, returnType: R) => (value: R): ValueAction<T, R> => ({
	type,
	value
});

type ThunkResult<R> = ThunkAction<R, IState, undefined, any>;

// Current song Setters
export const SET_KEY = <'SET_KEY'>'SET_KEY';
export const SET_CAPO = <'SET_CAPO'>'SET_CAPO';
export const SET_CAPO_ON = <'SET_CAPO_ON'>'SET_CAPO_ON';

export const setKey = setValueAction(SET_KEY, <Key>{});
export const setCapo = setValueAction(SET_CAPO, <number>{});
const setCapoOn = setValueAction(SET_CAPO_ON, <boolean>{});

export const loadCapoOn = (): ThunkResult<void> => dispatch => {
	const capoOn = localStorageService.capoOn.get();
	dispatch(setCapoOn(capoOn));
};

export const toggleCapoOn = (): ThunkResult<void> => (dispatch, getState) => {
	const state = getState();
	const newCapoOn = !state.currentSongPage.capoOn;
	dispatch(setCapoOn(newCapoOn));
	localStorageService.capoOn.set(newCapoOn);
};

// Songs setters
export const SET_SONGS = <'SET_SONGS'>'SET_SONGS';
export const setSongs = setValueAction(SET_SONGS, <Song[]>{});

export const loadSongs = (): ThunkResult<Promise<void>> => async dispatch => {
	const songs = await songsApi.getSongs();
	dispatch(setSongs(songs));
};

// Set setters
export const SET_SETS = <'SET_SETS'>'SET_SETS';
export const setSets = setValueAction(SET_SETS, <SongSet[]>{});
export const loadSets = (): ThunkResult<Promise<void>> => async dispatch => {
	const sets = await setsApi.getSets();
	dispatch(setSets(sets));
};

export const SET_CURRENT_SET = <'SET_CURRENT_SET'>'SET_CURRENT_SET';
export const setCurrentSet = setValueAction(SET_CURRENT_SET, <SongSet>{});

export type ActionTypes =
	| ReturnType<typeof setKey>
	| ReturnType<typeof setSongs>
	| ReturnType<typeof setCapo>
	| ReturnType<typeof setCapoOn>
	| ReturnType<typeof setSets>
	| ReturnType<typeof setCurrentSet>;
