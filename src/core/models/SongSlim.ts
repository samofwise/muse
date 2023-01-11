import Key from './Key';

export default class SongSlim {
	constructor(s: SongSlim) {
		this.slug = s.slug;
		this.title = s.title;
		this.artist = s.artist;
		this.defaultKey = s.defaultKey;
	}
	slug: string;
	title: string;
	artist: string;
	defaultKey: Key;
}
