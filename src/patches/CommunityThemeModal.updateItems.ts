import { CommunityThemeModal } from 'obsidian';
import MyPlugin from '../main';
import { around, dedupe } from 'monkey-around';
import { MONKEY_KEY_THEME_BROWSER_MODAL_UPDATE_ITEMS } from 'src/constants';

export default (context: CommunityThemeModal, plugin: MyPlugin) => around(context.constructor.prototype, {
	updateItems(oldMethod) {
		return dedupe(MONKEY_KEY_THEME_BROWSER_MODAL_UPDATE_ITEMS, oldMethod, function () {
			console.debug('Call CommunityThemeModal.updateItems');

			// Load the theme lists
			plugin.loadFavoriteThemes();
			plugin.loadInUseThemes();
			plugin.loadKnownThemes();

			const result = oldMethod && oldMethod.apply(this);

			// Ignore the default theme
			if (this.selectedItemId === '') {
				return result;
			}

			// Add to the favorite themes a tag to visualize it for the user
			plugin.favoriteThemes.forEach(id => {
				if (this.items && this.items[id]?.nameEl) {
					this.items[id].nameEl.createSpan({
						cls: 'flair',
						text: 'FAVORITE',
					});
				}
			});

			// Add to the in use themes a tag to visualize it for the user
			Object.keys(plugin.inUseThemes).forEach(id => {
				if (this.items && this.items[id]?.nameEl) {
					this.items[id].nameEl.createSpan({
						cls: 'flair',
						text: 'IN USE',
					});
				}
			});

			// Add to the known themes a tag to visualize it for the user
			plugin.knownThemes.forEach(id => {
				if (this.items && this.items[id]?.nameEl) {
					this.items[id].nameEl.createSpan({
						cls: 'flair',
						text: 'KNOWN',
					});
				}
			});

			return result;
		});
	},
});