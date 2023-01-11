import * as React from 'react';
import Song from '../../../core/models/Song';
import { songsApi as songApi } from '../../../core/api/songsApi';
import SongNav from './SongNav';
import SongsDrawer from './SongsDrawer';
// tslint:disable-next-line: import-name
import SwipeableViews from 'react-swipeable-views';
import * as KeyCode from 'keycode-js';
import { connect, MapStateToPropsParam } from 'react-redux';
import {
	ActionTypes,
	setSongs,
	setKey,
	setSets,
	setCurrentSet,
	setCapo,
	loadCapoOn,
	loadSongs,
	loadSets
} from '../../../core/actions';
import { IState } from '../../../core/reducers/reducers';
import SettingsDrawer from './SettingsDrawer';
import { RouteComponentProps, withRouter } from 'react-router';
import SongSlim from '../../../core/models/SongSlim';
import { setsApi } from '../../../core/api/setsApi';
import { defaultDispatch } from '../../../core/reduxUtilities';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import { toolbarRelativeProperties } from './styleUtilities';
import { drawerWidth } from '../../../core/constants';
import clsx from 'clsx';
import { ThunkDispatch } from 'redux-thunk';
import { sleep } from '../../../core/utils';
import SongDisplay from '../../common/Song/SongDisplay';

const styles = (theme: Theme) =>
	createStyles({
		songContent: {
			...toolbarRelativeProperties('height', value => `calc(100% - ${value}px)`, theme),
			overflow: 'hidden scroll',
			flexGrow: 1,
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen
			}),
			marginLeft: 0
		},
		songOpenLeftDrawer: {
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen
			}),
			marginLeft: drawerWidth
		},
		songOpenRightDrawer: {
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen
			}),
			marginRight: drawerWidth
		}
	});

const state = {
	drawerOpen: null as 'left' | 'right' | null,
	isSet: null as boolean,
	previousSong: null as Song,
	currentIndex: null as number,
	currentSong: null as Song,
	nextSong: null as Song,
	sliderIndex: 0,
	loadingSlider: false
};

const mapStateToProps = ({ currentSongPage, songs, currentSet }: IState) => ({ currentSongPage, songs, currentSet });

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, ActionTypes>) => ({
	loadSongs: () => dispatch(loadSongs()),
	loadSets: () => dispatch(loadSets()),
	loadCapoOn: () => dispatch(loadCapoOn()),
	setSongs: defaultDispatch(dispatch, setSongs),
	setCurrentSongKey: defaultDispatch(dispatch, setKey),
	setCurrentSongCapo: defaultDispatch(dispatch, setCapo),
	setCurrentSet: defaultDispatch(dispatch, setCurrentSet),
	setSets: defaultDispatch(dispatch, setSets)
});

interface Params {
	id: string;
	slug?: string;
}

type Props = ReturnType<typeof mapStateToProps> &
	ReturnType<typeof mapDispatchToProps> &
	RouteComponentProps<Params> &
	WithStyles<typeof styles>;

class SongContainer extends React.Component<Props, typeof state> {
	constructor(props: Props) {
		super(props);
		this.state = state;
	}

	async componentDidMount() {
		this.props.loadCapoOn();
		await this.props.loadSongs();
		await this.props.loadSets();
		await this.updateCurrentData();
		document.addEventListener('keydown', this.onKeyDown, false);
	}

	async componentDidUpdate(prevProps: Props, prevState: typeof state) {
		await this.updateCurrentData(prevProps, prevState);
	}

	// componentWillUnmount() {
	// 	window.removeEventListener('keypress', this.onKeyDown);
	// }

	updateCurrentData = async (prevProps?: Props, prevState?: typeof state) => {
		const prevPath = prevProps && prevProps.location.pathname;
		const currentPath = this.props.location.pathname;

		if (!prevProps || prevPath !== currentPath) {
			const slug = this.props.match.params.slug;
			const isSet = this.props.match.path.includes('sets');
			this.setState({ isSet });

			const didRedirect = await this.redirectIfNoSlug(slug, isSet);
			if (didRedirect) return;

			// set current set
			// Change to set if has moved into setAnew
			const currentSet = isSet && (await setsApi.getSet(this.props.match.params.id));
			if (currentSet) this.props.setCurrentSet(currentSet);

			// set current song
			const currentSong = await songApi.getSong(slug);
			if (!currentSong) {
				alert(`Cant find ${slug}`);
				return;
			}

			const currentSongs: SongSlim[] = !isSet ? this.props.songs : currentSet.songs;

			this.setState({ currentIndex: currentSongs.findIndex(s => s.slug === currentSong.slug) });

			// set prev, current and next Songs on load
			const newSongs = {
				previous: null as Song,
				current: null as Song,
				next: null as Song
			};

			const indexDifference = prevState && prevState.currentIndex - this.state.currentIndex;
			const isSwipe = switchcase({ 1: 'left', '-1': 'right' }, null)(indexDifference);

			if (prevState) {
				if (isSwipe === 'right') {
					newSongs.previous = newSongs.current;
					newSongs.current = newSongs.next;
				} else if (isSwipe === 'left') {
					newSongs.next = newSongs.current;
					newSongs.current = newSongs.previous;
				}
			}

			const newSongKeys = Object.keys(newSongs) as (keyof typeof newSongs)[];
			await Promise.all(
				newSongKeys.map(async (key, i) => {
					const index = this.state.currentIndex + i - 1;
					if (!newSongs[key] && index >= 0 && index <= currentSongs.length - 1) {
						const song = await songApi.getSong(currentSongs[this.state.currentIndex + i - 1].slug);
						newSongs[key] = song;
					}
				})
			);

			this.setState({ loadingSlider: true }, () =>
				this.setState(
					{
						previousSong: newSongs.previous,
						currentSong: newSongs.current,
						nextSong: newSongs.next,
						sliderIndex: this.state.currentIndex === 0 ? 0 : 1
					},
					() => this.setState({ loadingSlider: false })
				)
			);

			// set current song info
			const currentSetSong = currentSet && currentSet.songs.find(s => s.slug === slug);
			this.props.setCurrentSongKey(currentSetSong ? currentSetSong.songKey : currentSong.defaultKey);
			this.props.setCurrentSongCapo(currentSetSong ? currentSetSong.capo : 0);
		}
	};

