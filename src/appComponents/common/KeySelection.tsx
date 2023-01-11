import * as React from 'react';
import { ButtonGroup, Button, Theme, createStyles } from '@material-ui/core';
import { splitAt } from '../../core/utils';
import { allKeys, allKeysKeys } from '../../core/constants';
import { withStyles, WithStyles } from '@material-ui/styles';
import Key from '../../core/models/Key';
import clsx from 'clsx';
import AsOptionsList from '../compCommon/AsOptionsList';

interface Props {
	onKeyChange: (key: Key) => void;
	selectedKey?: Key;
	maxItemsPerRow?: number;
	className?: string;
}

const getValue = (i: Key) => Key[i];

const KeySelection = ({ className, maxItemsPerRow: maxItemsPerRow, selectedKey, onKeyChange }: Props) => (
	<AsOptionsList
		data={allKeysKeys}
		maxItemsPerRow={maxItemsPerRow}
		selected={selectedKey}
		onChange={onKeyChange}
		getValue={getValue}
		{...{ className }}
	/>
);

export default KeySelection;
