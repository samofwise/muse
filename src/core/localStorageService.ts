import * as ls from 'local-storage';

const createDefaultItem = <T>(key: string) => ({
	get: () => ls.get<T>(key),
	set: (value: T) => ls.set<T>(key, value)
});

const localStorageService = {
	capoOn: createDefaultItem<boolean>('capoOn')
};

export default localStorageService;
