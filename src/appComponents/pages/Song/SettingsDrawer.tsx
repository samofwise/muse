import * as React from 'react';
import {
	createStyles,
	Theme,
	WithStyles,
	Divider,
	SwipeableDrawer,
	Typography,
	ButtonGroup,
	Button,
	IconButton
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { IState } from '../../../core/reducers/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { drawerWidth, numberOfKeys } from '../../../core/constants';
import Key from '../../../core/models/Key';
import { setKey, setCapo, toggleCapoOn } from '../../../core/actions';
import { getRange } from '../../../core/utils';
import { toolbarRelativeProperties } from './styleUtilities';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import localStorageService from '../../../core/localStorageService';
import KeySelection from '../../common/KeySelection';
import AsOptionsList from '../../compCommon/AsOptionsList';
import SongSettings from '../../common/SongSettings';

const styles = (theme: Theme) =>
	createStyles({
		drawer: {
			width: drawerWidth,
			flexShrink: 0
		},
		drawerPaper: {
			width: drawerWidth
		},
		drawerHeader: {
			display: 'flex',
			alignItems: 'center',
			padding: theme.spacing(0, 1),
			...theme.mixins.toolbar,
			justifyContent: 'center'
		},
		content: {
			...toolbarRelativeProperties('height', value => `calc(100% - ${value}px)`, theme),
			overflow: 'hidden auto'
		}
	});

interface Props {
	isOpen: boolean;
	onSettingsClick: () => void;
}

type AllProps = Props & WithStyles<typeof styles>;

const SettingsDrawer = (props: AllProps) => {
	const { songKey: key, capo, capoOn } = useSelector((s: IState) => s.currentSongPage);
	const dispatch = useDispatch();
	const onSetKey = (key: Key) => dispatch(setKey(key));
	const onSetCapo = (capo: number) => dispatch(setCapo(capo));
	const onSetCapoOn = (capoOn: boolean) => dispatch(toggleCapoOn());

	const onClickCapoToggle = () => {
		onSetCapoOn(!capoOn);
		localStorageService.capoOn.set(!capoOn);
	};

	return (
		<SwipeableDrawer
			className={props.classes.drawer}
			variant="persistent"
			anchor="right"
			open={props.isOpen}
			onOpen={props.onSettingsClick}
			onClose={props.onSettingsClick}
			classes={{
				paper: props.classes.drawerPaper
			}}
		>
			<div className={props.classes.drawerHeader}>
				<Typography variant="h6">Settings</Typography>
			</div>
			<Divider />
			<SongSettings
				selectedKey={key}
				onKeyChange={onSetKey}
				selectedCapo={capo}
				onCapoChange={onSetCapo}
				showCapoOn
				className={props.classes.content}
				maxItemsPerRow={6}
			/>
			{/* <section className={props.classes.content}>
				<Typography variant="subtitle1">Key</Typography>
				<KeySelection onKeyChange={onSetKey} selectedKey={key} maxItemsPerRow={2} />
				<Typography variant="subtitle1">Capo</Typography>
				<IconButton onClick={onClickCapoToggle}>
					<PowerSettingsNewIcon {...(!capoOn && { color: 'disabled' })} />
				</IconButton>
				<AsOptionsList data={getRange(0, numberOfKeys)} maxItemsPerRow={2} selected={capo} onChange={onSetCapo} />
			</section> */}
		</SwipeableDrawer>
	);
};

export default withStyles(styles)(SettingsDrawer);
