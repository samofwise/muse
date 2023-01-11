import * as React from 'react';
import { List, ListSubheader, withStyles, Theme, createStyles, WithStyles } from '@material-ui/core';
import clsx from 'clsx';

const styles = (theme: Theme) =>
	createStyles({
		songList: { overflowY: 'auto', height: '100%', minWidth: 350 },
		listHeader: { background: theme.palette.background.default }
	});

interface ThisProps {
	title: string;
	children: React.ReactNode;
	className?: string;
}

type Props = ThisProps & WithStyles<typeof styles>;

const SongList = (props: Props) => (
	<List
		className={clsx(props.className, props.classes.songList)}
		subheader={<ListSubheader className={props.classes.listHeader}>{props.title}</ListSubheader>}
	>
		{props.children}
	</List>
);

export default withStyles(styles)(SongList);
