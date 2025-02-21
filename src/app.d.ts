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
			type: App.nodeType;
			name: string;
			parentID: string;
		}

		interface vaultFiles extends vaultItem {
			contentID: string;
		}

		interface vaultFolder extends vaultItem {
			children: string[];
		}

		type nodeType = 'folder' | 'file';
	}
}

export {};
