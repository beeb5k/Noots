import Dexie, { type EntityTable } from 'dexie';

interface vaultItem {
	id: string;
	type: 'folder' | 'file';
	name: string;
	contentID?: string;
	children?: vaultItem[];
}

const FilesNdFolders = new Dexie('Files&Folders') as Dexie & {
	items: EntityTable<vaultItem, 'id'>;
};

FilesNdFolders.version(1).stores({
	items: '&id,type,name,&contentID,children'
});

export type { vaultItem };
export { FilesNdFolders };
