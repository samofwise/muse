import db from '../data/db';
import Song from '../models/Song';
import SongSlim from '../models/SongSlim';
import { sleep } from '../utils';
import { ScanResponse } from 'dynamoose/dist/DocumentRetriever';

export namespace songsApi {
	export const getSongs = async (): Promise<Song[]> => {
		const songs = sortAndConvert(
			await db.songs
				.scan()
				// .attributes(['slug', 'title', 'artist', 'defaultKey'])
				.exec()
		);
		return songs;
	};

	export const getSpecificSongs = async (slugs: string[]): Promise<Song[]> => {
		const songs = sortAndConvert(
			await db.songs
				.scan()
				.where('slug')
				.in(slugs)
				.exec()
		);
		return songs;
	};

	export const getSong = async (slug: string): Promise<Song> => {
		const song = await db.songs.get(slug);
		return song ? new Song(song) : null;
	};

	const sortAndConvert = (results: ScanResponse<Song>) => {
		return results.sort((a, b) => a.title.localeCompare(b.title)).map(s => new Song(s));
	};

	const songQueue = [] as Song[];

	export const addSong = async (song: Song): Promise<void> => {
		songQueue.push(song);

		while (songQueue[0].slug !== song.slug) {
			await sleep(900);
		}

		await db.songs.batchPut([song]);
		songQueue.shift();
		console.log('uploaded');
	};
}
