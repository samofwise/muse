import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core';
import * as React from 'react';
import { drawerWidth } from '../../../core/constants';
import FullSong from '../../../core/models/FullSong';
import Song from '../../../core/models/Song';
import SettingsDrawer from './SettingsDrawer';
import SongNav from './SongNav';
import SongsDrawer from './SongsDrawer';
import { toolbarRelativeProperties } from './styleUtilities';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Virtual } from 'swiper';
import { useParams, useRouteMatch } from 'react-router-dom';
import { SongsContext } from '../../../core/contexts/SongsContext';
import { SetsContext } from '../../../core/contexts/SetsContext';
import SongSet from '../../../core/models/SongSet';
import SongDisplay from '../../common/Song/SongDisplay';

import 'swiper/swiper.less';

SwiperCore.use([Virtual]);

const SongContainer = () => {
	const theme = useTheme<Theme>();
	const styles = useStyles();
	const params = useParams<Params>();
	const [allSongs] = React.useContext(SongsContext);
	const [allSets] = React.useContext(SetsContext);

	const [songs, setSongs] = React.useState<FullSong[]>([]);
	const [index, setIndex] = React.useState(0);
	const [openDrawer, setOpenDrawer] = React.useState<'left' | 'right' | null>(null);

	React.useEffect(() => {
		const isSet = !!params.id;
		const currentSongs: FullSong[] = !isSet
			? convertSongsToFullSongs(allSongs)
			: convertSetToFullSongs(
					allSets.find((s) => s.slug == params.slug),
					allSongs
			  );

		setSongs(currentSongs);
		console.log('currentSongs', currentSongs);
	}, [allSongs]);

	const toggleLeftBar = () => setOpenDrawer((p) => (!p ? 'left' : null));
	const toggleRightBar = () => setOpenDrawer((p) => (!p ? 'right' : null));

	const getCurrentSong = () => songs[index];

	const realIndexChange = ({ activeIndex }: SwiperCore) => setIndex(activeIndex);

	const renderSwipeableView = () => (
		<Swiper
			className={styles.songContent}
			spaceBetween={10}
			slidesPerView={1}
			virtual
			onActiveIndexChange={realIndexChange}
			keyboard
		>
			{songs.map((s, i) => (
				<SwiperSlide key={s.slug} virtualIndex={i} className={styles.slide}>
					<SongDisplay songKey={s.songKey} capo={s.capo} song={s} />
				</SwiperSlide>
			))}
		</Swiper>
	);

	return (
		<>
			<SongNav
				title={getCurrentSong()?.title}
				drawerOpen={openDrawer}
				onMenuClick={toggleLeftBar}
				onSettingsClick={toggleRightBar}
			/>
			<SongsDrawer isOpen={openDrawer === 'left'} onMenuClick={toggleLeftBar} />
			{getCurrentSong() && renderSwipeableView()}
			<SettingsDrawer isOpen={openDrawer === 'right'} onSettingsClick={toggleRightBar} />
		</>
	);
};

export default SongContainer;

interface Params {
	id?: string;
	slug?: string;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		songContent: {
			...toolbarRelativeProperties('height', (value) => `calc(100% - ${value}px)`, theme),
			flexGrow: 1,
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen
			}),
			marginLeft: 0
		},
		slide:{
			overflow: 'auto'
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
	})
);

const convertSongsToFullSongs = (songs: Song[]) =>
	songs.map<FullSong>((s) => ({
		...s,
		songKey: s.defaultKey,
		capo: 0
	}));

const convertSetToFullSongs = (set: SongSet, allSongs: Song[]) =>
	set.songs.map<FullSong>((s) => ({
		...s,
		...allSongs.find((as) => s.slug === as.slug)
	}));
