import Dexie, { type EntityTable } from 'dexie';

const vaultsDB = new Dexie('Vaults') as Dexie & {
	Vaults: EntityTable<App.Vault, 'vaultID'>;
};

vaultsDB.version(1).stores({
	Vaults: '&vaultID,vaultName,isFavorite'
});

export { vaultsDB };
