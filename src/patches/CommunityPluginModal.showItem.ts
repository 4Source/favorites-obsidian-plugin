import { around, dedupe } from 'monkey-around';
import MyPlugin from '../main';
import { MONKEY_KEY_PLUGIN_BROWSER_MODAL_SHOW_ITEMS } from 'src/constants';
import { CommunityItem, CommunityPluginModal } from 'obsidian';

export default (context: CommunityPluginModal, plugin: MyPlugin) => around(context.constructor.prototype, {
	showItem(oldMethod) {
		return dedupe(MONKEY_KEY_PLUGIN_BROWSER_MODAL_SHOW_ITEMS, oldMethod, async function (item: CommunityItem) {
			console.debug('Call CommunityPluginModal.showItem');

			const result = oldMethod && await oldMethod.apply(this, [item]);

			const infoEl = await this.detailsEl.getElementsByClassName('community-modal-info')[0];
			const infoNameEl = await infoEl?.getElementsByClassName('community-modal-info-name')[0];
			const buttonContainerEl = await infoEl?.getElementsByClassName('community-modal-button-container')[0];

			// Load the plugin lists
			plugin.loadFavoritePlugins();
			plugin.loadInUsePlugins();
			plugin.loadKnownPlugins();

			// Add to the favorite plugins a tag to visualize it for the user
			const isFavorite = plugin.favoritePlugins.contains(this.selectedItemId);
			if (isFavorite) {
				if (infoNameEl) {
					infoNameEl.createSpan({
						cls: 'flair',
						text: 'FAVORITE',
					});
				}
			}

			// Add to the in use plugins a tag to visualize it for the user
			if (Object.keys(plugin.inUsePlugins).contains(this.selectedItemId)) {
				if (infoNameEl) {
					infoNameEl.createSpan({
						cls: 'flair',
						text: 'IN USE',
					});
				}
			}

			// Add to the known plugins a tag to visualize it for the user
			if (plugin.knownPlugins.contains(this.selectedItemId)) {
				if (infoNameEl) {
					infoNameEl.createSpan({
						cls: 'flair',
						text: 'KNOWN',
					});
				}
			}

			plugin.registerDomEvent(buttonContainerEl?.createEl('button', { text: isFavorite ? 'Unfavorite' : 'Favorite' }), 'click', async () => {
				if (isFavorite) {
					plugin.favoritePlugins.remove(this.selectedItemId);
				}
				else {
					plugin.favoritePlugins.push(this.selectedItemId);
				}

				plugin.saveFavoritePlugins();

				// Redraw
				infoEl.detach();
				await this.showItem(this.items[this.selectedItemId]);
				this.update();
			});

			return result;
		});
	},
});