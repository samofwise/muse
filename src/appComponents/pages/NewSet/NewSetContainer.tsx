import * as React from 'react';
import Song from '../../../core/models/Song';
import { songsApi as songApi } from '../../../core/api/songsApi';
import Key from '../../../core/models/Key';
import { useSelector } from 'react-redux';
import { setSongs } from '../../../core/actions';
import { IState } from '../../../core/reducers/reducers';
import { useHistory, useLocation, useParams } from 'react-router';
import SongSlim from '../../../core/models/SongSlim';
import { useDefaultDispatch } from '../../../core/reduxUtilities';
import {
	AppBar,
	Toolbar,
	Typography,
	createStyles,
	withStyles,
	WithStyles,
	TextField,
	List,
	ListItem,
	ListItemText,
	Button,
	Theme,
	Box,
	ListSubheader,
	ListItemIcon,
	Checkbox,
	Divider,
	RootRef,
	ListItemSecondaryAction,
	IconButton
} from '@material-ui/core';
import { navStyle } from '../../common/NavStyle';
import SetSong from '../../../core/models/SetSong';
import { toolbarRelativeProperties } from '../Song/styleUtilities';
import clsx from 'clsx';
import SongList from './SongList';
import { SetList } from './SetList';
import { Draggable, DropResult } from 'react-beautiful-dnd';
import MenuIcon from '@material-ui/icons/Menu';
import DeleteIcon from '@material-ui/icons/Delete';
import KeySelection from '../../common/KeySelection';
import slugify from 'slugify';
import SongSet from '../../../core/models/SongSet';
import { setsApi } from '../../../core/api/setsApi';
import * as moment from 'moment';
import SongSettings from '../../common/SongSettings';
import { globalSlugify } from '../../../core/utils';
import SongDisplay from '../../common/Song/SongDisplay';

const styles = (theme: Theme) =>
	createStyles({
		...navStyle,
		content: {
			...toolbarRelativeProperties('height', value => `calc(100% - ${value}px)`, theme),
			display: 'flex',
			flexDirection: 'column',
			overflow: 'hidden'
		},
		button: {
			margin: theme.spacing(1)
		},
		title: { marginLeft: theme.spacing(1), maxWidth: 400 },
		songsSection: { display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0 },
		songsItem: { overflowY: 'auto', height: '100%', minWidth: 350 },
		setList: { flex: 1 },
		songList: { flex: 1 },
		songPreview: { flex: 2, display: 'flex', flexDirection: 'column' },
		songDisplay: { flex: 1, minHeight: 0, overflowY: 'auto' },
		keySelection: { margin: theme.spacing(2) },
		listHeader: {
			background: theme.palette.background.default
		}
	});

type Props = WithStyles<typeof styles>;

const defaultControlled = (value: any, setFunction: React.Dispatch<any>) => ({
	value,
	onChange: ({ currentTarget: { value } }: any) => setFunction(value)
});

type FullSetSong = SetSong & Song;

interface Params {
	slug?: string;
}

