import db from '../data/db';
import SongSet from '../models/SongSet';
import SetSong from '../models/SetSong';

export namespace setsApi {
	export const getSets = async (): Promise<SongSet[]> => {
		return await db.sets.scan().exec();
	};

	export const getSet = async (slug: string): Promise<SongSet> => {
		return await db.sets.get(slug);
	};

	export const getFirstSong = async (slug: string): Promise<SetSong> => {
		return (await db.sets.get(slug)).songs[0];
	};

	export const createSet = async (set: SongSet): Promise<void> => {
		await db.sets.create(set);
	};

	export const updateSet = async (set: SongSet): Promise<void> => {
		await db.sets.update(set);
	};

	export const deleteSet = async (slug: string): Promise<void> => {
		await db.sets.delete(slug);
	};
}
