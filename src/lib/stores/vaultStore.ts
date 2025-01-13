import { vaultsDB } from '$lib/db/vaultsDB';

/**
 * Retrieves all vaults from the database.
 *
 * This function asynchronously fetches all vaults stored in the `vaultsDB.Vaults` table
 * and returns them as an array of `App.Vault` objects.
 *
 * @returns {Promise<App.Vault[]>} A promise that resolves to an array of vault objects.
 */
export async function getAllVaults(): Promise<App.Vault[]> {
	return await vaultsDB.Vaults.toArray();
}

/**
 * Creates a new vault with the given name and adds it to the vaults database.
 *
 * @param vaultName - The name of the new vault to be created.
 * @returns A promise that resolves when the vault has been successfully added to the database.
 *
 * The function generates a unique ID for the new vault using `crypto.randomUUID()`
 * and sets the `isFavorite` property to `false` by default.
 */
export async function createNewVault(vaultName: string): Promise<void> {
	await vaultsDB.Vaults.add({
		vaultName,
		vaultID: crypto.randomUUID(),
		isFavorite: false
	});
}

/**
 * Updates the name of a vault in the database.
 *
 * @param vaultID - The unique identifier of the vault to be updated.
 * @param vaultName - The new name to be assigned to the vault.
 * @returns A promise that resolves when the vault name has been updated.
 */
export async function updateVaultName(vaultID: string, vaultName: string): Promise<void> {
	await vaultsDB.Vaults.update(vaultID, { vaultName });
}

/**
 * Deletes a vault from the database.
 *
 * @param vaultID - The unique identifier of the vault to be deleted.
 * @returns A promise that resolves when the vault has been successfully deleted.
 */
export async function deleteVault(vaultID: string, confirmationResponse : string): Promise<void> {
	if (confirmationResponse.toLowerCase() === 'yes') 
		await vaultsDB.Vaults.delete(vaultID);
}

/**
 * Toggles the favorite status of a vault in the database.
 *
 * This function updates the `isFavorite` status of a vault identified by its `vaultID`.
 * If the vault is currently marked as a favorite, it will be unmarked, and vice versa.
 *
 * @param vaultID - The unique identifier of the vault to be updated.
 * @param isFavorite - The current favorite status of the vault.
 * @returns A promise that resolves when the update operation is complete.
 */
export async function toggleVaultFavorite(vaultID: string, isFavorite: boolean): Promise<void> {
	await vaultsDB.Vaults.update(vaultID, { isFavorite: !isFavorite });
}
