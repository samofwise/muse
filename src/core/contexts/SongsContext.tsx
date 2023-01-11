import * as React from 'react';
import { songsApi } from '../api/songsApi';
import Song from '../models/Song';

export const SongsContext = React.createContext<[Song[], React.Dispatch<React.SetStateAction<Song[]>>]>([[], null]);

export const SongsProvider = ({ children }: React.PropsWithChildren<any>) => {
	const [songs, setSongs] = React.useState<Song[]>([]);
	React.useEffect(() => {
		const fetch = async () => setSongs(await songsApi.getSongs());
		fetch();
	}, []);

	return <SongsContext.Provider value={[songs, setSongs]}>{children}</SongsContext.Provider>;
};
