// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Vault {
			vaultName: string;
			vaultID: string;
			isFavorite: boolean;
		}

		interface vaultItem {
			id: string;
			type: 'folder' | 'file';
			name: string;
			parentID?: string;
			contentID?: string;
			children?: vaultItem[];
		}
		type nodeType = 'folder' | 'file';	
	}
}

export {};
