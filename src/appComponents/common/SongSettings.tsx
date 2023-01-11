import * as React from 'react';
import { Typography, IconButton } from '@material-ui/core';
import KeySelection from './KeySelection';
import AsOptionsList from '../compCommon/AsOptionsList';
import Key from '../../core/models/Key';
import { numberOfKeys } from '../../core/constants';
import { getRange } from '../../core/utils';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { useSelector, useDispatch } from 'react-redux';
import { IState } from '../../core/reducers/reducers';
import { toggleCapoOn } from '../../core/actions';

interface Props {
	selectedKey: Key;
	onKeyChange: (key: Key) => any;
	selectedCapo: number;
	onCapoChange: (capo: number) => any;
	className?: string;
	showCapoOn?: boolean;
	maxItemsPerRow?: number;
}

const SongSettings = (props: Props) => {
	const dispatch = useDispatch();
	const capoOn = useSelector((s: IState) => s.currentSongPage.capoOn);
	const onSetCapoOn = () => dispatch(toggleCapoOn());

	return (
		<section className={props.className}>
			<Typography variant="subtitle1">Key</Typography>
			<KeySelection
				onKeyChange={props.onKeyChange}
				selectedKey={props.selectedKey}
				maxItemsPerRow={props.maxItemsPerRow}
			/>
			<Typography variant="subtitle1">Capo</Typography>
			{props.showCapoOn && (
				<IconButton onClick={onSetCapoOn}>
					<PowerSettingsNewIcon {...(!capoOn && { color: 'disabled' })} />
				</IconButton>
			)}
			<AsOptionsList
				data={getRange(0, numberOfKeys - 1)}
				selected={props.selectedCapo}
				onChange={props.onCapoChange}
				maxItemsPerRow={props.maxItemsPerRow}
			/>
		</section>
	);
};
export default SongSettings;
