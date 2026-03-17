import { CommunityItem, CommunityThemeModal } from 'obsidian';
import MyPlugin from '../main';
import { around, dedupe } from 'monkey-around';
import { PLUGIN_ID } from 'src/constants';

const MONKEY_KEY = `${PLUGIN_ID}-ThemePluginModal-showItems`;

export default (context: CommunityThemeModal, plugin: MyPlugin) => around(context.constructor.prototype, {
	showItem(oldMethod) {
		return dedupe(MONKEY_KEY, oldMethod, async function (item: CommunityItem) {
			console.debug('Call CommunityThemeModal.showItem');

			const result = oldMethod && await oldMethod.apply(this, [item]);

			// Ignore the default theme
			if (this.selectedItemId === '') {
				return result;
			}

			const infoEl = await this.detailsEl.getElementsByClassName('community-modal-info')[0];
			const infoNameEl = await infoEl?.getElementsByClassName('community-modal-info-name')[0];
			const buttonContainerEl = await infoEl?.getElementsByClassName('community-modal-button-container')[0];

			// Load the theme lists
			plugin.loadFavoriteThemes();
			plugin.loadInUseThemes();
			plugin.loadKnownThemes();

			// Add to the favorite themes a tag to visualize it for the user
			const isFavorite = plugin.favoriteThemes.contains(this.selectedItemId);
			if (isFavorite) {
				if (infoNameEl) {
					infoNameEl.createSpan({
						cls: 'flair',
						text: 'FAVORITE',
					});
				}
			}

			// Add to the in use themes a tag to visualize it for the user
			if (Object.keys(plugin.inUseThemes).contains(this.selectedItemId)) {
				if (infoNameEl) {
					infoNameEl.createSpan({
						cls: 'flair',
						text: 'IN USE',
					});
				}
			}

			// Add to the known themes a tag to visualize it for the user
			if (plugin.knownThemes.contains(this.selectedItemId)) {
				if (infoNameEl) {
					infoNameEl.createSpan({
						cls: 'flair',
						text: 'KNOWN',
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

				plugin.saveFavoriteThemes();

				// Redraw
				infoEl.detach();
				await this.showItem(this.items[this.selectedItemId]);
				this.update();
			});

			return result;
		});
	},
});