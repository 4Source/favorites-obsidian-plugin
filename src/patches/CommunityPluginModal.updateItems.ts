import { around, dedupe } from 'monkey-around';
import { MONKEY_KEY_PLUGIN_BROWSER_MODAL_UPDATE_ITEMS } from 'src/constants';
import MyPlugin from '../main';
import { CommunityPluginModal } from 'obsidian';

export default (context: CommunityPluginModal, plugin: MyPlugin) => around(context.constructor.prototype, {
	updateItems(oldMethod) {
		return dedupe(MONKEY_KEY_PLUGIN_BROWSER_MODAL_UPDATE_ITEMS, oldMethod, function () {
			console.debug('Call PluginBrowserModal.updateItems');

			// Load the favorite plugins
			plugin.loadFavoritePlugins();

			const result = oldMethod && oldMethod.apply(this);

			// Add to the favorite plugins a tag to visualize it for the user
			plugin.favoritePlugins.forEach(id => {
				if (this.items && this.items[id]?.nameEl) {
					this.items[id].nameEl.createSpan({
						cls: 'flair',
						text: 'favorite',
					});
				}
			});

			return result;
		});
	},
});