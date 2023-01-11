import slugify from 'slugify';

export const getAllMatches = (pattern: RegExp, data: string) => {
	const matches = <RegExpExecArray[]>[];
	let match;

	while ((match = pattern.exec(data)) !== null) {
		matches.push(match);
	}
	return matches;
};

type hasSlice<T> = { slice(start?: number, end?: number): T };
export const splitAt = <T extends hasSlice<T>>(x: T, index: number) => [x.slice(0, index), x.slice(index)];

export const getRange = (start: number, finish: number) =>
	Array.from(Array(finish - start + 1).keys()).map(k => Number(k) + start);

export const globalSlugify = (string: string) => slugify(string, { remove: /[(,\/)]/g, lower: true });

export const lengthInUtf8Bytes = (object: Object) => {
	const str = JSON.stringify(object);
	// Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
	const specialChars = encodeURIComponent(str).match(/%[89ABab]/g);
	return str.length + (specialChars ? specialChars.length : 0);
};

export const sleep = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));

export const promiseAllProgress = (promises: Promise<any>[], onProgress: (progress: number) => any) => {
	if (promises.length === 0) {
		onProgress(100);
		return Promise.resolve();
	}
	let d = 0;
	onProgress(0);
	for (const p of promises) {
		p.then(() => {
			d++;
			onProgress((d / promises.length) * 100);
		});
	}
	return Promise.all(promises);
};

export const newLinePattern = /(?:\r\n|\r|\n)/;
