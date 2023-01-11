import * as React from 'react';
import {
	createStyles,
	Theme,
	WithStyles,
	Divider,
	SwipeableDrawer,
	Typography,
	List,
	ListItem,
	ListItemText,
	Tabs,
	Box,
	Tab,
	Fab,
	IconButton,
	ListItemSecondaryAction
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { IState } from '../../../core/reducers/reducers';
import { connect } from 'react-redux';
import { drawerWidth } from '../../../core/constants';
import { RouteComponentProps, withRouter } from 'react-router';
import { toolbarRelativeProperties } from './styleUtilities';
import { Link } from 'react-router-dom';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { setCurrentSet, ActionTypes, setSets, loadSets } from '../../../core/actions';
import SongSet from '../../../core/models/SongSet';
import { Dispatch } from 'redux';
import Key from '../../../core/models/Key';
import { setsApi } from '../../../core/api/setsApi';
import { ThunkDispatch } from 'redux-thunk';

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
			position: 'relative',
			display: 'flex',
			alignItems: 'center',
			padding: theme.spacing(0, 1),
			...theme.mixins.toolbar,
			justifyContent: 'center'
		},
		setsEdit: {
			position: 'absolute',
			right: 0
		},
		content: {
			position: 'relative',
			...toolbarRelativeProperties('height', value => `calc(100% - ${value}px)`, theme),
			overflow: 'hidden auto'
		},
		fab: {
			position: 'absolute',
			bottom: theme.spacing(1),
			right: theme.spacing(1)
		}
	});

const mapStateToProps = ({ songs, sets, currentSet }: IState) => ({ songs, sets, currentSet });
const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, ActionTypes>) => ({
	setCurrentSet: (set: SongSet) => dispatch(setCurrentSet(set)),
	loadSets: () => dispatch(loadSets())
});

interface Props {
	isOpen: boolean;
	onMenuClick: () => void;
}

type AllProps = Props &
	ReturnType<typeof mapStateToProps> &
	ReturnType<typeof mapDispatchToProps> &
	WithStyles<typeof styles> &
	RouteComponentProps;

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
	className?: string;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
	<Typography
		component="div"
		role="tabpanel"
		hidden={value !== index}
		id={`simple-tabpanel-${index}`}
		aria-labelledby={`simple-tab-${index}`}
		{...other}
	>
		{children}
	</Typography>
);

const SongsDrawer = (props: AllProps) => {
	const [mainTab, setMainTab] = React.useState(0);
	const [setsTab, setSetsTab] = React.useState(0);
	const [editSets, setEditSets] = React.useState(false);

	React.useEffect(() => {
		if (props.history.location.pathname.includes('sets')) {
			if (!mainTab) setMainTab(1);
			if (!setsTab) setSetsTab(1);
		}
	}, []);

	const renderSongItems = () =>
		props.songs.map((s, i) => (
			<ListItem key={i} button component={Link} to={`/${s.slug}`}>
				<ListItemText primary={s.title} secondary={s.artist} />
			</ListItem>
		));

	const onSetClick = (slug: string) => () => {
		const set = props.sets.find(s => s.slug === slug);
		props.setCurrentSet(set);
		setSetsTab(1);
	};

	const onDeleteSetClick = (slug: string) => async () => {
		if (confirm('Are you sure you want to delete this set?')) await setsApi.deleteSet(slug);
		props.loadSets();
	};

	const renderSetItems = () =>
		props.sets.map((s, i) => (
			<ListItem key={i} button component={Link} to={`/sets/${s.slug}`} onClick={onSetClick(s.slug)}>
				<ListItemText primary={s.name} />
				{editSets && (
					<ListItemSecondaryAction>
						<IconButton component={Link} to={`/sets/${s.slug}/edit`} edge="end" aria-label="edit">
							<EditIcon />
						</IconButton>
						<IconButton onClick={onDeleteSetClick(s.slug)} edge="end" aria-label="delete" color="secondary">
							<DeleteIcon />
						</IconButton>
					</ListItemSecondaryAction>
				)}
			</ListItem>
		));

	const renderSetSongItems = () =>
		props.currentSet.songs.map((s, i) => (
			<ListItem key={i} button component={Link} to={`/sets/${props.currentSet.slug}/${s.slug}`}>
				<ListItemText primary={s.title} secondary={Key[s.songKey]} />
			</ListItem>
		));

	const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setMainTab(newValue);
		if (newValue && mainTab && setsTab) setSetsTab(0);
		setEditSets(false);
	};

	const toggleEditSets = () => setEditSets(!editSets);

	const renderTitle = () => {
		if (!mainTab) return 'My List';
		if (!setsTab) return 'Sets';
		return props.currentSet && props.currentSet.name;
	};

	return (
		<SwipeableDrawer
			className={props.classes.drawer}
			variant="persistent"
			anchor="left"
			open={props.isOpen}
			onOpen={props.onMenuClick}
			onClose={props.onMenuClick}
			classes={{
				paper: props.classes.drawerPaper
			}}
		>
			<div className={props.classes.drawerHeader}>
				<Typography variant="h6">{renderTitle()}</Typography>
				{mainTab === 1 && !setsTab && (
					<IconButton
						className={props.classes.setsEdit}
						{...(editSets && { color: 'primary' })}
						onClick={toggleEditSets}
					>
						{!editSets ? <MoreHorizIcon /> : <CloseIcon />}
					</IconButton>
				)}
				{mainTab === 1 && setsTab === 1 && props.currentSet && (
					<IconButton
						component={Link}
						to={`/sets/${props.currentSet.slug}/edit`}
						className={props.classes.setsEdit}
						color="primary"
					>
						<EditIcon />
					</IconButton>
				)}
			</div>
			<Divider />
			<section className={props.classes.content}>
				<TabPanel value={mainTab} index={0}>
					{props.songs && <List>{renderSongItems()}</List>}
				</TabPanel>
				<TabPanel value={mainTab} index={1}>
					<TabPanel value={setsTab} index={0}>
						{props.sets && <List>{renderSetItems()}</List>}
						<Fab className={props.classes.fab} color="primary" href="/sets/new">
							<AddIcon />
						</Fab>
					</TabPanel>
					<TabPanel value={setsTab} index={1}>
						{props.currentSet && <List>{renderSetSongItems()}</List>}
					</TabPanel>
				</TabPanel>
			</section>
			<Tabs
				value={mainTab}
				onChange={handleTabChange}
				variant="fullWidth"
				indicatorColor="secondary"
				textColor="secondary"
				aria-label="icon label tabs example"
			>
				<Tab icon={<LibraryMusicIcon />} label="SONGS" />
				<Tab icon={!mainTab || !setsTab ? <MenuBookIcon /> : <ArrowBackIcon />} label="SETS" />
			</Tabs>
		</SwipeableDrawer>
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(withRouter(SongsDrawer)));
