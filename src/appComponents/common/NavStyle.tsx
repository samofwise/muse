import { StyleRules, createStyles } from '@material-ui/styles';

export const navStyle = createStyles({
	appBar: {
		position: 'static',
		flexGrow: 1,
		background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
	},
	title: {
		flexGrow: 1,
		textAlign: 'center'
	}
});
