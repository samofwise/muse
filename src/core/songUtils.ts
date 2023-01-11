import Song from './models/Song';
import Key from './models/Key';
import Chord from './models/Chord';
import { allKeys, numberOfKeys, KeyType } from './constants';
import { getAllMatches, globalSlugify, newLinePattern } from './utils';

const chordLetterPattern = '[A-H]';
const sharpFlatPattern = '[#b♯♭]?';
const qualifierPattern = '(?:m|min|M|maj|aug|\\+|dim|-|Ø|sus)?';
const numberPattern = `${sharpFlatPattern}\\d+`;
const addPattern = `(?:add${numberPattern})?`;
const baseNotePattern = `${chordLetterPattern}${sharpFlatPattern}`;

const partChordPattern = `(${chordLetterPattern}${sharpFlatPattern})(${qualifierPattern}(?:${numberPattern})*${addPattern})(?:\\/(${baseNotePattern}))?`;
const wholeChordPattern = `(${partChordPattern})`;
const possibleChordBraketPattern = new RegExp(`\\[?${wholeChordPattern}(?:\\]|\\W*$)`, 'gm');

const inlinePattern = new RegExp(`\\[${wholeChordPattern}\\]`, 'gm');

export const convertOnSong = (songString: string) => {
	const { details, otherSections } = getSongDetails(songString);
	const isInlineSong = isInline(otherSections);

	const wordsAndChords = isInlineSong
		? parseInlineSong(otherSections, details.key)
		: parseChordAboveSong(otherSections, details.key);

	const song: Song = {
		slug: globalSlugify(details.title),
		defaultKey: details.key,
		title: details.title,
		artist: details.artist,
		...wordsAndChords
	};
	return song;
};

const isInline = (otherSections: string) => {
	const matches = getAllMatches(possibleChordBraketPattern, otherSections);
	const allAreBraketed = matches.every(m => {
		return /\[.*\]/.test(m[0]);
	});
	const allAreNotBraketed = matches.every(m => {
		return /^[^\[\]]*$/.test(m[0]);
	});

	if (!allAreBraketed && !allAreNotBraketed) {
		console.log(possibleChordBraketPattern);
		console.log(matches);
		throw 'There are mixed chord formats in this song';
	}

	return allAreBraketed;
};

const titlePattern = /Title: (.*)/;
const artistPattern = /(?:By: (.*)|Artist: (.*))/;
const keyPattern = /[Kk]ey: (.*)/;
const metadataTags = [titlePattern, artistPattern, keyPattern];

const getSongDetails = (song: string) => {
	const doubleNewLinePattern = /(?:\r\n\r\n|\r\r|\n\n)/;
	const sections = song.split(doubleNewLinePattern);
	const lastDetailsIndex = Math.max(...metadataTags.map(t => sections.findIndex(s => t.test(s))));
	const detailsSection = sections.splice(0, lastDetailsIndex + 1).join('\n\n');
	const otherSections = sections.join('\n\n');

	const details = { title: getTitle(detailsSection), artist: getArtist(detailsSection), key: getKey(detailsSection) };
	return { details, otherSections };
};

const getTitle = (detailsSection: string) => {
	const match = detailsSection.match(titlePattern);
	const matchedTitle = match && match.groups && match.groups[0];
	return (matchedTitle || detailsSection.split(newLinePattern)[0]).trim();
};

const getArtist = (detailsSection: string) => {
	const match = detailsSection.match(artistPattern);
	const matchedArtist = match && match[1];
	if (matchedArtist) {
		return matchedArtist.trim();
	}
	const secondLine = detailsSection.split(newLinePattern)[1];
	return secondLine && metadataTags.every(t => !t.test(secondLine)) ? secondLine.trim() : null;
};

const getKey = (song: string) => {
	const match = song.match(keyPattern);
	const matchedKey = match && match[1];
	if (!matchedKey) throw 'Details format incorrect: Key not found';

	const cleanKey = <keyof typeof Key>matchedKey.replace(/[\[|\]]/g, '').trim();
	const key = Key[cleanKey];
	return key;
};

export const parseInlineSong = (song: string, key: Key) => {
	const matches = getAllMatches(inlinePattern, song);
	const chords = convertMatchesToChords(matches, key);
	const words = getWords(song);
	return { chords, words };
};

export const parseChordAboveSong = (song: string, key: Key) => {
	throw 'Not Implemented Yet';
};

const getChord = (chordDegree: number, songKey: Key, capo: number = 0) => {
	const semiToneDifference = chordDegree;
	const unboundedChordValue = Number(songKey) + semiToneDifference - capo - 1;
	const chordIndex = ((unboundedChordValue + numberOfKeys) % numberOfKeys) + 1;
	return Key[chordIndex];
};

const getWords = (song: string) => song.replace(inlinePattern, '');

const convertMatchesToChords = (matches: RegExpExecArray[], key: Key) => {
	const chords = <Chord[]>[];
	let charsRemoved = 0;
	for (const match of matches) {
		const location = match.index - charsRemoved;
		charsRemoved += match[0].length;
		const chordDetails = getChordDetails(match[1], key);

		chords.push({
			location,
			...chordDetails
		});
	}
	return chords;
};

const getChordDetails = (fullChord: string, key: Key) => {
	const { [1]: chord, [2]: suffix, [3]: baseNote } = fullChord.match(partChordPattern);
	return {
		suffix,
		chordDegree: getChordDegree(chord as KeyType, key),
		baseNote: baseNote && getChordDegree(baseNote as KeyType, key)
	};
};

const getChordDegree = (chord: KeyType, key: Key) => {
	const indexOfKey = key;
	const indexOfChord = Key[chord];
	const unboundedDifference = indexOfChord - indexOfKey;
	const chordDegree = (unboundedDifference + numberOfKeys) % numberOfKeys;
	console.log('getChordDegree', unboundedDifference, numberOfKeys);
	if (isNaN(chordDegree)) throw `getChordDegree failed - chord: ${chord}, key: ${key}`;
	return chordDegree;
};

export const getChordString = (chord: Chord, songKey: Key, capo: number = 0) => {
	const protectedCapo = capo || undefined;
	const chordNote = getChord(chord.chordDegree, songKey, protectedCapo);
	const baseNote = chord.baseNote ? getChord(chord.baseNote, songKey, protectedCapo) : null;
	return `${chordNote}${chord.suffix || ''}${baseNote ? `/${baseNote}` : ''}`;
};
