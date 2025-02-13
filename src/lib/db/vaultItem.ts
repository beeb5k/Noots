import Dexie, { type EntityTable } from 'dexie';



const FilesNdFolders = new Dexie('Files&Folders') as Dexie & {
	items: EntityTable<App.vaultItem, 'id'>;
};

FilesNdFolders.version(1).stores({
	items: '&id,type,name,parentID,&contentID,children'
});

export { FilesNdFolders };
