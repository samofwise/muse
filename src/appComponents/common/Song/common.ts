import Chord from "../../../core/models/Chord";
import Key from "../../../core/models/Key";

export interface SongInfoProps {
	songKey: Key;
	capo?: number;
	capoOn?: boolean;
}

export interface WordChordPair {
	words: string;
	chord?: Chord;
	offset: number;
}