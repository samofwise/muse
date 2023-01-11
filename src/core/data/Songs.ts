import Song from '../models/Song';
import database from './database';
import { Document } from 'dynamoose/dist/Document';

export const songsDb = database.model<Song & Document>('Song', {
	slug: String,
	title: String,
	artist: String,
	words: String,
	chords: {
		type: Array,
		schema: [
			{
				type: Object,
				schema: {
					chordDegree: Number,
					location: Number,
					suffix: String,
					baseNote: String
				}
			}
		]
	},
	defaultKey: Number
});
