import database from './database';
import SongSet from '../models/SongSet';
import { Document } from 'dynamoose/dist/Document';


export const setsDb = database.model<SongSet & Document>('Set', {
	slug: String,
	name: String,
	songs: {
		type: Array,
		schema: [
			{
				type: Object,
				schema: {
					slug: String,
					title: String,
					artist: String,
					songKey: Number,
					capo: Number
				}
			}
		]
	}
});
