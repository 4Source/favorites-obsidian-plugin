import { Command, Notice } from 'obsidian';
import CurrentPlugin from '../main';
import { CommunitySuggestModal } from 'src/modals/CommunitySuggestModal';
import { CommunityTheme, fetchCommunityThemeList } from 'src/util/GitHub';

export default function (plugin: CurrentPlugin): Command {
	return {
		id: 'search-and-add-theme-to-favorite-list',
		name: 'Add theme to favorite list',
		callback: async () => {
			let items = await fetchCommunityThemeList();
			if (!items) {
				new Notice('Failed to fetch community themes. See console for more information.');
				return;
			}

			// Filter out favorites
			plugin.loadFavoriteThemes();
			items = items.filter(value => !plugin.favoriteThemes.contains(value.name));

			if (items.length <= 0) {
				new Notice('No theme left which is could be added to favorite list');
				return;
			}

			new CommunitySuggestModal<CommunityTheme>(plugin.app, 'Select theme which should be added to favorites list...', items, (result) => {
				plugin.favoriteThemes.push(result.name);
				plugin.saveFavoritesThemes();
				new Notice(`Added ${result.name} to favorite list`);
			}).open();
		},
	};
}