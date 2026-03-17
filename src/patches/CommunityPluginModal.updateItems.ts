import { around, dedupe } from 'monkey-around';
import { PLUGIN_ID } from 'src/constants';
import MyPlugin from '../main';
import { CommunityPluginModal } from 'obsidian';

const MONKEY_KEY = `${PLUGIN_ID}-CommunityPluginModal-updateItems`;

export default (context: CommunityPluginModal, plugin: MyPlugin) => around(context.constructor.prototype, {
	updateItems(oldMethod) {
		return dedupe(MONKEY_KEY, oldMethod, function () {
			console.debug('Call PluginBrowserModal.updateItems');

			// Load the plugin lists
			plugin.loadFavoritePlugins();
			plugin.loadInUsePlugins();
			plugin.loadKnownPlugins();

			const result = oldMethod && oldMethod.apply(this);

			// Add to the favorite plugins a tag to visualize it for the user
			plugin.favoritePlugins.forEach(id => {
				if (this.items && this.items[id]?.nameEl) {
					this.items[id].nameEl.createSpan({
						cls: 'flair',
						text: 'FAVORITE',
					});
				}
			});

			// Add to the in use plugins a tag to visualize it for the user
			Object.keys(plugin.inUsePlugins).forEach(id => {
				if (this.items && this.items[id]?.nameEl) {
					this.items[id].nameEl.createSpan({
						cls: 'flair',
						text: 'IN USE',
					});
				}
			});

			// Add to the known plugins a tag to visualize it for the user
			plugin.knownPlugins.forEach(id => {
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