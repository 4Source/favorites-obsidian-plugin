import { CommunityItem, CommunityPluginsSettingTab, setIcon, setTooltip } from 'obsidian';
import MyPlugin from '../main';
import { around, dedupe } from 'monkey-around';
import { MONKEY_KEY_COMMUNITY_PLUGIN_SETTINGS_TAB_RENDER_INSTALLED_PLUGIN } from 'src/constants';

export default (context: CommunityPluginsSettingTab, plugin: MyPlugin) => around(context, {
	renderInstalledPlugin(oldMethod) {
		return dedupe(MONKEY_KEY_COMMUNITY_PLUGIN_SETTINGS_TAB_RENDER_INSTALLED_PLUGIN, oldMethod, function (item: CommunityItem, containerEl: HTMLElement, n: unknown, i: unknown, r: unknown) {
			console.debug('Call CommunityPluginsSettingTab.renderInstalledPlugin');
			oldMethod && oldMethod.apply(this, [item, containerEl, n, i, r]);

			// Load the favorite plugins
			plugin.loadFavoritePlugins();

			const selectedPluginID = item.id;
			const isFavorite = plugin.favoritePlugins.contains(selectedPluginID);

			const favEl = createDiv('clickable-icon extra-setting-button');

			plugin.registerDomEvent(favEl, 'click', () => {
				if (isFavorite) {
					plugin.favoritePlugins.remove(selectedPluginID);
				}
				else {
					plugin.favoritePlugins.push(selectedPluginID);
				}

				plugin.saveFavoritesPlugins();

				// Redraw
				this.render(false);
			});

			if (isFavorite) {
				setIcon(favEl, 'star-off');
				setTooltip(favEl, 'Unfavorite');
			}
			else {
				setIcon(favEl, 'star');
				setTooltip(favEl, 'Favorite');
			}

			// Add Favorite Icon to plugin control
			const controlEl: HTMLElement = this.installedPlugins.listEl.lastChild?.getElementsByClassName('setting-item-control')[0];
			controlEl.insertBefore(favEl, controlEl.children[0]);
		});
	},
});