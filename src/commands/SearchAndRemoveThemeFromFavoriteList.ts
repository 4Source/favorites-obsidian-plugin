import { Command, Notice } from 'obsidian';
import CurrentPlugin from '../main';
import { CommunityTheme, fetchCommunityThemeList } from 'src/util/GitHub';
import { CommunitySuggestModal } from 'src/modals/CommunitySuggestModal';

export default function (plugin: CurrentPlugin): Command {
	return {
		id: 'search-and-remove-theme-from-favorite-list',
		name: 'Search and remove theme from favorite list',
		callback: async () => {
			plugin.loadFavoriteThemes();
			if (plugin.favoriteThemes.length <= 0) {
				new Notice('Theme favorite list is empty');
				return;
			}
			const communityItems = await fetchCommunityThemeList();
			const installedItems = Object.values(plugin.app.customCss.themes);
			const items = plugin.favoriteThemes.map((value) => {
				return communityItems?.find((communityValue) => value === communityValue.name) || installedItems.find(installedValue => value === installedValue.name) as unknown as CommunityTheme || { name: value, author: 'unknown' } as CommunityTheme;
			});

			new CommunitySuggestModal<CommunityTheme>(plugin.app, 'Select theme which should be removed from the favorites list...', items, (result) => {
				plugin.favoriteThemes.remove(result.name);
				plugin.saveFavoriteThemes();
				new Notice(`Removed ${result.name} from favorite list`);
			}).open();
		},
	};
}