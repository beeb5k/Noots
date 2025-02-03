import { vaultsDB } from '$lib/db/vaultsDB';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	if (typeof document === 'undefined') return;

	const vaultId = params.vaultid;
	const vault = await vaultsDB.Vaults.get(vaultId);

	if (!vault) {
		redirect(301, '/404');
	}

	return {
		vaultId,
		vault
	};
};
