import * as database from 'dynamoose';

try {
	database.aws.sdk.config.update({
		accessKeyId: 'AKIA5FHKA3AR673XIAGE',
		secretAccessKey: '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',
		region: 'ap-southeast-2'
	});
} finally {
}

export const resetDatabase = async () => {
	alert('Not Implemented');
	// const songKeys = (await songsApi.getSongs()).map(s => s.slug);
	// songKeys.forEach(async k => await db.songs.delete(k));
	// await db.songs.batchPut(data.songs);

	// const setKeys = (await setsApi.getSets()).map(s => s.slug);
	// setKeys.forEach(async k => await db.sets.delete(k));
	// await db.sets.batchPut(data.sets);
};

export default database;
