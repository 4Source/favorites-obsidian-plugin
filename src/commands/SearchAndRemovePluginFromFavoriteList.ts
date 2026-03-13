import { Command, Notice } from 'obsidian';
import CurrentPlugin from '../main';
import { CommunityPlugin, fetchCommunityPluginList } from 'src/util/GitHub';
import { CommunitySuggestModal } from 'src/modals/CommunitySuggestModal';

export default function (plugin: CurrentPlugin): Command {
	return {
		id: 'search-and-remove-plugin-from-favorite-list',
		name: 'Remove plugin from favorite list',
		callback: async () => {
			plugin.loadFavoritePlugins();
			if (plugin.favoritePlugins.length <= 0) {
				new Notice('Plugin favorite list is empty');
				return;
			}
			const communityItems = await fetchCommunityPluginList();
			const installedItems = Object.values(plugin.app.plugins.manifests);
			const items = plugin.favoritePlugins.map((value) => {
				return communityItems?.find((communityValue) => value === communityValue.id) || installedItems.find(installedValue => value === installedValue.id) as unknown as CommunityPlugin || { id: value, name: value, author: 'unknown' } as CommunityPlugin;
			});

			new CommunitySuggestModal<CommunityPlugin>(plugin.app, 'Select plugin which should be removed from the favorites list...', items, (result) => {
				plugin.favoritePlugins.remove(result.id);
				plugin.saveFavoritesPlugins();
				new Notice(`Removed ${result.name} from favorite list`);
			}).open();
		},
	};
}