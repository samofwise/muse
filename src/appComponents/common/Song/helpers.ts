import Chord from '../../../core/models/Chord';
import Song from '../../../core/models/Song';
import { WordChordPair } from './common';

export const getWordChordPairs = (song: Song): WordChordPair[] => {
	const { chords, words } = song;
	const locations = chords.map((c) => c.location).sort((a, b) => a - b);

	const wordsArray = splitByIndexesAroundWord(words, locations);
	console.log('locations', locations);
	console.log('wordsArray', wordsArray);
	const firstWordsIndex = chords[0].location == 0 ? 0 : -1;

	return wordsArray.map((w, i) => ({ ...w, chord: chords[i + firstWordsIndex] || null }));
};

const splitByIndexesAroundWord = (x: string, indexes: number[]) => {
	if (indexes[0] != 0) indexes.unshift(0);
	return indexes.reduce((array, _, i) => {
		const [current, next] = [indexes[i], indexes[i + 1]];
		const startOffset = current - findStartOfWord(x, current);
		const end = findStartOfWord(x, next)
		const section = x.substring(current - startOffset, end || x.length);
		return [...array, { words: section, offset: startOffset }];
	}, [] as WordsAndOffset[]);
};

const findStartOfWord = (x:string,  index: number) => {
    const search = x.slice(0, index + 1).search(/\S+$/);
    return search != -1 ? search : index;
}

interface WordsAndOffset {
	words: string;
	offset: number;
}
