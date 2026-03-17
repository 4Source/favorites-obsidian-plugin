import { Command, Notice } from 'obsidian';
import CurrentPlugin from '../main';
import { CommunitySuggestModal } from 'src/modals/CommunitySuggestModal';
import { CommunityPlugin, fetchCommunityPluginList } from 'src/util/GitHub';

export default function (plugin: CurrentPlugin): Command {
	return {
		id: 'search-and-add-plugin-to-favorite-list',
		name: 'Search and add plugin to favorite list',
		callback: async () => {
			let items = await fetchCommunityPluginList();
			if (!items) {
				new Notice('Failed to fetch community plugins. See console for more information.');
				return;
			}

			// Filter out favorites
			plugin.loadFavoritePlugins();
			items = items.filter(value => !plugin.favoritePlugins.contains(value.id));

			if (items.length <= 0) {
				new Notice('No plugin left which is could be added to favorite list');
				return;
			}

			new CommunitySuggestModal<CommunityPlugin>(plugin.app, 'Select plugin which should be added to favorites list...', items, (result) => {
				plugin.favoritePlugins.push(result.id);
				plugin.saveFavoritePlugins();
				new Notice(`Added ${result.name} to favorite list`);
			}).open();
		},
	};
}