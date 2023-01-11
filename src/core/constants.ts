import Key from './models/Key';

export const drawerWidth = 300;
export type KeyType = keyof typeof Key;

export const allKeys = <KeyType[]>Object.keys(Key).filter(k => isNaN(Number(k)));
export const allKeysKeys: Key[] = Object.keys(Key)
	.filter(k => isNaN(Number(k)))
	.map((k: KeyType) => Key[k]);
export const numberOfKeys = allKeys.length;