const NewSetContainer = (props: Props) => {
	const { slug: setSlug } = useParams<Params>();
	const isNew = !!setSlug;

	const history = useHistory();
	const [title, setTitle] = React.useState('');
	const [songsForSet, setSongsForSet] = React.useState([] as SetSong[]);
	const [currentSong, setCurrentSong] = React.useState(null as FullSetSong);
	const [selectedList, setSelectedList] = React.useState(null as 'sets' | 'songs');

	const allSongs = useSelector((s: IState) => s.songs);
	const setAllSongs = useDefaultDispatch(setSongs);

	const setCurrentSongFull = (song: Song | SetSong | SongSlim) => setCurrentSong({ ...currentSong, ...song });

	React.useEffect(() => {
		(async () => {
			const songs = await songApi.getSongs();
			setAllSongs(songs);

			if (!isNew) {
				const set = await setsApi.getSet(setSlug);
				setTitle(set.name);
				setSongsForSet(set.songs);
			}
		})();
	}, []);

	const itemClick = (song: SetSong | SongSlim, list: 'sets' | 'songs') => async () => {
		setSelectedList(list);
		const fullSong = await songApi.getSong(song.slug);
		const songKeyObject = song instanceof SongSlim && { songKey: fullSong.defaultKey };

		const combined = { ...song, ...songKeyObject, ...fullSong, capo: 0 };
		setCurrentSongFull(combined);
	};

	const isSelected = (s: { slug: string }, list: 'sets' | 'songs') =>
		selectedList === list && currentSong && currentSong.slug === s.slug;

	const renderSetSongs = () =>
		!songsForSet.length ? (
			<ListItem>
				<ListItemText primary="No Songs Selected" />
			</ListItem>
		) : (
			songsForSet.map((s, i) => (
				<Draggable key={i} draggableId={i.toString()} index={i}>
					{provided => (
						<RootRef rootRef={provided.innerRef}>
							<ListItem
								button
								onClick={itemClick(s, 'sets')}
								selected={isSelected(s, 'sets')}
								{...provided.draggableProps}
								{...provided.dragHandleProps}
							>
								<ListItemIcon>
									<MenuIcon />
								</ListItemIcon>
								<ListItemText primary={s.title} secondary={`${s.artist} | ${Key[s.songKey]}`} />
								<IconButton edge="end" aria-label="delete" onClick={removeSong(s)}>
									<DeleteIcon />
								</IconButton>
							</ListItem>
						</RootRef>
					)}
				</Draggable>
			))
		);

	const songChecked = (song: SongSlim) => async (e: React.FormEvent<HTMLElement>) => {
		e.stopPropagation();
		const index = songsForSet.findIndex(ss => ss.slug === song.slug);
		const newSongsForSet = [...songsForSet];
		const addSong = index === -1;
		if (!addSong) {
			newSongsForSet.splice(index, 1);
		} else {
			const setSong: SetSong = {
				...song,
				songKey: currentSong && currentSong.slug === song.slug ? currentSong.songKey : song.defaultKey,
				capo: currentSong && currentSong.slug === song.slug ? currentSong.capo : 0
			};
			newSongsForSet.push(setSong);
		}
		setSongsForSet(newSongsForSet);
		if (addSong) {
			itemClick(song, 'sets')();
		}
	};

	const removeSong = (song: SongSlim) => () => {
		const index = songsForSet.findIndex(ss => ss.slug === song.slug);
		const newSongsForSet = [...songsForSet];
		newSongsForSet.splice(index, 1);
		setSongsForSet(newSongsForSet);
	};

	const renderSongs = () =>
		allSongs.map((s, i) => (
			<ListItem key={i} button onClick={itemClick(s, 'songs')} selected={isSelected(s, 'songs')}>
				<ListItemIcon>
					<Checkbox
						edge="start"
						onClick={songChecked(s)}
						checked={songsForSet.some(ss => ss.slug === s.slug)}
						tabIndex={-1}
						disableRipple
					/>
				</ListItemIcon>
				<ListItemText primary={s.title} secondary={s.artist} />
			</ListItem>
		));

	const isUnchanged = ({ destination, source }: DropResult) =>
		destination.droppableId === source.droppableId && destination.index === source.index;

	const singleColumnMove = <T, _>(result: DropResult, items: T[]) => {
		const { destination, source } = result;
		if (destination.droppableId !== source.droppableId) throw 'Not same column';

		const item = items.splice(source.index, 1)[0];
		items.splice(destination.index, 0, item);
		return items;
	};

	const onDragEnd = (result: DropResult) => {
		const { destination, source } = result;
		if (!destination || isUnchanged(result)) return;

		const newSongsForSet = singleColumnMove(result, [...songsForSet]);
		setSongsForSet(newSongsForSet);
	};

	const selectKey = (key: Key) => {
		setCurrentSong({ ...currentSong, songKey: key });
		if (selectedList === 'sets') {
			const newSongsForSet = [...songsForSet];
			const song = newSongsForSet.find(s => s.slug === currentSong.slug);
			song.songKey = key;
			setSongsForSet(newSongsForSet);
		}
	};

	const selectCapo = (capo: number) => {
		setCurrentSong({ ...currentSong, capo });
		if (selectedList === 'sets') {
			const newSongsForSet = [...songsForSet];
			const song = newSongsForSet.find(s => s.slug === currentSong.slug);
			song.capo = capo;
			setSongsForSet(newSongsForSet);
		}
	};

	const leavePage = () => {
		const previousUrl = document.referrer;
		if (!previousUrl || !previousUrl.includes(location.origin) || previousUrl.includes(location.pathname)) {
			history.push('');
			return;
		}
		const relative = previousUrl.split(location.origin)[1];
		history.push(relative);
	};

	const onSave = async () => {
		if (!songsForSet.length) {
			alert('Please add songs to the set');
			return;
		}

		const name = title || moment().format('D/M/YYYY');
		const slug = globalSlugify(name);

		const set: SongSet = {
			name,
			slug,
			songs: songsForSet
		};

		if (isNew) await setsApi.createSet(set);
		else await setsApi.updateSet(set);

		history.push(`/sets/${slug}`);
	};
	return (
		<>
			<AppBar className={props.classes.appBar}>
				<Toolbar>
					<Typography variant="h6" className={props.classes.title}>
						New Set
					</Typography>
				</Toolbar>
			</AppBar>
			<Box className={props.classes.content}>
				<TextField
					id="standard-name"
					label="Title"
					{...defaultControlled(title, setTitle)}
					className={props.classes.title}
					margin="normal"
				/>
				<Box className={props.classes.songsSection}>
					{
						<SetList className={clsx(props.classes.setList)} onDragEnd={onDragEnd}>
							{renderSetSongs()}
						</SetList>
					}
					<Divider orientation="vertical" />
					{allSongs && (
						<SongList title="My Songs" className={clsx(props.classes.songList)}>
							{renderSongs()}
						</SongList>
					)}
					<Divider orientation="vertical" />
					<div className={clsx(props.classes.songsItem, props.classes.songPreview)}>
						{currentSong ? (
							<>
								<SongDisplay
									song={currentSong}
									songKey={currentSong.songKey}
									capo={currentSong.capo}
									capoOn
									className={props.classes.songDisplay}
								/>
								<SongSettings
									selectedKey={currentSong && currentSong.songKey}
									onKeyChange={selectKey}
									selectedCapo={currentSong.capo}
									onCapoChange={selectCapo}
									className={props.classes.keySelection}
								/>
								{/* <KeySelection
									className={props.classes.keySelection}
									onKeyChange={selectKey}
									selectedKey={currentSong && currentSong.songKey}
								/> */}
							</>
						) : (
							<Typography variant="body1">Select a Song</Typography>
						)}
					</div>
				</Box>
				<div>
					<Button variant="contained" color="primary" className={props.classes.button} onClick={onSave}>
						Save
					</Button>
					<Button variant="contained" className={props.classes.button} onClick={leavePage}>
						Cancel
					</Button>
				</div>
			</Box>
		</>
	);
};

export default withStyles(styles)(NewSetContainer);
