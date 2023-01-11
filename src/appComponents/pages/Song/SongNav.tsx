import * as React from 'react';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// tslint:disable-next-line: import-name
import MenuIcon from '@material-ui/icons/Menu';
// tslint:disable-next-line: import-name
import SettingsIcon from '@material-ui/icons/Settings';
import { createStyles, withStyles, Theme, WithStyles } from '@material-ui/core';
import { navStyle } from '../../common/NavStyle';

const styles = (theme: Theme) => {
	return createStyles({
		...navStyle,
		navButton: {
			color: '#FFF',
			zIndex: 1500,
			transition: theme.transitions.create('color', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen
			})
		},
		barIconOpen: {
			color: 'rgba(0, 0, 0, 0.54);'
		}
	});
};

interface Props extends WithStyles<typeof styles> {
	title: string;
	onMenuClick: () => void;
	onSettingsClick: () => void;
	drawerOpen: 'left' | 'right';
}

const SongNav = (props: Props) => {
	return (
		<>
			<AppBar className={props.classes.appBar}>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="menu"
						className={clsx(props.classes.navButton, {
							[props.classes.barIconOpen]: props.drawerOpen === 'left'
						})}
						onClick={props.onMenuClick}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={props.classes.title}>
						{props.title}
					</Typography>
					<IconButton
						edge="end"
						color="inherit"
						aria-label="menu"
						className={clsx(props.classes.navButton, {
							[props.classes.barIconOpen]: props.drawerOpen === 'right'
						})}
						onClick={props.onSettingsClick}
					>
						<SettingsIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
		</>
	);
};

export default withStyles(styles)(SongNav);
