import { Theme } from '@material-ui/core';
import { CSSProperties } from '@material-ui/styles';
import { BaseCSSProperties } from '@material-ui/styles/withStyles';

type toolbarType = BaseCSSProperties[keyof BaseCSSProperties] | CSSProperties;

export const toolbarRelativeProperties = (
	property: keyof CSSProperties,
	modifier: (value: toolbarType) => any = (value: toolbarType) => value,
	theme: Theme
): any =>
	Object.keys(theme.mixins.toolbar).reduce((style, key) => {
		const value: toolbarType = theme.mixins.toolbar[key];
		if (key === 'minHeight') {
			return { ...style, [property]: modifier(value) };
		}

		const cssProp = value as CSSProperties;
		if ('minHeight' in cssProp) {
			return { ...style, [key]: { [property]: modifier(cssProp.minHeight) } };
		}
		return style;
	}, {});
