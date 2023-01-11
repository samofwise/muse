import { Dispatch } from 'redux';
import { ActionTypes } from './actions';
import { useDispatch } from 'react-redux';

export const defaultDispatch = <T>(dispatch: Dispatch<ActionTypes>, action: (input: T) => ActionTypes) => (input: T) =>
	dispatch(action(input));

export const useDefaultDispatch = <T>(action: (input: T) => ActionTypes) => defaultDispatch(useDispatch(), action);
