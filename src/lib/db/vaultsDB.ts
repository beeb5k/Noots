import Dexie, { type EntityTable } from 'dexie';

interface Vaults {
	vaultName: string;
	vaultID: string;
	isFavorite: boolean;
}

const vaultsDB = new Dexie('Vaults') as Dexie & {
	Vaults: EntityTable<Vaults, 'vaultID'>;
};

vaultsDB.version(1).stores({
	Vaults: '&vaultID,vaultName,isFavorite'
});

export type { Vaults };
export { vaultsDB };
