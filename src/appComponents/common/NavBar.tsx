import * as React from 'react';
import { AppBar, Toolbar, Typography, Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { navStyle } from './NavStyle';

const styles = (theme: Theme) =>
	createStyles({
		...navStyle
	});

interface ThisProps {
	title: string;
}

type Props = ThisProps & WithStyles<typeof styles>;
const NavBar = (props: Props) => (
	<AppBar className={props.classes.appBar}>
		<Toolbar>
			<Typography variant="h6" className={props.classes.title}>
				{props.title}
			</Typography>
		</Toolbar>
	</AppBar>
);

export default withStyles(styles)(NavBar);
