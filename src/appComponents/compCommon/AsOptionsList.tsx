import * as React from 'react';
import { ButtonGroup, Button, Theme, createStyles } from '@material-ui/core';
import { withStyles, WithStyles, makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

const styles = (theme: Theme) =>
	createStyles({
		container: {
			margin: 5,
			flexWrap: 'wrap',
			padding: '1px 0 0 1px'
		},
		button: {
			textTransform: 'none',
			width: 40,
			border: '1px solid #b5b5b5 !important',
			borderRadius: 0,
			paddingLeft: 0,
			paddingRight: 0,
			marginTop: -1,
			marginLeft: -1
		},
		selected: {
			background: theme.palette.primary.main,
			color: '#FFF'
		}
	});

interface CompProps<T> {
	data: T[];
	onChange: (value: T) => any;
	selected?: T;
	maxItemsPerRow?: number;
	className?: string;
	getKey?: (item: T) => string;
	getValue?: (item: T) => string;
}

type Props<T> = CompProps<T> & WithStyles<typeof styles>;

const basicTypes = ['string', 'number', 'boolean'];

const AsOptionsList = <T, _>(props: Props<T>) => {
	const internalClasses =
		props.maxItemsPerRow &&
		makeStyles({
			container: {
				maxWidth: props.maxItemsPerRow * 39 + 1
			}
		})({});

	const { className } = props;

	if (!props.data.length) throw 'Data Array Required';

	const isBasicType = basicTypes.includes(typeof props.data[0]);
	if (!isBasicType) throw 'Complex types not supported';

	const getKey = props.getKey || ((item: T) => item);
	const getValue = props.getValue || ((item: T) => item);

	const dictionary = props.data.map(i => ({ key: getKey(i), value: getValue(i), item: i }));

	return (
		<ButtonGroup
			size="small"
			className={clsx(props.classes.container, internalClasses && internalClasses.container, className)}
			aria-label="small outlined button group"
		>
			{dictionary.map((i, j) => {
				const onClick = () => props.onChange(i.item);
				const isSelected = i.key === getKey(props.selected);
				return (
					<Button
						key={j}
						color={isSelected ? 'primary' : 'default'}
						className={clsx(props.classes.button, {
							[props.classes.selected]: isSelected
						})}
						{...{ onClick }}
					>
						{i.value}
					</Button>
				);
			})}
		</ButtonGroup>
	);
};

export default withStyles(styles)(AsOptionsList);
