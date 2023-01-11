import * as React from "react";
import Chord from "../../../core/models/Chord";
import Key from "../../../core/models/Key";
import { getChordString } from "../../../core/songUtils";
import styled from 'styled-components'


const ChordDisplay = ({ chord, songKey, capo }: ChordDisplayProps) => 
	(<ChordSpan>{getChordString(chord, songKey, capo)}</ChordSpan>);

export default ChordDisplay;

const ChordSpan = styled.span`
    margin-right: 4px;
    display: block;
    margin-bottom: -4px;
`;

interface ChordDisplayProps {
	chord: Chord;
	songKey: Key;
	capo: number;
}