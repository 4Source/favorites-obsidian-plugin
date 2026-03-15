import { CommunityItem, CommunityThemeModal } from 'obsidian';
import MyPlugin from '../main';
import { around, dedupe } from 'monkey-around';
import { MONKEY_KEY_THEME_BROWSER_MODAL_SHOW_ITEMS } from 'src/constants';

export default (context: CommunityThemeModal, plugin: MyPlugin) => around(context.constructor.prototype, {
	showItem(oldMethod) {
		return dedupe(MONKEY_KEY_THEME_BROWSER_MODAL_SHOW_ITEMS, oldMethod, async function (item: CommunityItem) {
			console.debug('Call CommunityThemeModal.showItem');

			const result = oldMethod && await oldMethod.apply(this, [item]);

			// Ignore the default theme
			if (this.selectedItemId === '') {
				return result;
			}

			const infoEl = await this.detailsEl.getElementsByClassName('community-modal-info')[0];
			const infoNameEl = await infoEl?.getElementsByClassName('community-modal-info-name')[0];
			const buttonContainerEl = await infoEl?.getElementsByClassName('community-modal-button-container')[0];

			// Load the favorite themes
			plugin.loadFavoriteThemes();
			const isFavorite = plugin.favoriteThemes.contains(this.selectedItemId);

			// Add to the favorite themes a tag to visualize it for the user
			if (isFavorite) {
				if (infoNameEl) {
					infoNameEl.createSpan({
						cls: 'flair',
						text: 'favorite',
					});
				}
			}

			plugin.registerDomEvent(buttonContainerEl?.createEl('button', { text: isFavorite ? 'Unfavorite' : 'Favorite' }), 'click', async () => {
				if (isFavorite) {
					plugin.favoriteThemes.remove(this.selectedItemId);
				}
				else {
					plugin.favoriteThemes.push(this.selectedItemId);
				}

				plugin.saveFavoritesThemes();

				// Redraw
				infoEl.detach();
				await this.showItem(this.items[this.selectedItemId]);
				this.update();
			});

			return result;
		});
	},
});