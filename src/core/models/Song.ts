import Chord from './Chord';
import Key from './Key';
import SongSlim from './SongSlim';

export default class Song extends SongSlim {
	constructor(s: Song) {
		super(s);
		this.words = s.words;
		this.chords = s.chords;
		this.defaultKey = s.defaultKey;
	}
	words: string;
	chords: Chord[];
	defaultKey: Key;
}
