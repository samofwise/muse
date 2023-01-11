import * as React from 'react';
import { setsApi } from '../api/setsApi';
import SongSet from '../models/SongSet';

export const SetsContext = React.createContext<[SongSet[], React.Dispatch<React.SetStateAction<SongSet[]>>]>([[], null]);

export const SetsProvider = ({ children }: React.PropsWithChildren<any>) => {
	const [sets, setSets] = React.useState<SongSet[]>([]);
	React.useEffect(() => {
		const fetch = async () => setSets(await setsApi.getSets());
		fetch();
	}, []);

	return <SetsContext.Provider value={[sets, setSets]}>{children}</SetsContext.Provider>;
};
