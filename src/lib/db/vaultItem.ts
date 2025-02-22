import Dexie, { type EntityTable } from 'dexie';

const FilesNdFolders = new Dexie('Files&Folders') as Dexie & {
	files: EntityTable<App.vaultFiles, 'id'>;
	folders: EntityTable<App.vaultFolder, 'id'>;
};

FilesNdFolders.version(1).stores({
	files: '&id,type,name,parentID,contentID',
	folders: '&id,type,name,parentID,children'
});

export { FilesNdFolders };
