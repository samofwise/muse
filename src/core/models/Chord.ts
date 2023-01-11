export default interface Chord {
	chordDegree: number; // 1 - root => 12 - highest. 2nd = 2, 4th = 6, 5th = 8, 6th = 10
	location: number;
	suffix: string;
	baseNote?: number;
}
