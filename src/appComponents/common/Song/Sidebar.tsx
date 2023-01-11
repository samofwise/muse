import { createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import Key from '../../../core/models/Key';
import { SongInfoProps } from './common';

type SideProps = SongInfoProps & WithStyles<typeof sideStyles>;
const SideDetails = (props: SideProps) => (
	<aside className={props.classes.aside}>
		{props.songKey && <Typography variant="subtitle1">Key: {Key[props.songKey]}</Typography>}
		{(props.capo && (
			<Typography variant="subtitle1">
				Capo: {props.capo} {!props.capoOn ? '(Off)' : ''}
			</Typography>
		)) ||
			''}
	</aside>
);

const sideStyles = ({ mixins, spacing }: Theme) =>
	createStyles({
		aside: {
			float: 'right'
		}
	});

export default withStyles(sideStyles)(SideDetails);