namespace FEtypes {
	interface IProps {
		isDialogOpen: boolean;
		data: { vault: App.Vault; vaultId: string };
	}

	interface vaultContentStructure {
		folders: App.vaultFolder[];
		files: App.vaultFiles[];
	}

	interface ISelectedItems {
		id: string;
		type: App.nodeType;
		parentID: string;
	}

	interface IisCreate {
		type: App.nodeType = "folder";
		isEnabled: boolean = false;
	}
}

export { FEtypes };