	onKeyDown = (e: KeyboardEvent): any => {
		switch (e.keyCode) {
			case KeyCode.KEY_RIGHT:
				this.changeSong('next');
				break;
			case KeyCode.KEY_LEFT:
				this.changeSong('previous');
				break;
		}
	};

	redirectIfNoSlug = async (slug: string, isSet: boolean) => {
		if (!slug) {
			if (!isSet) {
				const defaultSlug = this.props.songs[0].slug;
				this.props.history.replace(defaultSlug);
			} else {
				const set = await setsApi.getSet(this.props.match.params.id);
				const defaultSlug = set.songs[0].slug;
				this.props.history.replace(`${set.slug}/${defaultSlug}`);
			}
		}
		return !slug;
	};

	toggleLeftBar = () => {
		this.setState(prev => ({ drawerOpen: prev.drawerOpen === 'left' ? null : 'left' }));
	};

	toggleRightBar = () => {
		this.setState(prev => ({ drawerOpen: prev.drawerOpen === 'right' ? null : 'right' }));
	};

	// change to only history push, catch and update all songs etc in updateData
	onSwipe = async (newIndex: number, oldIndex: number) => {
		if (newIndex > oldIndex) {
			await this.changeSong('next'); // swipe right
		} else {
			await this.changeSong('previous'); // swipe left
		}
	};

	changeSong = async (type: 'next' | 'previous') => {
		this.setState({ sliderIndex: type === 'next' ? 2 : 0 });
		await sleep(500);
		this.setState(state => ({ currentIndex: state.currentIndex + (type === 'next' ? 1 : -1) }));
		const name = type === 'next' ? 'nextSong' : 'previousSong';
		this.props.history.push(this.state[name].slug);
	};

	getTitle = () => {
		const cases =
			this.state.currentIndex === 0
				? { 0: this.state.currentSong, 1: this.state.nextSong }
				: { 0: this.state.previousSong, 1: this.state.currentSong, 2: this.state.nextSong };

		const song = switchcase(cases)(this.state.sliderIndex);
		return song && song.title;
	};

	renderSwipeableView = () => {
		const { previousSong, currentSong, nextSong } = this.state;
		const views = [<SongDisplay key={1} {...{ ...this.props.currentSongPage, ...{ song: currentSong } }} />];
		if (previousSong) views.unshift(<SongDisplay {...{ song: previousSong, songKey: previousSong.defaultKey }} />);
		if (nextSong) views.push(<SongDisplay {...{ song: nextSong, songKey: nextSong.defaultKey }} />);

		return (
			<SwipeableViews
				index={this.state.sliderIndex}
				onChangeIndex={this.onSwipe}
				enableMouseEvents
				resistance
				animateHeight
				animateTransitions={!this.state.loadingSlider}
				className={clsx(this.props.classes.songContent, {
					[this.props.classes.songOpenLeftDrawer]: this.state.drawerOpen === 'left',
					[this.props.classes.songOpenRightDrawer]: this.state.drawerOpen === 'right'
				})}
			>
				{views}
			</SwipeableViews>
		);
	};

	render() {
		return (
			<>
				<SongNav
					title={this.getTitle()}
					drawerOpen={this.state.drawerOpen}
					onMenuClick={this.toggleLeftBar}
					onSettingsClick={this.toggleRightBar}
				/>
				<SongsDrawer isOpen={this.state.drawerOpen === 'left'} onMenuClick={this.toggleLeftBar} />
				{this.state.currentSong && this.props.currentSongPage.songKey && this.renderSwipeableView()}
				<SettingsDrawer isOpen={this.state.drawerOpen === 'right'} onSettingsClick={this.toggleRightBar} />
			</>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(withRouter(SongContainer)));

const switchcase = <_, T>(cases: T, defaultCase?: T[keyof T]) => (key: any) =>
	key in cases ? cases[key as keyof T] : defaultCase;
