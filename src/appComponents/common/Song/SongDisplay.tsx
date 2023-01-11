import * as React from 'react';
import './SongDisplay.less';
import { Theme, createStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { useTheme } from '@material-ui/styles';
import Song from '../../../core/models/Song';
import Key from '../../../core/models/Key';
import { getWordChordPairs } from './helpers';
import { newLinePattern } from '../../../core/utils';
import ChordDisplay from './ChordDisplay';
import styled from 'styled-components';
import { SongInfoProps, WordChordPair } from './common';
import Sidebar from './Sidebar';

const SongDisplay = (props: Props) => {
	const theme = useTheme<Theme>();
	const finalStyles = styles(theme);

	const capo = props.capo || 0;

	const combined = getWordChordPairs(props.song);

	const linesAndBreaks = insertLinesBreaks(combined);

	const elements = insertChords(linesAndBreaks, props.songKey, capo);

	return (
		<article className={clsx('song', props.className, finalStyles.song)}>
			<Sidebar {...props} />
			<Typography variant="h6">{props.song.title}</Typography>
			<Typography variant="subtitle1">{props.song.artist}</Typography>
			<section className="words">{elements}</section>
		</article>
	);
};

export default SongDisplay;

const styles = (theme: Theme) =>
	createStyles({
		song: {
			padding: theme.spacing(3)
		}
	});

interface ThisProps {
	song: Song;
	className?: string;
}

type Props = ThisProps & SongInfoProps;

const insertLinesBreaks = (groups: WordChordPair[]) => {
	const arrayGroups = groups.map((g) => {
		const split = g.words.split(newLinePattern);
		if (split.length === 1) return [g];

		const lines = split.map((l) => ({ words: l }));
		lines[0] = { ...g, words: lines[0].words };

		const linesAndBreaks = lines as (WordChordPair | JSX.Element)[];
		for (let i = linesAndBreaks.length - 1; i > 0; i--) {
			linesAndBreaks.splice(i, 0, <br />);
		}

		return linesAndBreaks.filter((item) => !('words' in item) || item.words || item.chord);
	});

	const allLinesAndBreaks = arrayGroups.reduce((p, c) => [...p, ...c], []);
	return allLinesAndBreaks;
};

const insertChords = (parts: (WordChordPair | JSX.Element)[], songKey: Key, capo: number) => {
	return parts.map((item, i) => {
		if (!('words' in item)) {
			return item;
		}
		const { words, chord, offset } = item;
		const [first, second] = offset ? splitAt(offset)(words) : [null, words];
		return (
			<StyledBlock key={i}>
				{first && <StyledWordChord>{first}</StyledWordChord>}
				<StyledWordChord>
					{item.chord && <ChordDisplay key={i} songKey={songKey} capo={capo} chord={chord} />}
					<span>{second || "\u00a0"}</span>
				</StyledWordChord>
			</StyledBlock>
		);
	});
};

const StyledBlock = styled.span`
	display: inline-block;
	white-space: nowrap;
`;

const StyledWordChord = styled.span`
	display: inline-block;
	white-space: pre;
`;

const splitAt = (index: number) => (x: string) => [x.slice(0, index), x.slice(index)];
